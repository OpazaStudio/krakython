'use client'
import type { Cgv, Confidentialite, MentionsLegales } from '@/payload-types'
import { Anneaux } from '@/components/decor'
import { RichText } from '@/components/RichText'
import { useLiveDoc } from '@/lib/useLiveDoc'

type Doc = MentionsLegales | Cgv | Confidentialite
const dateLongue = (d: string) => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' }).format(new Date(d))

/** Gabarit commun des pages légales : bandeau bleu + carte de texte. */
export function PageLegaleView({ doc: initial, slug }: { doc: Doc; slug: 'mentions-legales' | 'cgv' | 'confidentialite' }) {
  const doc = useLiveDoc(initial, { globalSlug: slug }, 0)
  return (
    <>
      <section className="relative overflow-hidden border-b-[3px] border-encre bg-bleu">
        <Anneaux />
        <div className="kk-container relative flex flex-col gap-4 pt-[clamp(40px,6vw,72px)] pb-[clamp(72px,8vw,104px)]">
          <span className="kk-pill kk-pill--noir self-start">Infos pratiques</span>
          <h1 className="kk-h1 max-w-[20ch]">{doc.titre}</h1>
          {doc.majLe && <p className="m-0 text-[17px] font-extrabold text-white">Mis à jour le {dateLongue(doc.majLe)}</p>}
        </div>
      </section>
      <div className="kk-container relative -mt-12 pb-[clamp(64px,8vw,112px)]">
        <article className="mx-auto max-w-[860px] rounded-[28px] border-[3px] border-encre bg-white p-[clamp(24px,4vw,48px)] shadow-dur-8">
          <RichText data={doc.contenu} className="[&>h2:first-child]:mt-0" />
        </article>
      </div>
    </>
  )
}
