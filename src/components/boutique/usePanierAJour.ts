'use client'
import { useMemo } from 'react'
import { usePanier } from '@/lib/panier/PanierProvider'
import { etatLigne, indexer, type EtatLigne, type ProduitCatalogue } from './catalogue'
import type { LignePanier } from '@/lib/panier/panier'

export type LigneAJour = LignePanier & { etat: EtatLigne }

/** Le panier du navigateur, recalé sur le catalogue reçu du serveur (prix et stock à jour). */
export function usePanierAJour(produits: ProduitCatalogue[] | null) {
  const panier = usePanier()
  const catalogue = useMemo(() => (produits ? indexer(produits) : null), [produits])
  const lignes: LigneAJour[] = useMemo(() => panier.lignes.map((l) => ({ ...l, etat: etatLigne(l, catalogue) })), [panier.lignes, catalogue])
  const sousTotal = lignes.reduce((s, l) => s + l.etat.prixCentimes * l.quantite, 0)
  return { ...panier, lignes, sousTotal, bloque: lignes.some((l) => l.etat.bloquant), catalogue }
}
