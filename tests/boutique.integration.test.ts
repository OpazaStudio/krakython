// Tests d'intégration contre la base (DATABASE_URL) : réservation du stock en concurrence,
// passage « payée » idempotent, annulation qui rend le stock, webhook Stripe signé.
// Lancer : pnpm test:integration (crée puis supprime ses propres données).
import 'dotenv/config'
import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import Stripe from 'stripe'
import { getPayload, type Payload } from 'payload'
import config from '../src/payload.config'
import { annulerCommandeEnAttente, creerCommande, ErreurCommande, marquerPayee } from '../src/lib/boutique/commandes'
import { POST } from '../src/app/api/stripe/webhook/route'

let payload: Payload
let produitId: number
let tailleId: string
const commandes: number[] = []
const client = { nom: 'Test Intégration', email: 'test@example.org', mode: 'retrait' as const }

const stockTaille = async () => (await payload.findByID({ collection: 'produits', id: produitId, depth: 0 })).tailles?.[0]?.stock

before(async () => {
  process.env.STRIPE_WEBHOOK_SECRET ||= 'whsec_test_integration'
  process.env.STRIPE_SECRET_KEY ||= 'sk_test_factice'
  payload = await getPayload({ config })
  const p = await payload.create({
    collection: 'produits',
    context: { disableRevalidate: true },
    data: { nom: `Produit test ${Date.now()}`, actif: true, prix: 15, categorie: 'textile', tailles: [{ taille: 'M', stock: 1 }] },
  })
  produitId = p.id
  tailleId = p.tailles![0].id!
})

after(async () => {
  for (const id of commandes) await payload.delete({ collection: 'commandes', id, overrideAccess: true }).catch(() => {})
  // la collection interdit la suppression depuis l'API : on nettoie en SQL si besoin
  const db = (payload.db as unknown as { drizzle: { execute: (q: unknown) => Promise<unknown> } }).drizzle
  const { sql } = await import('@payloadcms/db-postgres/drizzle')
  if (commandes.length) await db.execute(sql`delete from commandes where id in (${sql.join(commandes.map((c) => sql`${c}`), sql`, `)})`)
  await payload.delete({ collection: 'produits', id: produitId, context: { disableRevalidate: true } })
  process.exit(0)
})

test('deux acheteurs pour le dernier article : un seul passe', async () => {
  const ligne = [{ produitId, tailleId, quantite: 1 }]
  const res = await Promise.allSettled([creerCommande(payload, client, ligne, { arrondi: false }), creerCommande(payload, client, ligne, { arrondi: false })])
  const ok = res.filter((r) => r.status === 'fulfilled')
  const ko = res.filter((r) => r.status === 'rejected')
  assert.equal(ok.length, 1)
  assert.equal(ko.length, 1)
  assert.ok((ko[0] as PromiseRejectedResult).reason instanceof ErreurCommande)
  for (const r of ok) commandes.push((r as PromiseFulfilledResult<Awaited<ReturnType<typeof creerCommande>>>).value.commande.id)
  assert.equal(await stockTaille(), 0)
})

test('annulation : le stock revient une seule fois', async () => {
  const id = commandes[0]
  assert.equal(await annulerCommandeEnAttente(payload, id), true)
  assert.equal(await annulerCommandeEnAttente(payload, id), false)
  assert.equal(await stockTaille(), 1)
})

test('paiement confirmé deux fois en même temps : une seule bascule (un seul envoi d’e-mails)', async () => {
  const { commande } = await creerCommande(payload, client, [{ produitId, tailleId, quantite: 1 }], { arrondi: true })
  commandes.push(commande.id)
  await payload.update({ collection: 'commandes', id: commande.id, overrideAccess: true, context: { systeme: true }, data: { paiement: { sessionId: 'cs_test_double' } } })
  const [a, b] = await Promise.all([marquerPayee(payload, 'cs_test_double', 'pi_1'), marquerPayee(payload, 'cs_test_double', 'pi_1')])
  assert.equal([a, b].filter(Boolean).length, 1)
  const relu = await payload.findByID({ collection: 'commandes', id: commande.id, overrideAccess: true })
  assert.equal(relu.statut, 'payee')
  assert.equal(relu.paiement?.paymentIntent, 'pi_1')
  assert.equal(relu.donSolidaire, 1) // 15 € tombe juste → 1 € d’arrondi
})

test('l’admin ne peut pas marquer « payée » ni revenir en arrière', async () => {
  const id = commandes[commandes.length - 1]
  await assert.rejects(payload.update({ collection: 'commandes', id, overrideAccess: true, data: { statut: 'en_attente' } }))
  await payload.update({ collection: 'commandes', id, overrideAccess: true, data: { statut: 'preparee' } })
  await payload.update({ collection: 'commandes', id, overrideAccess: true, data: { statut: 'retiree' } })
  await assert.rejects(payload.update({ collection: 'commandes', id, overrideAccess: true, data: { statut: 'annulee' } }))
})

test('webhook Stripe : signature vérifiée, session expirée → commande annulée et stock rendu', async () => {
  // la commande précédente a été remise : on remet un article en stock
  await payload.update({ collection: 'produits', id: produitId, context: { disableRevalidate: true, stockDirect: true }, data: { tailles: [{ id: tailleId, taille: 'M', stock: 1 }] } })
  const { commande } = await creerCommande(payload, client, [{ produitId, tailleId, quantite: 1 }], { arrondi: false })
  commandes.push(commande.id)
  await payload.update({ collection: 'commandes', id: commande.id, overrideAccess: true, context: { systeme: true }, data: { paiement: { sessionId: 'cs_test_expire' } } })
  assert.equal(await stockTaille(), 0)

  const corps = JSON.stringify({ id: 'evt_test', object: 'event', type: 'checkout.session.expired', data: { object: { id: 'cs_test_expire', object: 'checkout.session', metadata: {} } } })
  const mauvais = await POST(new Request('http://localhost/api/stripe/webhook', { method: 'POST', body: corps, headers: { 'stripe-signature': 't=1,v1=faux' } }))
  assert.equal(mauvais.status, 400)

  const signature = new Stripe('sk_test_factice').webhooks.generateTestHeaderString({ payload: corps, secret: process.env.STRIPE_WEBHOOK_SECRET! })
  const bon = await POST(new Request('http://localhost/api/stripe/webhook', { method: 'POST', body: corps, headers: { 'stripe-signature': signature } }))
  assert.equal(bon.status, 200)
  const relu = await payload.findByID({ collection: 'commandes', id: commande.id, overrideAccess: true })
  assert.equal(relu.statut, 'annulee')
  assert.equal(await stockTaille(), 1)
})

test('enregistrer une fiche produit ouverte avant une vente n’écrase pas le stock', async () => {
  await payload.update({ collection: 'produits', id: produitId, context: { disableRevalidate: true, stockDirect: true }, data: { tailles: [{ id: tailleId, taille: 'M', stock: 3 }] } })
  const { commande } = await creerCommande(payload, client, [{ produitId, tailleId, quantite: 2 }], { arrondi: false })
  commandes.push(commande.id)
  assert.equal(await stockTaille(), 1)
  // formulaire admin périmé : il renvoie encore « 3 »
  await payload.update({ collection: 'produits', id: produitId, context: { disableRevalidate: true }, data: { nom: 'Produit test renommé', tailles: [{ id: tailleId, taille: 'M', stock: 3 }] } })
  assert.equal(await stockTaille(), 1)
  // ajout explicite de 5 pièces
  await payload.update({ collection: 'produits', id: produitId, context: { disableRevalidate: true }, data: { tailles: [{ id: tailleId, taille: 'M', stock: 1, ajout: 5 } as never] } })
  assert.equal(await stockTaille(), 6)
  await annulerCommandeEnAttente(payload, commande.id)
  assert.equal(await stockTaille(), 8)
})

test('commande payée puis annulée par l’admin : un nouveau signal « payé » ne la ressuscite pas', async () => {
  const { commande } = await creerCommande(payload, client, [{ produitId, tailleId, quantite: 1 }], { arrondi: false })
  commandes.push(commande.id)
  await payload.update({ collection: 'commandes', id: commande.id, overrideAccess: true, context: { systeme: true }, data: { paiement: { sessionId: 'cs_test_rembourse' } } })
  assert.ok(await marquerPayee(payload, 'cs_test_rembourse', 'pi_r'))
  await payload.update({ collection: 'commandes', id: commande.id, overrideAccess: true, data: { statut: 'annulee' } })
  const stockApresAnnulation = await stockTaille()
  assert.equal(await marquerPayee(payload, 'cs_test_rembourse', 'pi_r', null, { reprise: true }), null)
  const relu = await payload.findByID({ collection: 'commandes', id: commande.id, overrideAccess: true })
  assert.equal(relu.statut, 'annulee')
  assert.equal(relu.annuleePar, 'admin')
  assert.equal(await stockTaille(), stockApresAnnulation)
})

test('paiement très lent après l’annulation automatique : la vente est gardée (webhook seulement)', async () => {
  const { commande } = await creerCommande(payload, client, [{ produitId, tailleId, quantite: 1 }], { arrondi: false })
  commandes.push(commande.id)
  await payload.update({ collection: 'commandes', id: commande.id, overrideAccess: true, context: { systeme: true }, data: { paiement: { sessionId: 'cs_test_lent' } } })
  const avant = await stockTaille()
  await annulerCommandeEnAttente(payload, commande.id)
  assert.equal(await stockTaille(), avant! + 1)
  assert.equal(await marquerPayee(payload, 'cs_test_lent', 'pi_l'), null) // page de retour : pas de reprise
  const repris = await marquerPayee(payload, 'cs_test_lent', 'pi_l', null, { reprise: true })
  assert.equal(repris?.statut, 'payee')
  assert.equal(repris?.stockReserve, true)
  assert.match(repris?.note ?? '', /annulation automatique/)
  assert.equal(await stockTaille(), avant)
})

test('webhook « payé » : e-mails marqués envoyés une seule fois', async () => {
  const { commande } = await creerCommande(payload, client, [{ produitId, tailleId, quantite: 1 }], { arrondi: false })
  commandes.push(commande.id)
  await payload.update({ collection: 'commandes', id: commande.id, overrideAccess: true, context: { systeme: true }, data: { paiement: { sessionId: 'cs_test_paye' } } })
  const corps = JSON.stringify({
    id: 'evt_paye',
    object: 'event',
    type: 'checkout.session.completed',
    data: { object: { id: 'cs_test_paye', object: 'checkout.session', payment_status: 'paid', payment_intent: 'pi_p', metadata: { commandeId: String(commande.id) } } },
  })
  const signature = new Stripe('sk_test_factice').webhooks.generateTestHeaderString({ payload: corps, secret: process.env.STRIPE_WEBHOOK_SECRET! })
  for (let i = 0; i < 2; i++) {
    const r = await POST(new Request('http://localhost/api/stripe/webhook', { method: 'POST', body: corps, headers: { 'stripe-signature': signature } }))
    assert.equal(r.status, 200)
  }
  const relu = await payload.findByID({ collection: 'commandes', id: commande.id, overrideAccess: true })
  assert.equal(relu.statut, 'payee')
  assert.equal(relu.emailsEnvoyes, true)
  assert.equal(relu.paiement?.paymentIntent, 'pi_p')
})

test('course annulation automatique / paiement : toujours payée, stock cohérent', async () => {
  await payload.update({ collection: 'produits', id: produitId, context: { disableRevalidate: true, stockDirect: true }, data: { tailles: [{ id: tailleId, taille: 'M', stock: 20 }] } })
  for (let i = 0; i < 10; i++) {
    const { commande } = await creerCommande(payload, { ...client, email: `course${i}@example.org` }, [{ produitId, tailleId, quantite: 1 }], { arrondi: false })
    commandes.push(commande.id)
    const s = `cs_test_course_${i}`
    await payload.update({ collection: 'commandes', id: commande.id, overrideAccess: true, context: { systeme: true }, data: { paiement: { sessionId: s } } })
    await Promise.all([annulerCommandeEnAttente(payload, commande.id), marquerPayee(payload, s, 'pi_c', null, { reprise: true })])
    const relu = await payload.findByID({ collection: 'commandes', id: commande.id, overrideAccess: true })
    assert.equal(relu.statut, 'payee')
    assert.equal(relu.stockReserve, true)
  }
  assert.equal(await stockTaille(), 10)
})
