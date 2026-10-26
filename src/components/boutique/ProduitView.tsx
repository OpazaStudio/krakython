'use client'
import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import type { PageBoutique, Produit } from '@/payload-types'
import { Img } from '@/components/Img'
import { Coche, Fleche, Icone, Panier } from '@/components/icones'
import { RichText } from '@/components/RichText'
import { Pulse } from '@/components/decor'
import { Etiquette } from '@/components/ui'
import { prix } from '@/lib/boutique/argent'
import { aDesTailles, estEpuise, stockBas, tailleDisponible } from '@/lib/boutique/produit'
import { isMedia } from '@/lib/media'
import { cleLigne, QUANTITE_MAX } from '@/lib/panier/panier'
import { usePanier } from '@/lib/panier/PanierProvider'
import { useLiveDoc } from '@/lib/useLiveDoc'
import { CarteProduit } from './CarteProduit'
import { versAjout } from './catalogue'
import { Quantite, StylesBoutique } from './elements'
import { ProduitVisuel } from './ProduitVisuel'

type Props = {
  produit: Produit
  categorie: string
  reglages: Pick<PageBoutique, 'colissimo' | 'retrait'>
  autres: Produit[]
}

export function ProduitView({ produit: initial, categorie, reglages, autres }: Props) {
  const produit = useLiveDoc(initial, { collectionSlug: 'produits' }, 1)
  const panier = usePanier()
  const idTailles = useId()
  const groupeTailles = useRef<HTMLFieldSetElement>(null)
  const [photo, setPhoto] = useState(0)
  const [tailleId, setTailleId] = useState<string | null>(null)
  const [quantite, setQuantite] = useState(1)
  const [erreur, setErreur] = useState<string | null>(null)
  const [ajout, setAjout] = useState<{ n: number; id: number } | null>(null)
  const [flash, setFlash] = useState(0)

  const photos = (produit.photos ?? []).filter(isMedia)
  const tailles = produit.tailles ?? []
  const avecTailles = aDesTailles(produit)
  const epuise = estEpuise(produit)
  const taille = tailles.find((t) => t.id === tailleId && tailleDisponible(t)) ?? null
  const stock = avecTailles ? (taille ? taille.stock : null) : produit.stock
  const reste = stockBas(stock)
  const cle = cleLigne(produit.id, avecTailles ? (taille?.id ?? null) : null)
  const dejaLa = panier.pret && (!avecTailles || taille) ? (panier.lignes.find((l) => l.cle === cle)?.quantite ?? 0) : 0
  const totalPanier = panier.pret ? panier.lignes.filter((l) => l.produitId === produit.id).reduce((n, l) => n + l.quantite, 0) : 0
  const max = Math.max(0, Math.min(QUANTITE_MAX, stock ?? QUANTITE_MAX) - dejaLa)
  const qte = Math.max(1, Math.min(quantite, max || 1))

  useEffect(() => {
    if (!flash) return
    const t = window.setTimeout(() => setFlash(0), 2200)
    return () => window.clearTimeout(t)
  }, [flash])

  const choisirTaille = (id: string) => {
    setTailleId(id)
    setErreur(null)
    setQuantite(1)
  }

  const ajouter = () => {
    if (avecTailles && !taille) {
      setErreur('Choisis d’abord ta taille.')
      groupeTailles.current?.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus()
      return
    }
    if (max <= 0) return
    panier.ajouter(versAjout(produit, taille), qte)
    const id = Date.now()
    setAjout({ n: qte, id })
    setFlash(id)
    setQuantite(1)
  }

  const vientDAjouter = flash > 0
  const libelle = `${produit.nom}${taille ? ` (${taille.taille})` : ''}`
  const altVisuel = (i: number) => {
    const p = photos[i]
    return (p?.alt || '').trim() || (photos.length > 1 ? `${produit.nom}, photo ${i + 1} sur ${photos.length}` : produit.nom)
  }

  return (
    <div className="kk-container flex flex-col gap-[clamp(48px,6vw,80px)] pt-7 pb-[clamp(64px,8vw,96px)]">
      <StylesBoutique />
      <div className="flex flex-col gap-6">
        <Link href="/boutique" className="kk-link inline-flex min-h-11 items-center gap-2 self-start text-[16px] font-black text-encre">
          <Fleche size={18} className="rotate-180" />
          Retour à la boutique
        </Link>

        <div className="flex flex-wrap items-start gap-[clamp(28px,5vw,64px)]">
          {/* Galerie */}
          <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-4">
            <div className="relative aspect-square overflow-hidden rounded-[28px] border-[3px] border-encre shadow-dur-10">
              <ProduitVisuel produit={produit} index={photo} priority sizes="(min-width:1024px) 600px, 100vw" alt={altVisuel(photo)} />
              {produit.badge && <span className="kk-pixel absolute top-4 left-4 rounded-lg bg-encre px-3 py-2 text-[13px] tracking-normal text-white">{produit.badge}</span>}
              {epuise && <span className="kk-display absolute inset-x-0 bottom-0 bg-encre/85 py-3 text-center text-[28px] text-white">Épuisé</span>}
            </div>
            {photos.length > 1 && (
              <ul className="m-0 flex list-none flex-wrap gap-3 p-0" aria-label="Photos du produit">
                {photos.map((p, i) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setPhoto(i)}
                      aria-pressed={i === photo}
                      aria-label={`Afficher la photo ${i + 1} sur ${photos.length}`}
                      className={`relative block size-[76px] cursor-pointer overflow-hidden rounded-2xl border-[3px] border-encre p-0 transition-transform ${i === photo ? '-translate-y-0.5 shadow-rose-6' : 'bg-white opacity-75 hover:opacity-100'}`}
                    >
                      <Img media={p} fill sizes="76px" size="miniature" alt="" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Infos et achat */}
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Etiquette>{categorie}</Etiquette>
              <h1 className="kk-display m-0 text-[clamp(44px,5.5vw,72px)] leading-[0.98] font-normal">{produit.nom}</h1>
              {produit.sousTitre && <p className="m-0 text-[19px] leading-snug font-bold text-gris">{produit.sousTitre}</p>}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="kk-display text-[48px] leading-none">{prix(produit.prix)}</span>
              <span className="rounded-full border-2 border-encre bg-rose-clair px-3 py-1.5 text-[14px] font-extrabold">Bénéfices reversés à la cause</span>
            </div>

            <div className="flex flex-col gap-5 rounded-3xl border-[3px] border-encre bg-white p-[clamp(20px,3vw,28px)] shadow-dur-8">
              {avecTailles && (
                <fieldset ref={groupeTailles} className="m-0 min-w-0 border-0 p-0" aria-describedby={erreur ? `${idTailles}-erreur` : undefined}>
                  <legend className="mb-3 p-0 text-[17px] font-black">Choisis ta taille</legend>
                  <div className="flex flex-wrap gap-2.5">
                    {tailles.map((t) => {
                      const dispo = tailleDisponible(t)
                      const coche = t.id === tailleId && dispo
                      return (
                        <label
                          key={t.id}
                          className={`relative grid min-h-12 min-w-[62px] place-items-center rounded-xl border-[3px] px-3.5 text-[17px] font-black transition-transform has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-rose ${
                            !dispo
                              ? 'cursor-not-allowed border-brume bg-papier text-gris line-through decoration-2'
                              : coche
                                ? 'cursor-pointer border-encre bg-encre text-white shadow-[3px_3px_0_var(--color-rose)]'
                                : 'cursor-pointer border-encre bg-white text-encre shadow-dur-3 hover:-translate-y-0.5'
                          }`}
                        >
                          <input type="radio" name={`taille-${produit.id}`} value={t.id ?? ''} checked={coche} disabled={!dispo} onChange={() => t.id && choisirTaille(t.id)} className="sr-only" />
                          {t.taille}
                          {!dispo && <span className="sr-only"> (épuisée)</span>}
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
              )}

              {!epuise && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[17px] font-black" id={`${idTailles}-qte`}>
                    Quantité
                  </span>
                  <Quantite valeur={qte} max={max} onChange={(n) => setQuantite(n)} libelle={libelle} />
                </div>
              )}

              {reste != null && (
                <p className="m-0 inline-flex items-center gap-2 text-[16px] font-extrabold text-rose-fonce">
                  <Pulse couleur="var(--color-rose-bouton)" taille={9} />
                  Plus que {reste} en stock{taille ? ` en ${taille.taille}` : ''} !
                </p>
              )}
              {erreur && (
                <p id={`${idTailles}-erreur`} role="alert" className="m-0 rounded-xl border-2 border-encre bg-rose-clair px-3.5 py-2.5 text-[16px] font-extrabold text-rose-fonce">
                  {erreur}
                </p>
              )}

              <div className="flex flex-col">
                {epuise ? (
                  <button type="button" disabled className="kk-btn kk-btn--blanc kk-btn--lg w-full">
                    Épuisé pour le moment
                  </button>
                ) : (avecTailles ? taille : true) && max <= 0 ? (
                  <button type="button" disabled className="kk-btn kk-btn--blanc kk-btn--lg w-full">
                    Tout le stock est dans ton panier
                  </button>
                ) : (
                  <button type="button" onClick={ajouter} className="kk-btn kk-btn--don kk-btn--lg w-full">
                    {vientDAjouter ? (
                      <>
                        <Coche size={22} />
                        Ajouté !
                      </>
                    ) : (
                      <>
                        <Panier size={22} />
                        Ajouter au panier
                      </>
                    )}
                  </button>
                )}
                <div role="status">
                  {ajout && totalPanier > 0 && (
                    <div key={ajout.id} className="kk-pop mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-2xl border-[3px] border-encre bg-bleu-clair px-4 py-2.5">
                      <span className="text-[16px] font-extrabold">
                        {ajout.n > 1 ? `${ajout.n} ajoutés` : 'Ajouté'} à ton inventaire ! x{totalPanier} dans ton panier.
                      </span>
                      <Link href="/panier" className="kk-link inline-flex min-h-11 items-center gap-1.5 text-[16px] font-black text-bleu-fonce">
                        Voir mon panier
                        <Fleche size={18} />
                      </Link>
                    </div>
                  )}
                </div>
                {!ajout && totalPanier > 0 && (
                  <Link href="/panier" className="kk-link mt-3 inline-flex min-h-11 items-center gap-1.5 self-start text-[16px] font-black text-bleu-fonce">
                    Déjà x{totalPanier} dans ton panier · voir le panier
                    <Fleche size={18} />
                  </Link>
                )}
              </div>
            </div>

            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {reglages.colissimo?.actif && (
                <InfoLivraison icone="camion" couleur="bg-bleu" titre={`Colissimo à domicile · ${prix(reglages.colissimo.prix ?? 0)}`}>
                  {reglages.colissimo.delai ? `Livraison ${reglages.colissimo.delai}, en France métropolitaine.` : 'En France métropolitaine.'}
                </InfoLivraison>
              )}
              {reglages.retrait?.actif && (
                <InfoLivraison icone="maison" couleur="bg-rose" titre="Retrait en main propre">
                  {reglages.retrait.texte}
                </InfoLivraison>
              )}
              <InfoLivraison icone="cadenas" couleur="bg-encre" titre="Paiement sécurisé">
                Par carte bancaire, sur la page de paiement Stripe.
              </InfoLivraison>
            </ul>
          </div>
        </div>
      </div>

      {produit.description && (
        <section aria-labelledby="description-titre" className="flex flex-col gap-4 rounded-[28px] border-[3px] border-encre bg-white p-[clamp(24px,4vw,44px)] shadow-dur-8">
          <Etiquette couleur="bleu">Fiche de l’objet</Etiquette>
          <h2 id="description-titre" className="kk-display m-0 text-[clamp(32px,3.6vw,44px)] leading-none font-normal">
            Description
          </h2>
          <RichText data={produit.description} className="max-w-[760px]" />
        </section>
      )}

      {autres.length > 0 && (
        <section aria-labelledby="autres-titre" className="flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="flex flex-col gap-3">
              <Etiquette couleur="rose-fonce">Loot bonus</Etiquette>
              <h2 id="autres-titre" className="kk-display m-0 text-[clamp(36px,4.4vw,56px)] leading-none font-normal">
                Complète ton inventaire
              </h2>
            </div>
            <Link href="/boutique" className="kk-btn kk-btn--blanc kk-btn--sm">
              Toute la boutique
              <Fleche size={18} />
            </Link>
          </div>
          {/* Sur mobile : rangée qui défile à l'horizontale plutôt que 4 grandes cartes empilées. */}
          <ul className="-mx-5 grid list-none auto-cols-[min(78%,280px)] grid-flow-col gap-5 overflow-x-auto px-5 pt-1 pb-4 [scrollbar-width:thin] max-sm:snap-x max-sm:snap-mandatory sm:mx-0 sm:grid-flow-row sm:grid-cols-[repeat(auto-fill,minmax(min(230px,100%),1fr))] sm:gap-6 sm:overflow-visible sm:px-0 sm:pt-0 sm:pb-0">
            {autres.map((p) => (
              <li key={p.id} className="min-w-0 snap-start">
                <CarteProduit produit={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function InfoLivraison({ icone, couleur, titre, children }: { icone: string; couleur: string; titre: string; children?: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3.5 rounded-[18px] border-[3px] border-encre bg-white p-4">
      <span className={`grid size-12 shrink-0 place-items-center rounded-[14px] border-[3px] border-encre text-white ${couleur}`}>
        <Icone nom={icone} size={22} trait={2.5} />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[17px] font-black">{titre}</span>
        {children && <span className="text-[15px] leading-snug font-semibold text-texte">{children}</span>}
      </span>
    </li>
  )
}
