'use client'
import { useSite } from '@/lib/contexte'
import { Pulse } from './decor'

export function AnnonceBar() {
  const { evenement } = useSite()
  const a = evenement.annonce
  if (!a?.actif || !a.texte) return null
  const externe = /^https?:\/\//.test(a.lien ?? '')
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5 bg-encre px-5 py-2.5 text-center text-[15px] font-bold text-white">
      <span className="kk-pixel inline-flex items-center gap-2 text-[13px] text-dragee">
        <Pulse />
        {evenement.edition}
      </span>
      <span>{a.texte}</span>
      {a.lien && a.lienTexte && (
        <a href={a.lien} className="kk-link font-extrabold text-ciel" {...(externe ? { target: '_blank', rel: 'noopener' } : {})}>
          {a.lienTexte} →
        </a>
      )}
    </div>
  )
}
