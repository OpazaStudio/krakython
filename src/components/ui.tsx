import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'

// Briques de la DA : boutons « jouet », étiquettes pixel, titres de section.

type BoutonProps = {
  href: string
  externe?: boolean
  variante?: 'don' | 'blanc' | 'noir'
  taille?: 'lg' | 'md' | 'sm'
  className?: string
  style?: CSSProperties
  children: ReactNode
  'aria-label'?: string
}

export function Bouton({ href, externe, variante = 'blanc', taille = 'md', className = '', style, children, ...rest }: BoutonProps) {
  const cls = `kk-btn kk-btn--${variante}${taille === 'md' ? '' : ` kk-btn--${taille}`} ${className}`
  if (externe ?? /^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener" className={cls} style={style} aria-label={rest['aria-label']}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={cls} style={style} aria-label={rest['aria-label']}>
      {children}
    </Link>
  )
}

/** Petite étiquette en police pixel au-dessus des titres. */
export const Etiquette = ({ children, couleur = 'rose', className = '' }: { children?: ReactNode; couleur?: 'rose' | 'bleu' | 'blanc' | 'ciel' | 'rose-fonce'; className?: string }) => {
  if (!children) return null
  const c = { rose: 'text-rose-bouton', bleu: 'text-bleu-fonce', blanc: 'text-white', ciel: 'text-ciel', 'rose-fonce': 'text-rose-fonce' }[couleur]
  return <span className={`kk-pixel text-[14px] ${c} ${className}`}>{children}</span>
}

export const PastilleNoire = ({ children, className = '' }: { children?: ReactNode; className?: string }) =>
  children ? <span className={`kk-pill kk-pill--noir self-start ${className}`}>{children}</span> : null

/** Bloc titre de section : étiquette + h2 (+ texte). */
export function TitreSection({
  surtitre,
  titre,
  texte,
  id,
  couleur = 'rose',
  className = '',
  clair = false,
}: {
  surtitre?: string | null
  titre?: string | null
  texte?: string | null
  id?: string
  couleur?: 'rose' | 'bleu' | 'rose-fonce' | 'ciel'
  className?: string
  clair?: boolean
}) {
  return (
    <div className={`flex max-w-[760px] flex-col gap-3.5 ${className}`}>
      <Etiquette couleur={couleur}>{surtitre}</Etiquette>
      {titre && (
        <h2 id={id} className={`kk-h2 ${clair ? 'text-white [text-shadow:0_5px_0_var(--color-encre)]' : ''}`}>
          {titre}
        </h2>
      )}
      {texte && <p className={`kk-lead ${clair ? 'text-bleu-clair' : ''}`}>{texte}</p>}
    </div>
  )
}

/** Paragraphes saisis dans un champ texte long (séparés par une ligne vide). */
export function Paragraphes({ texte, className = '' }: { texte?: string | null; className?: string }) {
  if (!texte) return null
  return (
    <>
      {texte
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <p key={i} className={className}>
            {p}
          </p>
        ))}
    </>
  )
}
