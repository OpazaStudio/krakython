// Cycle de vie d'une commande. Module pur : importable côté client comme côté serveur.

export const STATUTS = ['en_attente', 'payee', 'preparee', 'expediee', 'retiree', 'annulee'] as const
export type Statut = (typeof STATUTS)[number]

export const MODES_LIVRAISON = ['colissimo', 'retrait'] as const
export type ModeLivraison = (typeof MODES_LIVRAISON)[number]

export const STATUT_LABELS: Record<Statut, string> = {
  en_attente: 'En attente de paiement',
  payee: 'Payée · à préparer',
  preparee: 'Préparée',
  expediee: 'Expédiée',
  retiree: 'Remise en main propre',
  annulee: 'Annulée',
}

export const MODE_LABELS: Record<ModeLivraison, string> = {
  colissimo: 'Colissimo à domicile',
  retrait: 'Retrait en main propre',
}

const FIN_PAR_MODE: Record<ModeLivraison, Statut> = { colissimo: 'expediee', retrait: 'retiree' }

/** Statuts atteignables depuis `de`, selon le mode de livraison. */
export function transitionsPossibles(de: Statut, mode: ModeLivraison): Statut[] {
  switch (de) {
    case 'en_attente':
      return ['payee', 'annulee']
    case 'payee':
      return ['preparee', FIN_PAR_MODE[mode], 'annulee']
    case 'preparee':
      return [FIN_PAR_MODE[mode], 'annulee']
    default:
      return []
  }
}

export function peutPasser(de: Statut, vers: Statut, mode: ModeLivraison): boolean {
  return de === vers || transitionsPossibles(de, mode).includes(vers)
}
