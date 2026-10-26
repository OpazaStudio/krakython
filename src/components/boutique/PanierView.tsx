'use client'
import Link from 'next/link'
import { useRef } from 'react'
import type { PageBoutique } from '@/payload-types'
import { LogoKraken } from '@/components/decor'
import { Croix, Fleche } from '@/components/icones'
import { Bouton } from '@/components/ui'
import { prixDepuisCentimes } from '@/lib/boutique/argent'
import { libelleArticles, type ProduitCatalogue } from './catalogue'
import { Quantite, RecapPanier, Vignette } from './elements'
import { usePanierAJour } from './usePanierAJour'

const carte = 'rounded-[28px] border-[3px] border-encre bg-white shadow-dur-8'

export function PanierView({ reglages, produits }: { reglages: Pick<PageBoutique, 'panier' | 'arrondi' | 'colissimo'>; produits: ProduitCatalogue[] }) {
  const panier = usePanierAJour(produits)
  const titre = useRef<HTMLHeadingElement>(null)
  const { lignes, pret, nombre, sousTotal } = panier
  const vide = pret && lignes.length === 0

  const retirer = (cle: string) => {
    panier.retirer(cle)
    titre.current?.focus()
  }

  if (!pret) {
    return (
      <div className={`${carte} kk-pixel flex min-h-[220px] items-center justify-center p-8 text-[14px] text-gris`} role="status">
        Chargement de ton inventaire…
      </div>
    )
  }

  if (vide) {
    return (
      <div className={`${carte} mx-auto flex max-w-[640px] flex-col items-center gap-4 px-6 py-12 text-center`}>
        <div className="relative size-[150px]">
          <div className="absolute inset-0 rounded-full border-[3px] border-encre bg-bleu-clair" />
          <div className="absolute inset-[12%] animate-bob">
            <LogoKraken taille={120} className="size-full object-contain" />
          </div>
        </div>
        <h2 className="kk-display m-0 text-[clamp(32px,4vw,44px)] leading-none font-normal">{reglages.panier?.videTitre || 'Le Kraken a faim'}</h2>
        <p className="m-0 max-w-[420px] text-[18px] font-bold text-gris">{reglages.panier?.videTexte || 'Ton panier est vide. Ajoute un article pour commencer.'}</p>
        <Bouton href="/boutique" variante="don">
          Voir la boutique
          <Fleche size={20} />
        </Bouton>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-start gap-7">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {`Panier : ${libelleArticles(nombre)}, sous-total ${prixDepuisCentimes(sousTotal)}.`}
      </p>

      <section aria-labelledby="articles-titre" className={`min-w-0 flex-[999_1_600px] overflow-hidden ${carte}`}>
        <div className="flex items-center justify-between gap-3 border-b-[3px] border-encre bg-papier px-[clamp(18px,3vw,28px)] py-4">
          <h2 id="articles-titre" ref={titre} tabIndex={-1} className="kk-display m-0 text-[30px] leading-none font-normal outline-offset-4">
            Tes articles
          </h2>
          <span className="kk-pixel text-[13px] text-bleu-fonce">{libelleArticles(nombre)}</span>
        </div>
        <ul className="m-0 list-none p-0">
          {lignes.map((l) => {
            const libelle = `${l.nom}${l.taille ? ` (${l.taille})` : ''}`
            return (
              <li key={l.cle} className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b-2 border-dashed border-brume px-[clamp(18px,3vw,28px)] py-5 last:border-b-0">
                <Vignette ligne={l} fond={l.etat.fond} taille={84} />
                <div className="flex min-w-0 flex-[1_1_180px] flex-col gap-1">
                  <Link href={`/boutique/${l.slug}`} className="kk-link kk-display text-[24px] leading-[1.05] text-encre">
                    {l.nom}
                  </Link>
                  <span className="text-[15px] font-bold text-gris">
                    {l.taille ? `Taille ${l.taille} · ` : ''}
                    {prixDepuisCentimes(l.etat.prixCentimes)} l’unité
                  </span>
                  {l.etat.alerte && <span className="text-[14px] leading-snug font-extrabold text-rose-fonce">{l.etat.alerte}</span>}
                </div>
                <div className="ml-auto flex items-center gap-4">
                  <Quantite valeur={l.quantite} max={l.etat.max} onChange={(q) => panier.changerQuantite(l.cle, q)} libelle={libelle} />
                  <span className="min-w-[72px] text-right text-[19px] font-black tabular-nums">{prixDepuisCentimes(l.etat.prixCentimes * l.quantite)}</span>
                  <button
                    type="button"
                    onClick={() => retirer(l.cle)}
                    aria-label={`Retirer ${libelle} du panier`}
                    className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-xl border-[3px] border-encre bg-rose-clair p-0 text-rose-fonce transition-transform hover:-translate-y-0.5"
                  >
                    <Croix size={18} />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
        <div className="border-t-[3px] border-encre bg-papier px-[clamp(18px,3vw,28px)] py-3">
          <Link href="/boutique" className="kk-link inline-flex min-h-11 items-center gap-2 text-[16px] font-black text-encre">
            <Fleche size={18} className="rotate-180" />
            Continuer mes achats
          </Link>
        </div>
      </section>

      <aside aria-labelledby="recap-titre" className="min-w-0 flex-[1_1_340px] overflow-hidden rounded-3xl border-[3px] border-encre bg-white shadow-dur-8 lg:sticky lg:top-[100px]">
        <div className="flex items-center justify-between gap-2.5 bg-encre px-[22px] py-[18px] text-white">
          <h2 id="recap-titre" className="kk-display m-0 text-[28px] leading-none font-normal">
            Récap
          </h2>
          <span className="kk-pixel text-[13px] text-ciel">{libelleArticles(nombre)}</span>
        </div>
        <div className="flex flex-col gap-[18px] px-[22px] pt-5 pb-6">
          <RecapPanier reglages={reglages} sousTotal={sousTotal} vide={vide} bloque={panier.bloque} pret={pret} />
        </div>
      </aside>
    </div>
  )
}
