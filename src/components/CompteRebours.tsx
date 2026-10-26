'use client'
import { useEffect, useState } from 'react'

function decouper(cible: number | null, maintenant: number) {
  if (cible == null || Number.isNaN(cible)) return null
  let reste = Math.max(0, cible - maintenant)
  const j = Math.floor(reste / 86400000)
  reste -= j * 86400000
  const h = Math.floor(reste / 3600000)
  reste -= h * 3600000
  const m = Math.floor(reste / 60000)
  reste -= m * 60000
  return { j, h, m, s: Math.floor(reste / 1000) }
}

/** Compte à rebours vers le début du live. Sans date : « -- ». */
export function CompteRebours({ debut, compact = false }: { debut?: string | null; compact?: boolean }) {
  const cible = debut ? Date.parse(debut) : null
  const [maintenant, setMaintenant] = useState<number | null>(null)

  useEffect(() => {
    // L'heure n'existe qu'au navigateur : le rendu serveur affiche « -- ».
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMaintenant(Date.now())
    const t = setInterval(() => setMaintenant(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const d = maintenant == null ? null : decouper(cible, maintenant)
  const fmt = (n?: number) => (d && n != null ? String(n).padStart(2, '0') : '--')
  const cases = [
    { v: fmt(d?.j), l: 'jours' },
    { v: fmt(d?.h), l: 'heures' },
    { v: fmt(d?.m), l: 'min' },
    { v: fmt(d?.s), l: 'sec', rose: true },
  ]
  return (
    <div className={`grid grid-cols-4 ${compact ? 'gap-2' : 'gap-2.5'}`} role="timer" aria-live="off" aria-label="Temps restant avant le prochain live">
      {cases.map((c) => (
        <div key={c.l} className={`flex flex-col items-center gap-0.5 rounded-[14px] px-1.5 pt-2.5 pb-2 ${c.rose ? 'bg-rose-bouton' : 'bg-encre-2'}`}>
          <span className={`kk-display leading-none ${compact ? 'text-[34px]' : 'text-[clamp(34px,4vw,44px)]'}`}>{c.v}</span>
          <span className={`kk-pixel text-[12px] tracking-normal ${c.rose ? 'text-white' : 'text-brume'}`}>{c.l}</span>
        </div>
      ))}
    </div>
  )
}
