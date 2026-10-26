'use client'
import type { Edition } from '@/payload-types'
import { Icone } from '@/components/icones'
import { Bouton } from '@/components/ui'
import { euros } from '@/lib/editions'
import { useLiveDoc } from '@/lib/useLiveDoc'

const LIGNE = 'grid grid-cols-[48px_minmax(0,1fr)] gap-x-3 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-x-5'

/** Une édition passée du journal de quête (LV1, LV2… en bleu et rose alternés). */
export function EtapeQuete({ edition: initial, niveau }: { edition: Edition; niveau: number }) {
  const e = useLiveDoc(initial, { collectionSlug: 'editions' }, 0)
  const rose = niveau % 2 === 0
  return (
    <li className={LIGNE}>
      <div aria-hidden="true" className="flex flex-col items-center">
        <span className={`kk-pixel grid size-12 shrink-0 place-items-center rounded-full border-[3px] border-encre text-[13px] sm:size-[60px] font-bold tracking-normal text-white ${rose ? 'bg-rose' : 'bg-bleu'}`}>
          LV{niveau}
        </span>
        <span className="min-h-7 w-0 grow border-l-4 border-dashed border-encre" />
      </div>
      <article className="mb-7 flex min-w-0 flex-col gap-2 rounded-[22px] border-[3px] border-encre bg-papier px-[22px] py-5 shadow-dur-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="kk-pixel text-[13px] tracking-normal text-bleu-fonce">{e.periode}</span>
          {e.montant != null ? (
            <span className="rounded-full border-2 border-encre bg-rose-bouton px-3 py-[5px] text-[15px] font-black text-white">{euros(e.montant)} récoltés</span>
          ) : (
            <span className="rounded-full border-2 border-encre bg-white px-3 py-[5px] text-[15px] font-black">Montant à confirmer</span>
          )}
        </div>
        <h3 className="kk-display m-0 text-[30px] leading-[1.05]">{e.titre}</h3>
        <p className="m-0 text-[17px] leading-[1.55] font-semibold text-texte">{e.texte}</p>
      </article>
    </li>
  )
}

/** Dernière étape : la prochaine édition, encore verrouillée. */
export function EtapeProchaine({ libelle, titre, bouton, twitch }: { libelle?: string | null; titre: string; bouton: string; twitch: string }) {
  return (
    <li className={LIGNE}>
      <div aria-hidden="true" className="flex flex-col items-center">
        <span className="grid size-12 shrink-0 place-items-center rounded-full border-[3px] border-dashed sm:size-[60px] border-encre bg-white">
          <Icone nom="cadenas" size={24} trait={2.6} />
        </span>
      </div>
      <article className="flex min-w-0 flex-wrap items-center justify-between gap-4 rounded-[22px] border-[3px] border-dashed border-encre bg-white px-[22px] py-5">
        <div className="flex flex-col gap-1.5">
          <span className="kk-pixel text-[13px] tracking-normal text-rose-bouton">Prochain niveau{libelle ? ` · ${libelle}` : ''}</span>
          <h3 className="kk-display m-0 text-[30px] leading-[1.05]">{titre}</h3>
        </div>
        <Bouton href={twitch} variante="noir" taille="sm" className="min-h-[50px] px-4 text-[16px] sm:px-5 shadow-[4px_4px_0_var(--color-rose)] hover:shadow-[6px_6px_0_var(--color-rose)]">
          {bouton}
        </Bouton>
      </article>
    </li>
  )
}
