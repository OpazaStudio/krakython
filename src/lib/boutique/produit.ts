import type { Produit } from '@/payload-types'

// Disponibilité d'un produit côté vitrine. La vérité reste la réservation SQL au paiement.

export const aDesTailles = (p: Pick<Produit, 'tailles'>) => Array.isArray(p.tailles) && p.tailles.length > 0

export const tailleDisponible = (t: { stock?: number | null }) => t.stock == null || t.stock > 0

export function estEpuise(p: Pick<Produit, 'tailles' | 'stock'>): boolean {
  if (aDesTailles(p)) return !p.tailles!.some(tailleDisponible)
  return p.stock != null && p.stock <= 0
}

/** Stock restant à afficher (« Plus que 3 ») quand il devient bas. */
export function stockBas(stock: number | null | undefined, seuil = 5): number | null {
  return stock != null && stock > 0 && stock <= seuil ? stock : null
}
