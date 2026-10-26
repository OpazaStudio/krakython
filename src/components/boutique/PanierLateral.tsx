'use client'
import Link from 'next/link'
import { useRef } from 'react'
import type { PageBoutique } from '@/payload-types'
import { LogoKraken } from '@/components/decor'
import { prixDepuisCentimes } from '@/lib/boutique/argent'
import { libelleArticles, type ProduitCatalogue } from './catalogue'
import { Quantite, RecapPanier } from './elements'
import { usePanierAJour } from './usePanierAJour'

/** Panier latéral « Ton inventaire » de la page boutique. */
export function PanierLateral({ reglages, produits }: { reglages: Pick<PageBoutique, 'panier' | 'arrondi' | 'colissimo'>; produits: ProduitCatalogue[] }) {
  const panier = usePanierAJour(produits)
  const titre = useRef<HTMLHeadingElement>(null)
  const { lignes, pret, nombre, sousTotal } = panier
  const vide = pret && lignes.length === 0

  const changer = (cle: string, q: number) => {
    panier.changerQuantite(cle, q)
    // La ligne disparaît : on rend le focus au titre du panier plutôt qu'au vide.
    if (q <= 0) titre.current?.focus()
  }

  return (
    <aside id="panier" aria-labelledby="panier-titre" className="min-w-0 flex-[1_1_340px] overflow-hidden rounded-3xl border-[3px] border-encre bg-white shadow-dur-8 lg:sticky lg:top-[100px]">
      <div className="flex flex-wrap items-center justify-between gap-x-2.5 gap-y-1 bg-encre px-[22px] py-[18px] text-white">
        <h2 id="panier-titre" ref={titre} tabIndex={-1} className="kk-display m-0 text-[28px] leading-none font-normal outline-offset-4">
          {reglages.panier?.titre || 'Ton inventaire'}
        </h2>
        <span className="kk-pixel text-[13px] whitespace-nowrap text-ciel">{pret ? libelleArticles(nombre) : '…'}</span>
      </div>

      <div className="flex flex-col gap-[18px] px-[22px] pt-5 pb-6">
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {pret ? `Panier : ${libelleArticles(nombre)}, sous-total ${prixDepuisCentimes(sousTotal)}.` : ''}
        </p>

        {!pret ? (
          <div className="kk-pixel py-6 text-center text-[13px] text-gris">Chargement de l’inventaire…</div>
        ) : vide ? (
          <div className="flex flex-col items-center gap-2.5 pt-3 pb-1.5 text-center">
            <LogoKraken taille={88} className="h-auto w-[88px] opacity-90" />
            <span className="kk-display text-[24px] leading-tight">{reglages.panier?.videTitre || 'Le Kraken a faim'}</span>
            <span className="text-[16px] font-bold text-gris">{reglages.panier?.videTexte || 'Ton panier est vide. Ajoute un article pour commencer.'}</span>
          </div>
        ) : (
          <ul className="m-0 flex list-none flex-col p-0 lg:max-h-[min(42vh,380px)] lg:overflow-y-auto">
            {lignes.map((l) => {
              const libelle = `${l.nom}${l.taille ? ` (${l.taille})` : ''}`
              return (
                <li key={l.cle} className="flex items-center gap-3 border-b-2 border-dashed border-brume py-3 last:border-b-0">
                  <div className="flex min-w-0 flex-auto flex-col gap-0.5">
                    <Link href={`/boutique/${l.slug}`} className="kk-link text-[16px] leading-tight font-black text-encre">
                      {l.nom}
                    </Link>
                    <span className="text-[14px] font-bold text-gris">
                      {prixDepuisCentimes(l.etat.prixCentimes)}
                      {l.taille ? ` · Taille ${l.taille}` : ''}
                    </span>
                    {l.etat.alerte && <span className="text-[13px] leading-snug font-extrabold text-rose-fonce">{l.etat.alerte}</span>}
                  </div>
                  <Quantite valeur={l.quantite} max={l.etat.max} onChange={(q) => changer(l.cle, q)} libelle={libelle} retirerAUn />
                </li>
              )
            })}
          </ul>
        )}

        <RecapPanier reglages={reglages} sousTotal={sousTotal} vide={vide} bloque={panier.bloque} pret={pret} />
        {pret && !vide && (
          <Link href="/panier" className="kk-link -my-2 inline-flex min-h-11 items-center justify-center text-[15px] font-black text-bleu-fonce underline underline-offset-4">
            Voir le détail du panier
          </Link>
        )}
      </div>
    </aside>
  )
}
