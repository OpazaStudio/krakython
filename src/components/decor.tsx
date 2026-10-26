import Image from 'next/image'
import type { CSSProperties } from 'react'

// Éléments graphiques de la DA : tentacule du kraken, motif de ventouses, logo.

const TENTACULE = 'M150 430 C150 340, 50 300, 62 205 C72 128, 168 96, 200 150 C224 192, 190 232, 154 216 C128 204, 134 172, 160 174'
const TENTACULE_COURT = 'M150 430 C150 340, 50 300, 62 205 C72 128, 168 96, 200 150 C224 192, 190 232, 154 216'

const TEINTES = {
  bleu: { corps: '#1366A8', ventouses: '#9FD0F5' },
  rose: { corps: '#F23852', ventouses: '#FFC7CF' },
}

export function Tentacule({ couleur = 'bleu', className = '', style }: { couleur?: keyof typeof TEINTES; className?: string; style?: CSSProperties }) {
  const t = TEINTES[couleur]
  return (
    <svg aria-hidden="true" viewBox="0 0 300 420" className={`pointer-events-none absolute animate-sway ${className}`} style={style}>
      <path d={TENTACULE} fill="none" stroke="#1D1D1B" strokeWidth="58" strokeLinecap="round" />
      <path d={TENTACULE} fill="none" stroke={t.corps} strokeWidth="48" strokeLinecap="round" />
      <path d={TENTACULE_COURT} fill="none" stroke="#1D1D1B" strokeWidth="15" strokeLinecap="round" strokeDasharray="0 30" />
      <path d={TENTACULE_COURT} fill="none" stroke={t.ventouses} strokeWidth="7" strokeLinecap="round" strokeDasharray="0 30" />
    </svg>
  )
}

/** Motif de ventouses en fond de section (bleu ou rose). */
export const Anneaux = ({ taille = 68, opacite = 0.13 }: { taille?: number; opacite?: number }) => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0"
    style={{
      backgroundImage: `radial-gradient(circle, transparent 0 ${taille * 0.13}px, rgb(255 255 255 / ${opacite}) ${taille * 0.13}px ${taille * 0.18}px, transparent ${taille * 0.18}px)`,
      backgroundSize: `${taille}px ${taille}px`,
    }}
  />
)

export const LogoKraken = ({ className = '', taille = 487, priority = false, alt = '' }: { className?: string; taille?: number; priority?: boolean; alt?: string }) => (
  <Image src="/images/logo-kraken.webp" alt={alt} width={487} height={480} className={className} sizes={`${taille}px`} priority={priority} />
)

export const LogoHorizontal = ({ className = '' }: { className?: string }) => (
  <Image src="/images/logo-horizontal.webp" alt="Krakython, Mémoire à Max’" width={1400} height={241} className={className} sizes="280px" priority />
)

/** Point rouge qui pulse (« live »). */
export const Pulse = ({ couleur = 'var(--color-rose)', taille = 10 }: { couleur?: string; taille?: number }) => (
  <span className="kk-dot" style={{ width: taille, height: taille, background: couleur }} />
)
