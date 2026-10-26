import type { Produit } from '@/payload-types'
import { enCentimes } from '@/lib/boutique/argent'
import { calculerMontants } from '@/lib/boutique/montants'
import { mediaUrl } from '@/lib/media'
import { QUANTITE_MAX, type AjoutPanier, type LignePanier } from '@/lib/panier/panier'

// Module pur (client et serveur) : relie les lignes du panier au catalogue à jour
// pour afficher les vrais prix et prévenir des soucis de stock avant le paiement.
// Le serveur reste juge : prix, tailles et stock y sont relus au moment de payer.

/** Ce que le panier a besoin de savoir d'un produit. */
export type ProduitCatalogue = Pick<Produit, 'id' | 'nom' | 'slug' | 'prix' | 'tailles' | 'stock' | 'fond' | 'illustration'>

export const versCatalogue = (p: Produit): ProduitCatalogue => ({
  id: p.id,
  nom: p.nom,
  slug: p.slug,
  prix: p.prix,
  tailles: (p.tailles ?? []).map((t) => ({ id: t.id, taille: t.taille, stock: t.stock })),
  stock: p.stock,
  fond: p.fond,
  illustration: p.illustration,
})

export const indexer = (produits: ProduitCatalogue[]) => new Map(produits.map((p) => [p.id, p]))

export type EtatLigne = {
  /** Prix unitaire à jour (celui que le serveur facturera). */
  prixCentimes: number
  /** Quantité maximale commandable pour cette ligne. */
  max: number
  alerte: string | null
  /** La commande serait refusée tant que la ligne reste en l'état. */
  bloquant: boolean
  fond: 'bleu' | 'rose'
}

/** Stock disponible pour un produit (et sa taille). `null` = illimité, `undefined` = taille inconnue. */
export function stockPour(p: Pick<Produit, 'tailles' | 'stock'>, tailleId: string | null): number | null | undefined {
  const tailles = p.tailles ?? []
  if (!tailles.length) return p.stock ?? null
  const t = tailles.find((x) => x.id === tailleId)
  return t ? (t.stock ?? null) : undefined
}

export function etatLigne(l: LignePanier, catalogue: Map<number, ProduitCatalogue> | null): EtatLigne {
  const base: EtatLigne = { prixCentimes: l.prixCentimes, max: QUANTITE_MAX, alerte: null, bloquant: false, fond: 'bleu' }
  if (!catalogue) return base
  const p = catalogue.get(l.produitId)
  if (!p) return { ...base, max: l.quantite, alerte: 'Cet article n’est plus en vente : retire-le pour continuer.', bloquant: true }
  const fond = p.fond === 'rose' ? 'rose' : 'bleu'
  const prixCentimes = enCentimes(p.prix)
  const aTailles = (p.tailles ?? []).length > 0
  if (aTailles !== Boolean(l.tailleId)) return { ...base, fond, prixCentimes, max: l.quantite, alerte: 'Cet article a changé : retire-le puis ajoute-le à nouveau.', bloquant: true }
  const stock = stockPour(p, l.tailleId)
  if (stock === undefined) return { ...base, fond, prixCentimes, max: l.quantite, alerte: 'Cette taille n’est plus proposée : retire-la pour continuer.', bloquant: true }
  const max = Math.min(QUANTITE_MAX, stock ?? QUANTITE_MAX)
  if (max <= 0) return { ...base, fond, prixCentimes, max: l.quantite, alerte: 'Épuisé entre-temps : retire-le pour continuer.', bloquant: true }
  if (l.quantite > max) return { ...base, fond, prixCentimes, max, alerte: `Plus que ${max} en stock : baisse la quantité.`, bloquant: true }
  return { ...base, fond, prixCentimes, max }
}

/** Même formule que le serveur (module partagé). */
export const calculerTotaux = calculerMontants

/** Ligne à ajouter au panier depuis une fiche ou une carte produit. */
export function versAjout(p: Produit, taille: { id?: string | null; taille: string } | null): AjoutPanier {
  return {
    produitId: p.id,
    slug: p.slug ?? '',
    nom: p.nom,
    tailleId: taille?.id ?? null,
    taille: taille?.taille ?? null,
    prixCentimes: enCentimes(p.prix),
    illustration: p.illustration ?? null,
    image: mediaUrl(p.photos?.[0] as never, 'miniature'),
  }
}

export const libelleArticles = (n: number) => `${n} article${n > 1 ? 's' : ''}`
