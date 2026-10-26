'use client'
import { useMemo, useState } from 'react'
import type { PageBoutique, Produit } from '@/payload-types'
import { Anneaux, LogoKraken } from '@/components/decor'
import { Icone } from '@/components/icones'
import { Bouton, PastilleNoire } from '@/components/ui'
import { useLienDon } from '@/lib/contexte'
import { useLiveDoc } from '@/lib/useLiveDoc'
import { CarteProduit } from './CarteProduit'
import { libelleArticles, versCatalogue } from './catalogue'
import { PanierLateral } from './PanierLateral'

type Categorie = { label: string; value: string }
type Tri = 'ordre' | 'prix-asc' | 'prix-desc'

const TRIS: { value: Tri; label: string }[] = [
  { value: 'ordre', label: 'Nouveautés' },
  { value: 'prix-asc', label: 'Prix croissant' },
  { value: 'prix-desc', label: 'Prix décroissant' },
]

type Props = { reglages: PageBoutique; produits: Produit[]; categories: Categorie[] }

export function BoutiqueView({ reglages: initial, produits, categories }: Props) {
  const reglages = useLiveDoc(initial, { globalSlug: 'page-boutique' }, 1)
  const don = useLienDon()
  const [filtre, setFiltre] = useState('tout')
  const [tri, setTri] = useState<Tri>('ordre')
  const { entete, soutien } = reglages

  const catalogue = useMemo(() => produits.map(versCatalogue), [produits])

  const onglets = useMemo(
    () => [
      { value: 'tout', label: 'Tout', n: produits.length },
      ...categories.map((c) => ({ ...c, n: produits.filter((p) => p.categorie === c.value).length })).filter((c) => c.n > 0),
    ],
    [produits, categories],
  )

  const liste = useMemo(() => {
    const l = produits.filter((p) => filtre === 'tout' || p.categorie === filtre)
    if (tri === 'ordre') return l
    const sens = tri === 'prix-asc' ? 1 : -1
    return [...l].sort((a, b) => sens * (a.prix - b.prix) || (a.ordre ?? 0) - (b.ordre ?? 0))
  }, [produits, filtre, tri])

  return (
    <>
      {/* En-tête */}
      <section aria-labelledby="boutique-titre" className="relative overflow-hidden border-b-[3px] border-encre bg-rose">
        <Anneaux opacite={0.16} />
        <div className="kk-container relative flex flex-wrap items-center justify-between gap-8 py-[clamp(44px,6vw,72px)]">
          <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-[18px]">
            <PastilleNoire>{entete.surtitre}</PastilleNoire>
            <h1 id="boutique-titre" className="kk-h1">
              {entete.titre}
            </h1>
            {entete.intro && <p className="m-0 max-w-[560px] text-[20px] leading-[1.5] font-extrabold text-white">{entete.intro}</p>}
            {!!entete.badges?.length && (
              <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
                {entete.badges.map((b) => (
                  <li key={b.id} className="inline-flex items-center gap-2 rounded-xl border-[3px] border-encre bg-white px-3.5 py-2 text-[15px] font-extrabold">
                    <Icone nom={b.icone} size={18} trait={2.6} className={b.icone === 'coeur' ? 'text-rose-bouton' : 'text-encre'} />
                    {b.texte}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex min-w-0 flex-[0_1_300px] justify-center max-sm:hidden">
            <div className="relative aspect-square w-[min(100%,280px)]">
              <div className="absolute inset-0 rounded-full border-[3px] border-encre bg-white shadow-dur-10" />
              <div className="absolute top-[10%] left-[12%] h-[76%] w-[76%] animate-bob">
                <LogoKraken priority taille={220} className="size-full object-contain" />
              </div>
              {entete.bulle && (
                <span className="kk-display absolute -right-3.5 bottom-[18px] -rotate-[8deg] rounded-xl border-[3px] border-encre bg-bleu px-3.5 py-2 text-[24px] leading-none text-white shadow-dur-4">
                  {entete.bulle}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <div className="kk-container flex flex-col gap-7 pt-10 pb-[clamp(64px,8vw,96px)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div role="group" aria-label="Filtrer par catégorie" className="flex flex-wrap gap-2.5">
            {onglets.map((o) => {
              const actif = o.value === filtre
              return (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={actif}
                  onClick={() => setFiltre(o.value)}
                  className={`kk-btn !min-h-[46px] !gap-2 !rounded-full !px-[18px] !text-[16px] !shadow-dur-3 ${actif ? 'bg-encre text-white' : 'bg-white text-encre'}`}
                >
                  {o.label}
                  <span aria-hidden="true" className="kk-pixel text-[12px] opacity-80">
                    {o.n}
                  </span>
                  <span className="sr-only">({libelleArticles(o.n)})</span>
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-2.5">
            <label htmlFor="kk-tri" className="text-[16px] font-black">
              Trier par
            </label>
            <select
              id="kk-tri"
              value={tri}
              onChange={(e) => setTri(e.target.value as Tri)}
              className="min-h-[46px] cursor-pointer rounded-xl border-[3px] border-encre bg-white px-3.5 text-[16px] font-extrabold text-encre"
            >
              {TRIS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {libelleArticles(liste.length)} affiché{liste.length > 1 ? 's' : ''}
        </p>

        <div className="flex flex-wrap items-start gap-7">
          {liste.length ? (
            <div className="grid min-w-0 flex-[999_1_640px] grid-cols-[repeat(auto-fill,minmax(min(230px,100%),1fr))] gap-6">
              {liste.map((p) => (
                <CarteProduit key={p.id} produit={p} titreNiveau="h2" annoncer={false} />
              ))}
            </div>
          ) : (
            <div className="flex min-w-0 flex-[999_1_640px] flex-col items-center gap-3 rounded-3xl border-[3px] border-dashed border-encre bg-white px-6 py-14 text-center">
              <span className="kk-display text-[28px]">Rien à looter ici… pour l’instant</span>
              <span className="text-[17px] font-bold text-gris">Les articles reviennent très vite. Repasse bientôt !</span>
            </div>
          )}
          <PanierLateral reglages={reglages} produits={catalogue} />
        </div>

        {/* Bandeau soutien */}
        {soutien?.titre && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-5 rounded-3xl border-[3px] border-encre bg-bleu p-[clamp(24px,3vw,32px)] text-white shadow-dur-7">
            <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-1.5">
              <h2 className="kk-display m-0 text-[32px] leading-[1.1] font-normal [text-shadow:0_3px_0_var(--color-encre)]">{soutien.titre}</h2>
              {soutien.texte && <p className="m-0 text-[19px] font-extrabold">{soutien.texte}</p>}
            </div>
            <Bouton href={don.href} externe={don.externe}>
              {soutien.bouton || 'Faire un don'}
            </Bouton>
          </div>
        )}
      </div>
    </>
  )
}
