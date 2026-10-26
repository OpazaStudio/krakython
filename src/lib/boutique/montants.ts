import type { PageBoutique } from '@/payload-types'
import { arrondiSolidaire, enCentimes } from './argent'
import type { ModeLivraison } from './statuts'

// Module pur partagé par le serveur (commande réelle) et le navigateur (récapitulatif) :
// une seule formule, aucun écart possible entre le total affiché et le total facturé.

export function calculerMontants(sousTotal: number, mode: ModeLivraison | null, reglages: Pick<PageBoutique, 'colissimo' | 'arrondi'>, arrondi: boolean) {
  const frais = mode === 'colissimo' ? enCentimes(reglages.colissimo?.prix ?? 0) : 0
  const don = arrondi && reglages.arrondi?.actif ? arrondiSolidaire(sousTotal + frais) : 0
  return { sousTotal, frais, don, total: sousTotal + frais + don }
}
