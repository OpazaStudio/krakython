import type { Payload } from 'payload'
import type { PostgresAdapter } from '@payloadcms/db-postgres'
import { and, eq, lt } from '@payloadcms/db-postgres/drizzle'
import type { Commande, PageBoutique, Produit } from '@/payload-types'
import { enCentimes, enEuros } from './argent'
import { calculerMontants } from './montants'
import { libererStock, lignesStock, reserverStock, type Executeur } from './stock'
import type { ModeLivraison } from './statuts'

// Cycle de vie des commandes : création (avec réservation du stock), paiement confirmé
// par Stripe, annulation. Les passages de statut « système » sont faits en SQL
// conditionnel pour qu'un webhook et la page de confirmation ne se marchent pas dessus.

export class ErreurCommande extends Error {}

export type LigneDemandee = { produitId: number; tailleId: string | null; quantite: number }

export type Client = {
  nom: string
  email: string
  telephone?: string
  mode: ModeLivraison
  adresse?: string
  codePostal?: string
  ville?: string
}

export type LigneResolue = { produit: Produit; tailleId: string | null; taille: string | null; quantite: number; prixCentimes: number }

const SYSTEME = { systeme: true }
/** Au-delà, une commande jamais payée est annulée et son stock rendu (la session Stripe expire à 31 min). */
export const DELAI_EXPIRATION_MS = 60 * 60 * 1000
/** Garde-fous contre la confiscation du stock par des paniers jamais payés. */
export const MAX_PAR_ARTICLE = 10
export const MAX_ARTICLES = 30
export const MAX_COMMANDES_EN_ATTENTE = 3

const db = (payload: Payload) => {
  const a = payload.db as unknown as PostgresAdapter
  return { drizzle: a.drizzle, commandes: a.tables.commandes }
}

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
export function numeroCommande(maintenant = new Date()): string {
  const d = maintenant.toISOString().slice(2, 10).replaceAll('-', '')
  let s = ''
  for (let i = 0; i < 4; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  return `KK-${d}-${s}`
}

/** Regroupe les lignes identiques (même produit, même taille). */
export function fusionner(lignes: LigneDemandee[]): LigneDemandee[] {
  const parCle = new Map<string, LigneDemandee>()
  for (const l of lignes) {
    const cle = `${l.produitId}__${l.tailleId ?? ''}`
    const e = parCle.get(cle)
    if (e) e.quantite += l.quantite
    else parCle.set(cle, { ...l })
  }
  return [...parCle.values()]
}

/** Prix et tailles relus en base : le navigateur ne fixe jamais un prix. */
export function resoudre(lignes: LigneDemandee[], produits: Produit[]): LigneResolue[] {
  const parId = new Map(produits.map((p) => [p.id, p]))
  return lignes.map((l) => {
    const produit = parId.get(l.produitId)
    if (!produit || !produit.actif) throw new ErreurCommande('Un article de ton panier n’est plus en vente. Retire-le et réessaie.')
    if (!Number.isInteger(l.quantite) || l.quantite < 1) throw new ErreurCommande('Quantité invalide.')
    if (l.quantite > MAX_PAR_ARTICLE) throw new ErreurCommande(`${MAX_PAR_ARTICLE} exemplaires maximum par article et par commande.`)
    const tailles = produit.tailles ?? []
    let taille: string | null = null
    if (tailles.length) {
      const t = tailles.find((x) => x.id === l.tailleId)
      if (!t) throw new ErreurCommande(`Choisis une taille pour « ${produit.nom} ».`)
      taille = t.taille
    } else if (l.tailleId) {
      throw new ErreurCommande(`« ${produit.nom} » n’a pas de taille.`)
    }
    return { produit, tailleId: tailles.length ? l.tailleId : null, taille, quantite: l.quantite, prixCentimes: enCentimes(produit.prix) }
  })
}

export function montantsCommande(lignes: LigneResolue[], mode: ModeLivraison, reglages: Pick<PageBoutique, 'colissimo' | 'arrondi'>, arrondi: boolean) {
  return calculerMontants(
    lignes.reduce((s, l) => s + l.prixCentimes * l.quantite, 0),
    mode,
    reglages,
    arrondi,
  )
}

/**
 * Annule une commande restée en attente (paiement abandonné, expiré ou refusé) et rend son stock.
 * Ligne verrouillée (FOR UPDATE) : impossible de croiser un paiement qui arrive au même moment.
 */
export async function annulerCommandeEnAttente(payload: Payload, commandeId: number): Promise<boolean> {
  const { drizzle, commandes } = db(payload)
  const commande = await payload.findByID({ collection: 'commandes', id: commandeId, depth: 0, overrideAccess: true, disableErrors: true })
  if (!commande) return false
  return drizzle.transaction(async (tx) => {
    const [c] = await tx.select({ statut: commandes.statut, stockReserve: commandes.stockReserve }).from(commandes).where(eq(commandes.id, commandeId)).for('update')
    if (!c || c.statut !== 'en_attente') return false
    await tx.update(commandes).set({ statut: 'annulee', annuleePar: 'systeme', stockReserve: false }).where(eq(commandes.id, commandeId))
    if (c.stockReserve) await libererStock(payload, lignesStock(commande.lignes), tx as unknown as Executeur)
    return true
  })
}

/** Ménage : les commandes en attente depuis trop longtemps (hors paiement différé) sont annulées. */
export async function annulerCommandesExpirees(payload: Payload, maintenant = Date.now()): Promise<number> {
  const { drizzle, commandes } = db(payload)
  const vieilles = await drizzle
    .select({ id: commandes.id })
    .from(commandes)
    .where(and(eq(commandes.statut, 'en_attente'), eq(commandes.paiement_differe, false), lt(commandes.createdAt, new Date(maintenant - DELAI_EXPIRATION_MS).toISOString())))
  let n = 0
  for (const v of vieilles) if (await annulerCommandeEnAttente(payload, v.id as number)) n++
  return n
}

/** Crée la commande « en attente » et réserve le stock. Tout ou rien. */
export async function creerCommande(payload: Payload, client: Client, demandees: LigneDemandee[], options: { arrondi: boolean }) {
  if (!demandees.length) throw new ErreurCommande('Ton panier est vide.')
  const reglages = await payload.findGlobal({ slug: 'page-boutique', depth: 0 })
  if (client.mode === 'colissimo' && !reglages.colissimo?.actif) throw new ErreurCommande('La livraison Colissimo n’est pas disponible pour le moment.')
  if (client.mode === 'retrait' && !reglages.retrait?.actif) throw new ErreurCommande('Le retrait en main propre n’est pas disponible pour le moment.')

  await annulerCommandesExpirees(payload)

  const fusion = fusionner(demandees)
  if (fusion.reduce((n, l) => n + l.quantite, 0) > MAX_ARTICLES) throw new ErreurCommande(`${MAX_ARTICLES} articles maximum par commande : écris-nous pour une commande groupée.`)
  const enCours = await payload.count({
    collection: 'commandes',
    overrideAccess: true,
    where: { clientEmail: { equals: client.email }, statut: { equals: 'en_attente' }, createdAt: { greater_than: new Date(Date.now() - DELAI_EXPIRATION_MS).toISOString() } },
  })
  if (enCours.totalDocs >= MAX_COMMANDES_EN_ATTENTE) throw new ErreurCommande('Tu as déjà plusieurs paiements en cours : termine-les ou patiente une heure avant de recommencer.')
  const ids = [...new Set(fusion.map((l) => l.produitId))]
  const { docs: produits } = await payload.find({ collection: 'produits', where: { id: { in: ids } }, limit: ids.length, depth: 0, overrideAccess: true })
  const lignes = resoudre(fusion, produits)
  const montants = montantsCommande(lignes, client.mode, reglages, options.arrondi)

  const stock = lignes.map((l) => ({ produitId: l.produit.id, tailleId: l.tailleId, quantite: l.quantite }))
  const reserve = await reserverStock(payload, stock)
  if (!reserve.ok) {
    const l = lignes.find((x) => x.produit.id === reserve.ligne.produitId && x.tailleId === reserve.ligne.tailleId)
    throw new ErreurCommande(`Plus assez de stock pour « ${l?.produit.nom ?? 'un article'}${l?.taille ? ` (${l.taille})` : ''} ». Ajuste la quantité et réessaie.`)
  }

  try {
    let commande: Commande | null = null
    for (let essai = 0; !commande; essai++) {
      try {
        commande = await payload.create({
          collection: 'commandes',
          overrideAccess: true,
          context: SYSTEME,
          data: {
            numero: numeroCommande(),
            statut: 'en_attente',
            clientNom: client.nom,
            clientEmail: client.email,
            clientTelephone: client.telephone || null,
            livraison: {
              mode: client.mode,
              adresse: client.mode === 'colissimo' ? client.adresse : null,
              codePostal: client.mode === 'colissimo' ? client.codePostal : null,
              ville: client.mode === 'colissimo' ? client.ville : null,
            },
            lignes: lignes.map((l) => ({ nom: l.produit.nom, taille: l.taille, quantite: l.quantite, prixUnitaire: enEuros(l.prixCentimes), produit: l.produit.id, tailleId: l.tailleId })),
            sousTotal: enEuros(montants.sousTotal),
            fraisLivraison: enEuros(montants.frais),
            donSolidaire: enEuros(montants.don),
            total: enEuros(montants.total),
            stockReserve: true,
          },
        })
      } catch (err) {
        if (essai >= 2) throw err // collision de numéro improbable : on retente deux fois
      }
    }
    return { commande, lignes, montants }
  } catch (err) {
    await libererStock(payload, stock)
    throw err
  }
}

export async function trouverParSession(payload: Payload, sessionId: string): Promise<Commande | null> {
  const r = await payload.find({ collection: 'commandes', where: { 'paiement.sessionId': { equals: sessionId } }, limit: 1, depth: 0, overrideAccess: true })
  return r.docs[0] ?? null
}

/**
 * Paiement confirmé par Stripe : en attente → payée, sous verrou de ligne.
 * Renvoie la commande seulement si CET appel a fait le passage.
 * `reprise` (webhook uniquement) : un paiement très lent arrivé après l'annulation AUTOMATIQUE
 * d'une commande jamais payée est conservé, avec reprise du stock si possible et une note pour l'asso.
 * Une commande annulée par l'admin (ou déjà payée puis annulée/remboursée) n'est jamais ressuscitée.
 */
export async function marquerPayee(
  payload: Payload,
  sessionId: string,
  paymentIntent?: string | null,
  commandeIdSecours?: string | null,
  options: { reprise?: boolean } = {},
): Promise<Commande | null> {
  let commande = await trouverParSession(payload, sessionId)
  if (!commande && commandeIdSecours && /^\d+$/.test(commandeIdSecours)) {
    // La session a été créée mais son identifiant n'a pas pu être enregistré : on répare.
    commande = await payload.findByID({ collection: 'commandes', id: Number(commandeIdSecours), depth: 0, overrideAccess: true, disableErrors: true })
    if (commande?.paiement?.sessionId && commande.paiement.sessionId !== sessionId) return null
  }
  if (!commande) return null
  const id = commande.id
  const lignes = commande.lignes

  const { drizzle, commandes } = db(payload)
  const bascule = await drizzle.transaction(async (tx) => {
    const [c] = await tx
      .select({ statut: commandes.statut, annuleePar: commandes.annuleePar, payeLe: commandes.paiement_payeLe, note: commandes.note, intent: commandes.paiement_paymentIntent })
      .from(commandes)
      .where(eq(commandes.id, id))
      .for('update')
    if (!c) return false
    const paye = {
      statut: 'payee' as const,
      paiement_sessionId: sessionId,
      paiement_paymentIntent: paymentIntent ?? c.intent ?? null,
      paiement_differe: false,
      paiement_payeLe: new Date().toISOString(),
    }
    if (c.statut === 'en_attente') {
      await tx.update(commandes).set(paye).where(eq(commandes.id, id))
      return true
    }
    if (options.reprise && c.statut === 'annulee' && c.annuleePar === 'systeme' && !c.payeLe) {
      const r = await reserverStock(payload, lignesStock(lignes), tx as unknown as Executeur)
      const note = r.ok ? 'Paiement reçu après l’annulation automatique : stock repris.' : 'Paiement reçu après l’annulation automatique : stock insuffisant, à vérifier !'
      await tx
        .update(commandes)
        .set({ ...paye, stockReserve: r.ok, annuleePar: null, note: [c.note, note].filter(Boolean).join('\n') })
        .where(eq(commandes.id, id))
      return true
    }
    return false
  })
  if (!bascule) return null
  return payload.findByID({ collection: 'commandes', id, depth: 0, overrideAccess: true })
}

/** Réserve l'envoi des e-mails d'une commande payée (une seule fois, même en cas d'appels simultanés). */
export async function prendreEnvoiEmails(payload: Payload, commandeId: number): Promise<boolean> {
  const { drizzle, commandes } = db(payload)
  const pris = await drizzle
    .update(commandes)
    .set({ emailsEnvoyes: true })
    .where(and(eq(commandes.id, commandeId), eq(commandes.emailsEnvoyes, false), eq(commandes.statut, 'payee')))
    .returning({ id: commandes.id })
  return pris.length > 0
}

/** L'envoi a échoué : on libère pour qu'un nouvel essai du webhook Stripe recommence. */
export async function rendreEnvoiEmails(payload: Payload, commandeId: number): Promise<void> {
  const { drizzle, commandes } = db(payload)
  await drizzle.update(commandes).set({ emailsEnvoyes: false }).where(eq(commandes.id, commandeId))
}

/** Paiement différé en cours (virement, prélèvement) : la commande ne doit pas être annulée par le ménage. */
export async function marquerDiffere(payload: Payload, sessionId: string): Promise<void> {
  const c = await trouverParSession(payload, sessionId)
  if (!c || c.statut !== 'en_attente') return
  await payload.update({ collection: 'commandes', id: c.id, overrideAccess: true, context: SYSTEME, data: { paiement: { ...c.paiement, differe: true } } })
}

export async function annulerParSession(payload: Payload, sessionId: string): Promise<boolean> {
  const c = await trouverParSession(payload, sessionId)
  return c ? annulerCommandeEnAttente(payload, c.id) : false
}
