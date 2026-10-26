import Link from 'next/link'
import type { ActuResume, CategorieActu } from './outils'
import { MetaActu, VisuelCarte } from './Visuels'

/** Carte de la liste des actualités : toute la carte est cliquable (lien étiré sur le titre). */
export function CarteActu({ actu, categorie }: { actu: ActuResume; categorie?: CategorieActu }) {
  return (
    <article className="kk-card group relative flex h-full flex-col overflow-hidden rounded-3xl border-[3px] border-encre bg-white shadow-dur-7 transition-[transform,translate,opacity] duration-300 ease-out has-[a:focus-visible]:outline-[3px] has-[a:focus-visible]:outline-offset-[3px] has-[a:focus-visible]:outline-rose starting:translate-y-3 starting:opacity-0">
      <VisuelCarte actu={actu} />
      <div className="flex grow flex-col gap-2.5 px-[22px] pt-5 pb-6">
        <MetaActu actu={actu} categorie={categorie} />
        <h3 className="kk-display m-0 text-[26px] leading-[1.1]">
          <Link href={`/actualites/${actu.slug}`} className="text-encre no-underline outline-none after:absolute after:inset-0 after:content-[''] hover:text-encre">
            {actu.titre}
          </Link>
        </h3>
        <p className="m-0 grow text-[16px] leading-[1.55] font-semibold text-texte">{actu.resume}</p>
        <span aria-hidden="true" className="text-[16px] font-black text-bleu-fonce group-hover:text-rose">
          Lire l’article →
        </span>
      </div>
    </article>
  )
}
