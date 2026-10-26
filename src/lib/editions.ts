import type { Edition } from '@/payload-types'

/** Total récolté sur les éditions renseignées ; `incomplet` si certaines n'ont pas encore de montant. */
export function totalEditions(editions: Pick<Edition, 'montant'>[]): { total: number; incomplet: boolean } {
  const total = editions.reduce((s, e) => s + (e.montant ?? 0), 0)
  return { total, incomplet: editions.some((e) => e.montant == null) }
}

export const euros = (n: number) => `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)} €`

/** « 9 247 € » ou « + de 9 247 € » quand des montants manquent. */
export const libelleTotal = ({ total, incomplet }: { total: number; incomplet: boolean }) => `${incomplet ? '+ de ' : ''}${euros(total)}`
