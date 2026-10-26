'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useId } from 'react'
import type { PageBoutique } from '@/payload-types'
import { IllustrationProduit } from '@/components/IllustrationProduit'
import { Fleche, Icone } from '@/components/icones'
import { arrondiSolidaire, prixDepuisCentimes } from '@/lib/boutique/argent'
import type { LignePanier } from '@/lib/panier/panier'
import { usePanier } from '@/lib/panier/PanierProvider'

// Petites briques partagées par la boutique, le panier et la commande.

const POP = '@keyframes kk-pop{0%{transform:scale(.4)}70%{transform:scale(1.15)}100%{transform:scale(1)}}.kk-pop{animation:kk-pop .35s ease-out}@media (prefers-reduced-motion:reduce){.kk-pop{animation:none}}'

/** Animation « pop » des pastilles du panier (dédoublonnée par React). */
export const StylesBoutique = () => (
  <style href="kk-boutique-pop" precedence="medium">
    {POP}
  </style>
)

const btnQte =
  'grid size-11 shrink-0 cursor-pointer place-items-center rounded-xl border-[3px] border-encre p-0 text-[20px] leading-none font-black text-encre transition-transform active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40'

/** Sélecteur −/+ (boutons de 44 px). `retirerAUn` : le « − » à 1 retire la ligne. */
export function Quantite({
  valeur,
  max,
  onChange,
  libelle,
  retirerAUn = false,
}: {
  valeur: number
  max: number
  onChange: (n: number) => void
  libelle: string
  retirerAUn?: boolean
}) {
  const retire = retirerAUn && valeur <= 1
  return (
    <div role="group" aria-label={`Quantité : ${libelle}`} className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(valeur - 1)}
        disabled={!retirerAUn && valeur <= 1}
        aria-label={retire ? `Retirer ${libelle} du panier` : `Un de moins : ${libelle}`}
        className={`${btnQte} bg-white`}
      >
        −
      </button>
      <span className="min-w-[26px] text-center text-[17px] font-black tabular-nums">{valeur}</span>
      <button type="button" onClick={() => onChange(valeur + 1)} disabled={valeur >= max} aria-label={`Un de plus : ${libelle}`} className={`${btnQte} bg-bleu-clair`}>
        +
      </button>
    </div>
  )
}

/** Case « arrondi solidaire », reliée au panier (donc reportée d'une page à l'autre). */
export function ArrondiCase({ titre, texte, name }: { titre?: string | null; texte?: string | null; name?: string }) {
  const { arrondi, setArrondi } = usePanier()
  const id = useId()
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-[14px] border-2 border-encre bg-rose-clair p-3.5">
      <input id={id} name={name} type="checkbox" checked={arrondi} onChange={(e) => setArrondi(e.target.checked)} className="mt-0.5 size-[22px] shrink-0 cursor-pointer accent-rose-bouton" />
      <span className="flex flex-col gap-0.5">
        <span className="text-[16px] leading-tight font-black">{titre || 'Ajouter un don à ma commande'}</span>
        {texte && <span className="text-[14px] leading-snug font-bold text-gris">{texte}</span>}
      </span>
    </label>
  )
}

/** Vignette carrée d'une ligne de panier : photo, sinon illustration. */
export function Vignette({ ligne, fond = 'bleu', taille = 72 }: { ligne: Pick<LignePanier, 'image' | 'illustration'>; fond?: 'bleu' | 'rose'; taille?: number }) {
  return (
    <span
      aria-hidden="true"
      className={`relative block shrink-0 overflow-hidden rounded-2xl border-[3px] border-encre ${fond === 'rose' ? 'bg-rose-pale' : 'bg-bleu-clair'}`}
      style={{ width: taille, height: taille }}
    >
      {ligne.image ? <Image src={ligne.image} alt="" fill sizes={`${taille}px`} className="object-cover" /> : <IllustrationProduit type={ligne.illustration} />}
    </span>
  )
}

export const Ligne = ({ label, valeur, className = '' }: { label: React.ReactNode; valeur: React.ReactNode; className?: string }) => (
  <div className={`flex items-baseline justify-between gap-3 ${className}`}>
    <dt>{label}</dt>
    <dd className="m-0 text-right font-black">{valeur}</dd>
  </div>
)

/** Bas du panier : arrondi, totaux et bouton vers la commande. */
export function RecapPanier({ reglages, sousTotal, vide, bloque, pret }: { reglages: Pick<PageBoutique, 'arrondi' | 'colissimo'>; sousTotal: number; vide: boolean; bloque: boolean; pret: boolean }) {
  const { arrondi } = usePanier()
  const proposeArrondi = Boolean(reglages.arrondi?.actif)
  const don = proposeArrondi && arrondi && sousTotal > 0 ? arrondiSolidaire(sousTotal) : 0
  const inactif = !pret || vide || bloque
  return (
    <>
      {proposeArrondi && <ArrondiCase titre={reglages.arrondi?.titre} texte={reglages.arrondi?.texte} />}
      <dl className="m-0 flex flex-col gap-2 text-[16px] font-bold">
        <Ligne label="Sous-total" valeur={prixDepuisCentimes(sousTotal)} />
        {don > 0 && <Ligne label="Don solidaire" valeur={`+ ${prixDepuisCentimes(don)}`} className="text-rose-fonce" />}
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-gris">
          <dt>Livraison</dt>
          <dd className="m-0 text-[15px]">Calculée à l’étape suivante</dd>
        </div>
      </dl>
      {don > 0 && reglages.colissimo?.actif && <p className="-mt-2 mb-0 text-[13px] font-bold text-gris">Si tu choisis Colissimo, l’arrondi sera recalculé avec les frais de port.</p>}
      {inactif ? (
        <button type="button" disabled className="kk-btn kk-btn--don w-full">
          Passer commande
          <Fleche size={20} />
        </button>
      ) : (
        <Link href="/commande" className="kk-btn kk-btn--don w-full">
          Passer commande
          <Fleche size={20} />
        </Link>
      )}
      {pret && bloque && (
        <p className="m-0 text-center text-[14px] font-extrabold text-rose-fonce">Un article de ton panier pose souci : corrige-le pour continuer.</p>
      )}
      <span className="flex items-center justify-center gap-2 text-center text-[14px] font-bold text-gris">
        <Icone nom="cadenas" size={16} trait={2.6} />
        Paiement sécurisé par carte bancaire
      </span>
    </>
  )
}
