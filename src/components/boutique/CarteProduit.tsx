'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Produit } from '@/payload-types'
import { Coche } from '@/components/icones'
import { prix } from '@/lib/boutique/argent'
import { aDesTailles, estEpuise } from '@/lib/boutique/produit'
import { QUANTITE_MAX } from '@/lib/panier/panier'
import { usePanier } from '@/lib/panier/PanierProvider'
import { versAjout } from './catalogue'
import { StylesBoutique } from './elements'
import { ProduitVisuel } from './ProduitVisuel'

type Props = {
  produit: Produit
  titreNiveau?: 'h2' | 'h3'
  /** Annonce « ajouté » aux lecteurs d'écran (inutile si un panier visible l'annonce déjà). */
  annoncer?: boolean
}

export function CarteProduit({ produit, titreNiveau = 'h3', annoncer = true }: Props) {
  const panier = usePanier()
  const [ajoute, setAjoute] = useState(0)
  const Titre = titreNiveau
  const epuise = estEpuise(produit)
  const tailles = aDesTailles(produit)
  const dansPanier = panier.pret ? panier.lignes.filter((l) => l.produitId === produit.id).reduce((n, l) => n + l.quantite, 0) : 0
  const max = Math.min(QUANTITE_MAX, produit.stock ?? QUANTITE_MAX)
  const auMax = !tailles && dansPanier >= max
  const lien = `/boutique/${produit.slug}`

  useEffect(() => {
    if (!ajoute) return
    const t = window.setTimeout(() => setAjoute(0), 1600)
    return () => window.clearTimeout(t)
  }, [ajoute])

  const ajouter = () => {
    panier.ajouter(versAjout(produit, null))
    setAjoute(Date.now())
  }

  const bouton = '!min-h-[46px] w-full !rounded-xl !text-[16px]'

  return (
    <article className="kk-card flex h-full flex-col overflow-hidden rounded-[22px] border-[3px] border-encre bg-white shadow-dur-6">
      <StylesBoutique />
      <Link href={lien} className="relative block aspect-square border-b-[3px] border-encre" tabIndex={-1} aria-hidden="true">
        <ProduitVisuel produit={produit} />
        {produit.badge && <span className="kk-pixel absolute top-3.5 left-3.5 rounded-lg bg-encre px-2.5 py-1.5 text-[12px] tracking-normal text-white">{produit.badge}</span>}
        {dansPanier > 0 && (
          <span
            key={dansPanier}
            className={`kk-pop absolute right-3 rounded-full border-2 border-encre bg-rose-bouton px-2.5 py-1.5 text-[14px] font-black text-white ${produit.badge ? (epuise ? 'bottom-14' : 'bottom-3') : 'top-3'}`}
          >
            x{dansPanier} au panier
          </span>
        )}
        {epuise && <span className="kk-display absolute inset-x-0 bottom-0 bg-encre/85 py-2 text-center text-[22px] text-white">Épuisé</span>}
      </Link>
      <div className="flex flex-grow flex-col gap-3 px-[18px] pt-[18px] pb-5">
        <div className="flex items-baseline justify-between gap-2.5">
          <Titre className="kk-display m-0 text-[24px] leading-[1.1] font-normal">
            <Link href={lien} className="kk-link text-encre">
              {produit.nom}
            </Link>
          </Titre>
          <span className="text-[18px] font-black whitespace-nowrap">{prix(produit.prix)}</span>
        </div>
        {produit.sousTitre && <span className="text-[15px] font-bold text-gris">{produit.sousTitre}</span>}
        <span className="flex-grow" />
        {epuise ? (
          <span className={`kk-btn kk-btn--blanc ${bouton} !cursor-default !shadow-none opacity-60`}>Épuisé</span>
        ) : tailles ? (
          <Link href={lien} className={`kk-btn kk-btn--noir ${bouton}`}>
            Choisir ma taille
          </Link>
        ) : auMax ? (
          <button type="button" disabled className={`kk-btn kk-btn--blanc ${bouton} !shadow-none`}>
            Tout le stock est au panier
          </button>
        ) : (
          <button type="button" onClick={ajouter} className={`kk-btn kk-btn--noir ${bouton}`}>
            {ajoute ? (
              <>
                <Coche size={18} />
                Ajouté !
              </>
            ) : (
              'Ajouter au panier'
            )}
          </button>
        )}
        {annoncer && (
          <span role="status" className="sr-only">
            {ajoute ? `${produit.nom} ajouté au panier (${dansPanier} au total).` : ''}
          </span>
        )}
      </div>
    </article>
  )
}
