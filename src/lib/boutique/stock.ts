import type { Payload, PayloadRequest } from 'payload'
import type { PostgresAdapter } from '@payloadcms/db-postgres'
import { and, eq, gte, isNull, isNotNull, or, sql } from '@payloadcms/db-postgres/drizzle'

// Réservation du stock en SQL atomique : « décrémenter seulement s'il en reste assez ».
// Deux acheteurs du dernier t-shirt M ne peuvent pas passer tous les deux.
// Un stock vide (NULL) signifie « illimité » : NULL - n reste NULL.

export type LigneStock = { produitId: number; tailleId: string | null; quantite: number }

/** Connexion ou transaction drizzle sur laquelle exécuter les requêtes. */
export type Executeur = PostgresAdapter['drizzle']

export const tables = (payload: Payload) => {
  const db = payload.db as unknown as PostgresAdapter
  return { drizzle: db.drizzle, produits: db.tables.produits, tailles: db.tables.produits_tailles, commandes: db.tables.commandes }
}

/** La transaction en cours de la requête Payload (hooks), sinon la connexion normale. */
export async function executeurDe(payload: Payload, req?: Pick<PayloadRequest, 'transactionID'>): Promise<Executeur> {
  const db = payload.db as unknown as PostgresAdapter & { sessions?: Record<string, { db: Executeur }> }
  const id = req?.transactionID ? await req.transactionID : undefined
  return (id && db.sessions?.[String(id)]?.db) || db.drizzle
}

type LigneDoc = { produit?: number | { id: number } | null; tailleId?: string | null; quantite?: number | null }

/** Lignes d'une commande enregistrée → lignes de stock. */
export const lignesStock = (lignes: LigneDoc[] | null | undefined): LigneStock[] =>
  (lignes ?? []).flatMap((l) => {
    const produitId = typeof l.produit === 'object' && l.produit ? l.produit.id : l.produit
    if (!produitId || !l.quantite) return []
    return [{ produitId: Number(produitId), tailleId: l.tailleId || null, quantite: l.quantite }]
  })

async function retirer(payload: Payload, l: LigneStock, ex: Executeur): Promise<boolean> {
  const { produits, tailles } = tables(payload)
  if (l.tailleId) {
    const res = await ex
      .update(tailles)
      .set({ stock: sql`${tailles.stock} - ${l.quantite}` })
      .where(and(eq(tailles.id, l.tailleId), eq(tailles._parentID, l.produitId), or(isNull(tailles.stock), gte(tailles.stock, l.quantite))))
      .returning({ id: tailles.id })
    return res.length > 0
  }
  const res = await ex
    .update(produits)
    .set({ stock: sql`${produits.stock} - ${l.quantite}` })
    .where(and(eq(produits.id, l.produitId), or(isNull(produits.stock), gte(produits.stock, l.quantite))))
    .returning({ id: produits.id })
  return res.length > 0
}

async function remettre(payload: Payload, l: LigneStock, ex: Executeur): Promise<void> {
  const { produits, tailles } = tables(payload)
  if (l.tailleId) {
    await ex
      .update(tailles)
      .set({ stock: sql`${tailles.stock} + ${l.quantite}` })
      .where(and(eq(tailles.id, l.tailleId), isNotNull(tailles.stock)))
    return
  }
  await ex
    .update(produits)
    .set({ stock: sql`${produits.stock} + ${l.quantite}` })
    .where(and(eq(produits.id, l.produitId), isNotNull(produits.stock)))
}

/**
 * Réserve tout le panier ou rien : si une ligne manque de stock, les lignes déjà
 * réservées sont remises et la ligne fautive est renvoyée.
 */
export async function reserverStock(payload: Payload, lignes: LigneStock[], ex: Executeur = tables(payload).drizzle): Promise<{ ok: true } | { ok: false; ligne: LigneStock }> {
  const faites: LigneStock[] = []
  for (const l of lignes) {
    if (await retirer(payload, l, ex)) {
      faites.push(l)
      continue
    }
    for (const f of faites) await remettre(payload, f, ex)
    return { ok: false, ligne: l }
  }
  return { ok: true }
}

export async function libererStock(payload: Payload, lignes: LigneStock[], ex: Executeur = tables(payload).drizzle): Promise<void> {
  for (const l of lignes) await remettre(payload, l, ex)
}

/** Rend le stock réservé par une commande, une seule fois (drapeau stockReserve remis à false dans la même requête). */
export async function rendreStockCommande(payload: Payload, commandeId: number, lignes: LigneDoc[] | null | undefined, ex: Executeur = tables(payload).drizzle): Promise<boolean> {
  const { commandes } = tables(payload)
  const libere = await ex
    .update(commandes)
    .set({ stockReserve: false })
    .where(and(eq(commandes.id, commandeId), eq(commandes.stockReserve, true)))
    .returning({ id: commandes.id })
  if (!libere.length) return false
  await libererStock(payload, lignesStock(lignes), ex)
  return true
}
