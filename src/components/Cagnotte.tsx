import type { Evenement } from '@/payload-types'

export const pourcentage = (c: Evenement['cagnotte']) => {
  const objectif = c?.objectif ?? 0
  if (!objectif) return 0
  return Math.max(0, Math.min(100, Math.round(((c?.montant ?? 0) / objectif) * 100)))
}

export const nombreFr = (n?: number | null) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n ?? 0)

/** Prochain palier non atteint (affiché sous l'écran du live). */
export const prochainPalier = (c: Evenement['cagnotte']) =>
  [...(c?.paliers ?? [])].sort((a, b) => (a.montant ?? 0) - (b.montant ?? 0)).find((p) => (p.montant ?? 0) > (c?.montant ?? 0))

/** Barre d'XP de la cagnotte, graduée en 4 niveaux. */
export function BarreXp({ cagnotte, hauteur = 44 }: { cagnotte: Evenement['cagnotte']; hauteur?: number }) {
  const p = pourcentage(cagnotte)
  return (
    <div className="flex flex-col gap-2.5">
      <div
        role="progressbar"
        aria-label="Progression de la cagnotte"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={p}
        className="relative overflow-hidden rounded-full border-[3px] border-encre bg-bleu-clair"
        style={{ height: hauteur }}
      >
        {p > 0 && (
        <div
          className="flex h-full items-center justify-end rounded-full bg-bleu pr-3.5 transition-[width] duration-700"
          style={{
            width: `${p}%`,
            borderRight: p > 0 ? '3px solid var(--color-encre)' : undefined,
            backgroundImage: 'repeating-linear-gradient(-45deg, rgb(255 255 255 / .18) 0 12px, transparent 12px 24px)',
          }}
        >
          {p >= 16 && <span className="kk-pixel text-[14px] font-bold tracking-normal text-white">XP {p} %</span>}
        </div>
        )}
        {p < 16 && (
          <span className="kk-pixel absolute top-1/2 -translate-y-1/2 text-[14px] font-bold tracking-normal text-encre" style={{ left: p > 0 ? `calc(${p}% + 12px)` : 16 }}>
            XP {p} %
          </span>
        )}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid grid-cols-4">
          <span className="border-r-2 border-dashed border-encre/35" />
          <span className="border-r-2 border-dashed border-encre/35" />
          <span className="border-r-2 border-dashed border-encre/35" />
          <span />
        </div>
      </div>
      <div className="kk-pixel grid grid-cols-4 text-[12px] tracking-normal">
        <span className="pr-1.5 text-right">Niv. 1</span>
        <span className="pr-1.5 text-right">Niv. 2</span>
        <span className="pr-1.5 text-right">Niv. 3</span>
        <span className="text-right">Boss</span>
      </div>
    </div>
  )
}
