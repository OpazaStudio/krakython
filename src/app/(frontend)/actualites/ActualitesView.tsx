'use client'
import { useEffect, useState } from 'react'
import type { PageActualites } from '@/payload-types'
import { CarteActu } from '@/components/actualites/CarteActu'
import type { ActuResume, CategorieActu } from '@/components/actualites/outils'
import { MetaActu, VisuelUne } from '@/components/actualites/Visuels'
import { LogoKraken } from '@/components/decor'
import { FormAlerte } from '@/components/FormAlerte'
import { Fleche } from '@/components/icones'
import { Bouton, PastilleNoire } from '@/components/ui'
import { useLiveDoc } from '@/lib/useLiveDoc'

type Props = { page: PageActualites; actus: ActuResume[]; categories: CategorieActu[] }

const TOUT = 'tout'
const ANNEAUX_60 = { backgroundSize: '60px 60px' }

/** Titre avec un mot surligné (champ « Mot du titre surligné »). */
function TitreSurligne({ titre, mot }: { titre: string; mot?: string | null }) {
  const i = mot ? titre.indexOf(mot) : -1
  if (!mot || i < 0) return <>{titre}</>
  return (
    <>
      {titre.slice(0, i)}
      <span className="rounded-[18px] border-[3px] border-encre bg-bleu px-[.14em] text-white [box-decoration-break:clone] [text-shadow:0_5px_0_var(--color-encre)] [-webkit-box-decoration-break:clone]">
        {mot}
      </span>
      {titre.slice(i + mot.length)}
    </>
  )
}

export function ActualitesView({ page: initial, actus, categories }: Props) {
  const page = useLiveDoc(initial, { globalSlug: 'page-actualites' }, 1)
  const { entete, alerte } = page
  const [filtre, setFiltre] = useState(TOUT)

  // Filtre passé dans l’adresse (?categorie=asso), par exemple depuis le fil d’Ariane d’un article.
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get('categorie')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (c && categories.some((x) => x.value === c)) setFiltre(c)
  }, [categories])

  const choisir = (valeur: string) => {
    setFiltre(valeur)
    const url = new URL(window.location.href)
    if (valeur === TOUT) url.searchParams.delete('categorie')
    else url.searchParams.set('categorie', valeur)
    window.history.replaceState(window.history.state, '', url)
  }

  const une = actus.find((a) => a.aLaUne) ?? actus[0]
  const liste = actus.filter((a) => a.id !== une?.id)
  const visibles = filtre === TOUT ? liste : liste.filter((a) => a.categorie === filtre)
  const categorie = (v: string) => categories.find((c) => c.value === v)
  const onglets = [{ value: TOUT, label: 'Tout', nombre: liste.length }, ...categories.map((c) => ({ value: c.value, label: c.pluriel, nombre: liste.filter((a) => a.categorie === c.value).length }))]

  return (
    <>
      {/* En-tête */}
      <section aria-labelledby="actu-titre" className="kk-container pt-[clamp(48px,6vw,80px)] pb-9">
        <div className="flex items-end justify-between gap-5 border-b-[3px] border-encre pb-7">
          <div className="flex max-w-[780px] min-w-0 flex-1 flex-col gap-3.5">
            <PastilleNoire>{entete.surtitre}</PastilleNoire>
            <h1 id="actu-titre" className="kk-display m-0 text-[clamp(52px,7vw,100px)] leading-[.95]">
              <TitreSurligne titre={entete.titre} mot={entete.titreSurligne} />
            </h1>
            {entete.intro && <p className="m-0 text-[20px] leading-[1.5] font-bold text-texte">{entete.intro}</p>}
          </div>
          <span className="relative hidden size-[clamp(110px,13vw,150px)] shrink-0 animate-bob sm:block">
            <LogoKraken taille={150} priority className="size-full object-contain" />
          </span>
        </div>
      </section>

      {/* À la une */}
      {une && (
        <section aria-label="À la une" className="kk-container pb-14">
          <article className="kk-card grid overflow-hidden rounded-[28px] border-[3px] border-encre bg-white shadow-[9px_9px_0_var(--color-encre)] lg:grid-cols-2">
            <VisuelUne actu={une} />
            <div className="flex min-w-0 flex-col justify-center gap-4 p-[clamp(24px,4vw,44px)]">
              <MetaActu actu={une} categorie={categorie(une.categorie)} grand />
              <h2 className="kk-display m-0 text-[clamp(36px,4vw,56px)] leading-none">{une.titre}</h2>
              <p className="m-0 text-[19px] leading-[1.6] font-semibold text-texte">{une.resume}</p>
              <Bouton
                href={`/actualites/${une.slug}`}
                variante="noir"
                taille="sm"
                className="min-h-[52px] self-start px-[22px] shadow-[4px_4px_0_var(--color-rose)] hover:shadow-[6px_6px_0_var(--color-rose)]"
              >
                Lire l’article<span className="sr-only"> : {une.titre}</span>
                <Fleche size={18} />
              </Bouton>
            </div>
          </article>
        </section>
      )}

      {/* Liste filtrable */}
      {liste.length > 0 && (
        <section id="articles" aria-labelledby="liste-titre" className="kk-container flex scroll-mt-28 flex-col gap-7 pb-[clamp(64px,8vw,96px)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="liste-titre" className="kk-display m-0 text-[40px] leading-none">
              {page.listeTitre || 'Nos derniers articles'}
            </h2>
            <div role="group" aria-label="Filtrer par catégorie" className="flex flex-wrap gap-2.5">
              {onglets.map((o) => {
                const actif = o.value === filtre
                return (
                  <button
                    key={o.value}
                    type="button"
                    aria-pressed={actif}
                    onClick={() => choisir(o.value)}
                    className={`kk-btn min-h-[46px] gap-2 rounded-full px-[18px] text-[16px] shadow-dur-3 hover:shadow-dur-5 ${actif ? 'bg-encre text-white' : 'bg-white text-encre'}`}
                  >
                    {o.label}
                    <span className="kk-pixel text-[12px] tracking-normal opacity-80">{o.nombre}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <p className="sr-only" aria-live="polite">
            {visibles.length > 1 ? `${visibles.length} articles affichés` : visibles.length === 1 ? '1 article affiché' : 'Aucun article'}
          </p>
          {visibles.length > 0 ? (
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-7 p-0">
              {visibles.map((a) => (
                <li key={a.id}>
                  <CarteActu actu={a} categorie={categorie(a.categorie)} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-0 rounded-3xl border-[3px] border-dashed border-encre bg-white px-6 py-8 text-center text-[18px] font-extrabold text-gris">
              Pas encore d’article dans cette catégorie.
            </p>
          )}
        </section>
      )}

      {/* Inscription aux actus */}
      <section aria-labelledby="news-titre" className="kk-container pb-[clamp(64px,8vw,104px)]">
        <div className="relative flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[28px] border-[3px] border-encre bg-bleu p-[clamp(28px,4vw,48px)] text-white shadow-[9px_9px_0_var(--color-encre)]">
          <div aria-hidden="true" className="kk-rings" style={ANNEAUX_60} />
          <div className="relative flex min-w-0 flex-[1_1_440px] flex-col gap-2.5">
            <h2 id="news-titre" className="kk-display m-0 text-[clamp(34px,4vw,52px)] leading-none [text-shadow:0_4px_0_var(--color-encre)]">
              {alerte?.titre || 'Suis nos actus par e-mail'}
            </h2>
            {alerte?.texte && <p className="m-0 text-[19px] leading-[1.5] font-extrabold">{alerte.texte}</p>}
          </div>
          <div className="relative min-w-0 flex-[1_1_380px] [&_[role=status]]:text-white [&_button]:min-h-[54px]! [&_button]:px-[22px] [&_form]:max-w-none [&_input]:min-h-[54px] [&_input]:text-[17px]">
            <FormAlerte titre="Ton adresse e-mail" bouton={alerte?.bouton || 'Je m’abonne'} />
          </div>
        </div>
      </section>
    </>
  )
}
