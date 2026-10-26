'use client'
import type { Membre } from '@/payload-types'
import { Img } from '@/components/Img'
import { isMedia } from '@/lib/media'
import { useLiveDoc } from '@/lib/useLiveDoc'

const STATUT = { memoire: 'Pour toujours', recrue: 'Nouvelle recrue', ready: 'Ready' } as const

/** Fiche joueur de l’équipe (P1, P2…). « Pour toujours » = fiche bleu nuit en mémoire de Max. */
export function CarteMembre({ membre: initial, numero }: { membre: Membre; numero: number }) {
  const m = useLiveDoc(initial, { collectionSlug: 'membres' }, 1)
  const memoire = m.statut === 'memoire'
  const recrue = m.statut === 'recrue'
  // Couleurs alternées comme sur la maquette : P2 bleu, P3 rose, P4 bleu…
  const rose = numero % 2 === 1

  const ombrePhoto = memoire || rose ? 'shadow-[4px_4px_0_var(--color-rose)]' : 'shadow-[4px_4px_0_var(--color-bleu)]'
  const tag = memoire ? 'border-ciel' : `border-encre ${rose ? 'bg-rose-clair' : 'bg-bleu-clair'}`

  return (
    <article
      className={`flex flex-col gap-3 rounded-3xl border-[3px] border-encre p-5 ${
        memoire ? 'bg-nuit text-white shadow-[7px_7px_0_var(--color-rose)]' : 'kk-card bg-white shadow-dur-7'
      }`}
    >
      <div className={`kk-pixel flex justify-between gap-3 text-[12px] tracking-normal ${memoire ? 'text-ciel' : 'text-gris'}`}>
        <span>P{numero}</span>
        <span className={recrue ? 'text-rose-bouton' : ''}>{STATUT[m.statut ?? 'ready']}</span>
      </div>
      <div className="flex items-center gap-3.5">
        <span className={`relative size-20 shrink-0 overflow-hidden rounded-full border-[3px] bg-bleu-clair ${memoire ? 'border-white' : 'border-encre'} ${ombrePhoto}`}>
          {isMedia(m.photo) ? (
            <Img media={m.photo} fill sizes="80px" size="miniature" />
          ) : (
            <span aria-hidden="true" className="kk-display grid size-full place-items-center text-[34px] text-bleu-fonce">
              {m.prenom.charAt(0)}
            </span>
          )}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="kk-display m-0 text-[28px] leading-none">{m.prenom}</h3>
          {m.pseudo && <span className={`kk-pixel font-bold tracking-normal break-words ${m.pseudo.length > 11 ? 'text-[12px]' : 'text-[13px]'} ${memoire ? 'text-dragee' : 'text-rose-bouton'}`}>{m.pseudo}</span>}
        </div>
      </div>
      <p className={`m-0 grow text-[15px] leading-[1.5] font-bold ${memoire ? 'text-bleu-clair' : 'text-texte'}`}>{m.bio}</p>
      {!!m.tags?.length && (
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0" aria-label={`Jeux préférés de ${m.prenom}`}>
          {m.tags.map((t) => (
            <li key={t.id ?? t.tag} className={`kk-tag ${tag}`}>
              {t.tag}
            </li>
          ))}
        </ul>
      )}
      {m.twitch && (
        <a href={m.twitch} target="_blank" rel="noopener" className={`kk-link self-start text-[15px] font-black ${memoire ? 'text-ciel' : 'text-bleu-fonce'}`}>
          Sa chaîne Twitch<span className="sr-only"> ({m.prenom})</span> <span aria-hidden="true">→</span>
        </a>
      )}
    </article>
  )
}
