// Logique panier pure (testée) : l'état vit dans le navigateur (localStorage),
// les prix sont TOUJOURS relus en base au moment du paiement.
// Identité d'une ligne : produit + taille.

export type LignePanier = {
  cle: string
  produitId: number
  slug: string
  nom: string
  tailleId: string | null
  taille: string | null
  prixCentimes: number
  quantite: number
  illustration: string | null
  image: string | null
}

export type AjoutPanier = Omit<LignePanier, 'cle' | 'quantite'>

export const QUANTITE_MAX = 10

export const cleLigne = (produitId: number, tailleId: string | null) => (tailleId ? `${produitId}__${tailleId}` : String(produitId))

export function ajouter(panier: LignePanier[], item: AjoutPanier, quantite = 1): LignePanier[] {
  const cle = cleLigne(item.produitId, item.tailleId)
  const existe = panier.find((l) => l.cle === cle)
  if (existe) return panier.map((l) => (l.cle === cle ? { ...l, ...item, cle, quantite: Math.min(l.quantite + quantite, QUANTITE_MAX) } : l))
  return [...panier, { ...item, cle, quantite: Math.min(Math.max(quantite, 1), QUANTITE_MAX) }]
}

export const retirer = (panier: LignePanier[], cle: string) => panier.filter((l) => l.cle !== cle)

export function changerQuantite(panier: LignePanier[], cle: string, quantite: number): LignePanier[] {
  if (quantite <= 0) return retirer(panier, cle)
  return panier.map((l) => (l.cle === cle ? { ...l, quantite: Math.min(quantite, QUANTITE_MAX) } : l))
}

export const nombreArticles = (panier: LignePanier[]) => panier.reduce((n, l) => n + l.quantite, 0)

export const sousTotalCentimes = (panier: LignePanier[]) => panier.reduce((s, l) => s + l.prixCentimes * l.quantite, 0)

/** Relecture prudente du localStorage (données anciennes ou corrompues). */
export function nettoyer(valeur: unknown): LignePanier[] {
  if (!Array.isArray(valeur)) return []
  return valeur.flatMap((brut) => {
    if (typeof brut !== 'object' || brut === null) return []
    const r = brut as Record<string, unknown>
    if (!Number.isInteger(r.produitId) || typeof r.nom !== 'string' || typeof r.slug !== 'string' || !Number.isInteger(r.prixCentimes) || !Number.isInteger(r.quantite)) return []
    const tailleId = typeof r.tailleId === 'string' && r.tailleId ? r.tailleId : null
    return [
      {
        cle: cleLigne(r.produitId as number, tailleId),
        produitId: r.produitId as number,
        slug: r.slug,
        nom: r.nom,
        tailleId,
        taille: typeof r.taille === 'string' ? r.taille : null,
        prixCentimes: Math.max(0, r.prixCentimes as number),
        quantite: Math.min(Math.max(r.quantite as number, 1), QUANTITE_MAX),
        illustration: typeof r.illustration === 'string' ? r.illustration : null,
        image: typeof r.image === 'string' ? r.image : null,
      },
    ]
  })
}
