// Les montants sont saisis et stockés en euros dans l'admin (lisibles par l'asso),
// mais tous les calculs se font en centimes entiers pour éviter les arrondis flottants.

export const enCentimes = (euros: number | string | null | undefined): number => {
  const n = typeof euros === 'string' ? Number(euros.replace(',', '.')) : Number(euros ?? 0)
  return Number.isFinite(n) ? Math.round(n * 100) : 0
}

export const enEuros = (centimes: number): number => Math.round(centimes) / 100

const fmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
const fmtRond = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

/** « 25 € » ou « 25,50 € » à partir de centimes. */
export const prixDepuisCentimes = (centimes: number): string => (centimes % 100 === 0 ? fmtRond : fmt).format(centimes / 100)

export const prix = (euros: number | string | null | undefined): string => prixDepuisCentimes(enCentimes(euros))

/** Arrondi solidaire : complète le total jusqu'aux 5 € supérieurs (1 € si le total tombe juste). */
export function arrondiSolidaire(totalCentimes: number): number {
  const reste = (500 - (totalCentimes % 500)) % 500
  return reste === 0 ? 100 : reste
}
