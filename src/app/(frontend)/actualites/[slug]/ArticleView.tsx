'use client'
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Actualite } from '@/payload-types'
import { dateCourte, dateLongue, tempsLecture, type ActuResume, type CategorieActu } from '@/components/actualites/outils'
import { Partage } from '@/components/actualites/Partage'
import { PastilleCategorie, VignetteActu, VisuelArticle } from '@/components/actualites/Visuels'
import { LogoKraken } from '@/components/decor'
import { RichText } from '@/components/RichText'
import { useLienDon, useSite } from '@/lib/contexte'
import { useLiveDoc } from '@/lib/useLiveDoc'

type Props = { actu: Actualite; autres: ActuResume[]; categories: CategorieActu[]; url: string; auteur: string }

const COLONNE = 'mx-auto px-[clamp(20px,4vw,40px)]'

// Corps de l’article : typo de la maquette, citations en bulle rose avec grand guillemet.
const CORPS = [
  'text-[20px] leading-[1.75] font-medium text-texte [&>*+*]:mt-6',
  '[&_blockquote]:relative [&_blockquote]:my-9 [&_blockquote]:rounded-[26px] [&_blockquote]:px-[clamp(22px,4vw,34px)] [&_blockquote]:pt-10 [&_blockquote]:pb-[30px] [&_blockquote]:text-[clamp(26px,3vw,34px)] [&_blockquote]:leading-[1.25] [&_blockquote]:shadow-dur-7',
  "[&_blockquote]:before:absolute [&_blockquote]:before:-top-10 [&_blockquote]:before:left-[26px] [&_blockquote]:before:font-display [&_blockquote]:before:text-[110px] [&_blockquote]:before:leading-none [&_blockquote]:before:text-rose [&_blockquote]:before:content-['“'] [&_blockquote]:before:[text-shadow:3px_3px_0_var(--color-encre)]",
].join(' ')

/** Carte-lien « Continuer le combat » (interne ou nouvel onglet). */
function CarteLien({ href, externe, className, children }: { href: string; externe: boolean; className: string; children: ReactNode }) {
  const cls = `kk-card flex flex-col gap-2.5 rounded-3xl border-[3px] border-encre p-[26px] no-underline shadow-dur-7 ${className}`
  return externe ? (
    <a href={href} target="_blank" rel="noopener" className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}

export function ArticleView({ actu: initial, autres, categories, url, auteur }: Props) {
  const actu = useLiveDoc(initial, { collectionSlug: 'actualites' }, 1)
  const { site } = useSite()
  const don = useLienDon()
  const categorie = (v: string) => categories.find((c) => c.value === v)
  const cat = categorie(actu.categorie)
  const minutes = tempsLecture(actu.contenu)
  const beneficiaire = site.beneficiaire?.nom

  return (
    <>
      <article>
        <header className={`${COLONNE} flex max-w-[960px] flex-col gap-5 pt-[clamp(40px,6vw,72px)] pb-9`}>
          <nav aria-label="Fil d’Ariane">
            <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-[15px] font-extrabold text-gris">
              <li>
                <Link href="/actualites" className="kk-link text-bleu-fonce">
                  Actualités
                </Link>
              </li>
              {cat && (
                <li className="flex items-center gap-2">
                  <span aria-hidden="true">›</span>
                  <Link href={`/actualites?categorie=${cat.value}#articles`} className="kk-link text-gris">
                    {cat.label}
                  </Link>
                </li>
              )}
            </ol>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            {cat && <PastilleCategorie categorie={cat} grand />}
            <span className="kk-pixel text-[13px] tracking-normal text-gris">
              <time dateTime={actu.date}>{dateLongue(actu.date)}</time> · {minutes} min de lecture
            </span>
          </div>
          <h1 className="kk-display m-0 text-[clamp(48px,6.5vw,88px)] leading-[.98]">{actu.titre}</h1>
          <div className="flex items-center gap-3">
            <span className="grid size-[52px] shrink-0 place-items-center rounded-full border-[3px] border-encre bg-white">
              <LogoKraken taille={38} className="size-[38px] object-contain" />
            </span>
            <span className="flex flex-col">
              <span className="text-[17px] font-black">{auteur}</span>
              <span className="text-[15px] font-bold text-gris">En mémoire de Maxime, alias Krakeunz</span>
            </span>
          </div>
        </header>

        <figure className={`${COLONNE} my-0 max-w-[1040px]`}>
          <VisuelArticle actu={actu} />
        </figure>

        <div className={`${COLONNE} max-w-[760px] pt-[clamp(48px,6vw,72px)]`}>
          <RichText data={actu.contenu} className={CORPS} />
          <Partage url={url} titre={actu.titre} />
        </div>
      </article>

      {/* Continuer le combat */}
      <section
        aria-label="Continuer le combat"
        className={`${COLONNE} grid max-w-[1040px] grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-6 pt-[clamp(48px,6vw,72px)] ${autres.length ? '' : 'pb-[clamp(64px,8vw,104px)]'}`}
      >
        <CarteLien href={don.href} externe={don.externe} className="bg-rose-bouton text-white hover:text-white">
          <span className="kk-pixel text-[12px] tracking-normal">Continuer le combat</span>
          <span className="kk-display text-[32px] leading-[1.05] text-balance [text-shadow:0_3px_0_var(--color-encre)]">Faire un don en mémoire de Max</span>
          <span className="text-[17px] font-extrabold">
            {beneficiaire ? `Au profit de la ${beneficiaire}` : 'Contre la leucémie'}&nbsp;<span aria-hidden="true">→</span>
          </span>
        </CarteLien>
        {site.lienMoelle && (
          <CarteLien href={site.lienMoelle} externe className="bg-white text-encre hover:text-encre">
            <span className="kk-pixel text-[12px] tracking-normal text-bleu-fonce">Sauver une vie</span>
            <span className="kk-display text-[32px] leading-[1.05] text-balance">Devenir donneur de moelle osseuse</span>
            <span className="text-[17px] font-extrabold text-gris">
              Tu as entre 18 et 35&nbsp;ans&nbsp;? Inscris-toi&nbsp;<span aria-hidden="true">→</span>
            </span>
          </CarteLien>
        )}
      </section>

      {/* À lire aussi */}
      {autres.length > 0 && (
        <section aria-labelledby="aussi-titre" className={`${COLONNE} flex max-w-[1040px] flex-col gap-6 pt-[clamp(56px,7vw,88px)] pb-[clamp(64px,8vw,104px)]`}>
          <h2 id="aussi-titre" className="kk-display m-0 text-[36px] leading-none">
            À lire aussi
          </h2>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-6 p-0">
            {autres.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/actualites/${a.slug}`}
                  className="kk-card flex h-full items-center gap-4 rounded-[22px] border-[3px] border-encre bg-white p-3.5 text-encre no-underline shadow-dur-6 hover:text-encre"
                >
                  <VignetteActu actu={a} />
                  <span className="flex min-w-0 flex-col gap-1.5">
                    <span className="kk-pixel text-[12px] tracking-normal text-gris">
                      {dateCourte(a.date)}
                      {categorie(a.categorie) ? ` · ${categorie(a.categorie)?.label}` : ''}
                    </span>
                    <span className="kk-display text-[24px] leading-[1.1]">{a.titre}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
