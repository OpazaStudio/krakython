import type { Payload } from 'payload'
import { revalidatePath } from 'next/cache'
import type Stripe from 'stripe'
import type { Commande } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { annulerCommandeEnAttente, annulerParSession, marquerPayee, prendreEnvoiEmails, rendreEnvoiEmails, trouverParSession, type LigneResolue } from './commandes'
import { notifierCommandePayee } from './emails'
import { getStripe } from './stripe'

// Pont entre les commandes et Stripe Checkout (page de paiement hébergée par Stripe).

// Stripe impose au moins 30 min : une minute de marge pour la latence.
export const EXPIRATION_SESSION_S = 31 * 60

export async function creerSessionPaiement(commande: Commande, lignes: LigneResolue[], montants: { frais: number; don: number }) {
  const base = getServerSideURL()
  const meta = { commandeId: String(commande.id), numero: commande.numero }
  return getStripe().checkout.sessions.create({
    mode: 'payment',
    locale: 'fr',
    customer_email: commande.clientEmail,
    client_reference_id: String(commande.id),
    metadata: meta,
    payment_intent_data: { metadata: meta, description: `Boutique Krakython · ${commande.numero}` },
    expires_at: Math.floor(Date.now() / 1000) + EXPIRATION_SESSION_S,
    line_items: [
      ...lignes.map((l) => ({
        quantity: l.quantite,
        price_data: { currency: 'eur', unit_amount: l.prixCentimes, product_data: { name: `${l.produit.nom}${l.taille ? ` · taille ${l.taille}` : ''}` } },
      })),
      ...(montants.don > 0
        ? [{ quantity: 1, price_data: { currency: 'eur', unit_amount: montants.don, product_data: { name: 'Don solidaire · reversé à la Fédération Leucémie Espoir' } } }]
        : []),
    ],
    ...(commande.livraison?.mode === 'colissimo'
      ? { shipping_options: [{ shipping_rate_data: { type: 'fixed_amount' as const, display_name: 'Colissimo à domicile', fixed_amount: { amount: montants.frais, currency: 'eur' } } }] }
      : {}),
    // Retours par des routes serveur (vérification Stripe, stock, régénération des pages), qui redirigent ensuite vers les pages d'affichage.
    success_url: `${base}/api/boutique/retour?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/api/boutique/annulation?session_id={CHECKOUT_SESSION_ID}`,
  })
}

const idPaiement = (pi: string | Stripe.PaymentIntent | null) => (typeof pi === 'string' ? pi : (pi?.id ?? null))

/** Les pages produit affichent le stock : on les régénère quand il bouge. */
export async function revaliderBoutique(payload: Payload, commande: Pick<Commande, 'lignes'>) {
  try {
    revalidatePath('/boutique')
    revalidatePath('/')
    const ids = (commande.lignes ?? []).map((l) => (typeof l.produit === 'object' ? l.produit?.id : l.produit)).filter(Boolean) as number[]
    if (!ids.length) return
    const { docs } = await payload.find({ collection: 'produits', where: { id: { in: ids } }, depth: 0, limit: ids.length, select: { slug: true }, overrideAccess: true })
    for (const p of docs) if (p.slug) revalidatePath(`/boutique/${p.slug}`)
  } catch {
    // hors contexte Next (tests) : rien à régénérer
  }
}

/**
 * Paiement confirmé : passage en « payée » (une seule fois), puis e-mails (une seule fois aussi).
 * Lève une erreur si les e-mails n'ont pas pu partir : le webhook répond alors 500 et Stripe réessaie.
 */
export async function confirmerPaiement(payload: Payload, session: Stripe.Checkout.Session, options: { reprise?: boolean } = {}): Promise<Commande | null> {
  const basculee = await marquerPayee(payload, session.id, idPaiement(session.payment_intent), session.metadata?.commandeId, options)
  if (basculee) await revaliderBoutique(payload, basculee)
  const commande = basculee ?? (await trouverParSession(payload, session.id))
  if (commande && commande.statut === 'payee' && (await prendreEnvoiEmails(payload, commande.id))) {
    let ok = false
    try {
      ok = await notifierCommandePayee(payload, commande)
    } catch (err) {
      console.error('[commande] e-mails non envoyés', err)
    }
    if (!ok) {
      await rendreEnvoiEmails(payload, commande.id)
      throw new Error(`E-mails de la commande ${commande.numero} non envoyés`)
    }
  }
  return basculee
}

/** Lecture seule pour la page de confirmation (la vérification auprès de Stripe se fait dans /api/boutique/retour). */
export async function etatApresPaiement(payload: Payload, sessionId: string): Promise<Commande | null> {
  return trouverParSession(payload, sessionId)
}

/** Retour « annuler » depuis Stripe : on ferme la session et on rend le stock tout de suite. */
export async function abandonnerPaiement(payload: Payload, sessionId: string): Promise<boolean> {
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId)
    if (session.status === 'complete') return false
    if (session.status === 'open') await getStripe().checkout.sessions.expire(sessionId)
  } catch (err) {
    console.error('[commande] expiration de session impossible', err)
  }
  const c = await trouverParSession(payload, sessionId)
  if (!c) return false
  const ok = await annulerCommandeEnAttente(payload, c.id)
  if (ok) await revaliderBoutique(payload, c)
  return ok
}

export { annulerParSession }

/** Cookie qui retient la session de paiement ouverte : un nouvel essai ferme d'abord l'ancienne. */
export const COOKIE_PAIEMENT = 'kk_paiement'

export const sessionStripeValide = (s: unknown): s is string => typeof s === 'string' && /^cs_[A-Za-z0-9_]{8,250}$/.test(s)
