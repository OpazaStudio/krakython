'use client'
import Link from 'next/link'
import { startTransition, useActionState, useId, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from 'react'
import type { PageBoutique } from '@/payload-types'
import { demarrerPaiement } from '@/app/(frontend)/commande/actions'
import { LogoKraken } from '@/components/decor'
import { Fleche, Icone } from '@/components/icones'
import { Bouton } from '@/components/ui'
import { prix, prixDepuisCentimes } from '@/lib/boutique/argent'
import { MODE_LABELS, type ModeLivraison } from '@/lib/boutique/statuts'
import { calculerTotaux, libelleArticles, type ProduitCatalogue } from './catalogue'
import { ArrondiCase, Ligne, Vignette } from './elements'
import { usePanierAJour } from './usePanierAJour'

type Reglages = Pick<PageBoutique, 'colissimo' | 'retrait' | 'arrondi' | 'panier'>

const carte = 'rounded-[28px] border-[3px] border-encre bg-white shadow-dur-8'
const sectionCls = 'flex flex-col gap-5 p-[clamp(22px,3.5vw,40px)]'
const separe = 'border-b-[3px] border-dashed border-brume'

function Champ({ label, aide, optionnel = false, className = '', ...input }: InputHTMLAttributes<HTMLInputElement> & { label: string; aide?: string; optionnel?: boolean }) {
  const id = useId()
  return (
    <div className={`kk-field min-w-0 ${className}`}>
      <label htmlFor={id}>
        {label}
        {optionnel && <span className="font-bold text-gris"> (facultatif)</span>}
      </label>
      <input id={id} className="kk-input w-full min-w-0" aria-describedby={aide ? `${id}-aide` : undefined} required={!optionnel} {...input} />
      {aide && (
        <span id={`${id}-aide`} className="text-[14px] font-bold text-gris">
          {aide}
        </span>
      )}
    </div>
  )
}

function TitreBloc({ id, surtitre, children }: { id?: string; surtitre: string; children: ReactNode }) {
  return (
    <span className="flex flex-col gap-1.5">
      <span className="kk-pixel text-[13px] text-rose-bouton">{surtitre}</span>
      <h2 id={id} className="kk-display m-0 text-[clamp(28px,3vw,36px)] leading-none font-normal">
        {children}
      </h2>
    </span>
  )
}

export function CommandeForm({ reglages, produits }: { reglages: Reglages; produits: ProduitCatalogue[] }) {
  const panier = usePanierAJour(produits)
  const [etat, payer, enCours] = useActionState(demarrerPaiement, undefined)
  const [essai, setEssai] = useState(0)
  const modes = (['colissimo', 'retrait'] as const).filter((m) => reglages[m]?.actif)
  const [mode, setMode] = useState<ModeLivraison | null>(modes[0] ?? null)
  const [champs, setChamps] = useState({ nom: '', email: '', telephone: '', adresse: '', codePostal: '', ville: '' })
  const [cgv, setCgv] = useState(false)

  const { lignes, pret, nombre } = panier
  const totaux = calculerTotaux(panier.sousTotal, mode, reglages, panier.arrondi)
  const maj = (k: keyof typeof champs) => (e: React.ChangeEvent<HTMLInputElement>) => setChamps((c) => ({ ...c, [k]: e.target.value }))
  const colissimo = mode === 'colissimo'

  const envoyer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (enCours || panier.bloque || !mode || !lignes.length) return
    const donnees = new FormData(e.currentTarget)
    setEssai((n) => n + 1)
    startTransition(() => payer(donnees))
  }

  if (!pret) {
    return (
      <div role="status" className={`${carte} kk-pixel flex min-h-[240px] items-center justify-center p-8 text-[14px] text-gris`}>
        Chargement de ton inventaire…
      </div>
    )
  }

  if (!lignes.length) {
    return (
      <div className={`${carte} mx-auto flex max-w-[640px] flex-col items-center gap-4 px-6 py-12 text-center`}>
        <LogoKraken taille={110} className="h-auto w-[110px] animate-bob" />
        <h2 className="kk-display m-0 text-[clamp(32px,4vw,44px)] leading-none font-normal">{reglages.panier?.videTitre || 'Le Kraken a faim'}</h2>
        <p className="m-0 max-w-[440px] text-[18px] font-bold text-gris">Ton panier est vide : il n’y a rien à commander pour l’instant. Fais un tour à la boutique !</p>
        <Bouton href="/boutique" variante="don">
          Voir la boutique
          <Fleche size={20} />
        </Bouton>
      </div>
    )
  }

  if (!mode) {
    return (
      <div role="alert" className={`${carte} mx-auto flex max-w-[640px] flex-col items-center gap-4 px-6 py-12 text-center`}>
        <h2 className="kk-display m-0 text-[36px] leading-none font-normal">Commandes en pause</h2>
        <p className="m-0 text-[18px] font-bold text-gris">Aucun mode de livraison n’est ouvert pour le moment. Ton panier reste de côté : reviens un peu plus tard !</p>
        <Bouton href="/panier">Retour au panier</Bouton>
      </div>
    )
  }

  const panierJson = JSON.stringify(lignes.map((l) => ({ produitId: l.produitId, tailleId: l.tailleId, quantite: l.quantite })))

  return (
    <form onSubmit={envoyer} className="flex flex-wrap items-start gap-7">
      <input type="hidden" name="panier" value={panierJson} />

      <div className={`min-w-0 flex-[999_1_600px] overflow-hidden ${carte}`}>
        {/* Coordonnées */}
        <section aria-labelledby="coordonnees-titre" className={`${sectionCls} ${separe}`}>
          <TitreBloc id="coordonnees-titre" surtitre="Joueur 1">
            Tes coordonnées
          </TitreBloc>
          <p className="-mt-1 mb-0 text-[15px] font-bold text-gris">Tous les champs sont obligatoires, sauf mention contraire.</p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] gap-4">
            <Champ label="Nom et prénom" name="nom" autoComplete="name" minLength={2} maxLength={120} value={champs.nom} onChange={maj('nom')} />
            <Champ label="E-mail" name="email" type="email" autoComplete="email" maxLength={200} value={champs.email} onChange={maj('email')} aide="Pour t’envoyer la confirmation." />
            <Champ
              label="Téléphone"
              name="telephone"
              type="tel"
              autoComplete="tel"
              minLength={colissimo ? 6 : undefined}
              maxLength={25}
              optionnel={!colissimo}
              value={champs.telephone}
              onChange={maj('telephone')}
              aide={colissimo ? 'Pour le suivi Colissimo.' : 'Pratique pour convenir du retrait.'}
            />
          </div>
        </section>

        {/* Livraison */}
        <section className={`${sectionCls} ${separe}`}>
          <fieldset className="m-0 flex min-w-0 flex-col gap-5 border-0 p-0">
            <legend className="float-left w-full p-0">
              <TitreBloc surtitre="Point de spawn">Livraison</TitreBloc>
            </legend>
            <div className="grid gap-3.5">
              {modes.map((m) => {
                const actif = mode === m
                return (
                  <label
                    key={m}
                    className={`flex cursor-pointer items-start gap-3.5 rounded-[18px] border-[3px] border-encre p-4 transition-transform ${actif ? '-translate-y-0.5 bg-bleu-clair shadow-dur-5' : 'bg-white hover:-translate-y-0.5'}`}
                  >
                    <input type="radio" name="mode" value={m} checked={actif} onChange={() => setMode(m)} required className="mt-1 size-[22px] shrink-0 cursor-pointer accent-bleu-fonce" />
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <span className="inline-flex items-center gap-2 text-[18px] font-black">
                          <Icone nom={m === 'colissimo' ? 'camion' : 'maison'} size={20} />
                          {MODE_LABELS[m]}
                        </span>
                        <span className="kk-display text-[22px]">{m === 'colissimo' ? prix(reglages.colissimo?.prix ?? 0) : 'Gratuit'}</span>
                      </span>
                      <span className="text-[15px] leading-snug font-semibold text-texte">
                        {m === 'colissimo' ? `Livraison ${reglages.colissimo?.delai || 'sous quelques jours'}, en France métropolitaine.` : reglages.retrait?.texte}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          {colissimo && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[200px_minmax(0,1fr)]">
              <Champ label="Adresse" name="adresse" autoComplete="street-address" minLength={4} maxLength={200} value={champs.adresse} onChange={maj('adresse')} className="sm:col-span-2" />
              <Champ
                label="Code postal"
                name="codePostal"
                inputMode="numeric"
                autoComplete="postal-code"
                pattern="[0-9]{5}"
                maxLength={5}
                value={champs.codePostal}
                onChange={maj('codePostal')}
                aide="France métropolitaine."
              />
              <Champ label="Ville" name="ville" autoComplete="address-level2" maxLength={100} value={champs.ville} onChange={maj('ville')} />
            </div>
          )}
        </section>

        {/* Validation */}
        <section aria-labelledby="validation-titre" className={`${sectionCls} bg-rose-pale`}>
          <TitreBloc id="validation-titre" surtitre="Dernier boss">
            Validation
          </TitreBloc>
          {reglages.arrondi?.actif && <ArrondiCase name="arrondi" titre={reglages.arrondi.titre} texte={reglages.arrondi.texte} />}
          <label className="flex cursor-pointer items-start gap-3 text-[16px] leading-snug font-bold">
            <input type="checkbox" name="cgv" required checked={cgv} onChange={(e) => setCgv(e.target.checked)} className="mt-0.5 size-[22px] shrink-0 cursor-pointer accent-bleu-fonce" />
            <span>
              J’ai lu et j’accepte les{' '}
              <a href="/cgv" target="_blank" rel="noopener" className="font-black text-bleu-fonce underline underline-offset-3">
                conditions générales de vente
                <span className="sr-only"> (nouvel onglet)</span>
              </a>
              .
            </span>
          </label>
        </section>
      </div>

      {/* Récap */}
      <aside aria-labelledby="recap-titre" className="min-w-0 flex-[1_1_340px] overflow-hidden rounded-3xl border-[3px] border-encre bg-white shadow-dur-8 lg:sticky lg:top-[100px]">
        <div className="flex items-center justify-between gap-2.5 bg-encre px-[22px] py-[18px] text-white">
          <h2 id="recap-titre" className="kk-display m-0 text-[28px] leading-none font-normal">
            {reglages.panier?.titre || 'Ton inventaire'}
          </h2>
          <Link href="/panier" className="kk-link inline-flex min-h-11 items-center text-[15px] font-black text-ciel underline underline-offset-4">
            Modifier<span className="sr-only"> le panier</span>
          </Link>
        </div>
        <div className="flex flex-col gap-[18px] px-[22px] pt-4 pb-6">
          <ul className="m-0 flex list-none flex-col p-0" aria-label={libelleArticles(nombre)}>
            {lignes.map((l) => (
              <li key={l.cle} className="flex items-center gap-3 border-b-2 border-dashed border-brume py-3 last:border-b-0">
                <Vignette ligne={l} fond={l.etat.fond} taille={52} />
                <span className="flex min-w-0 flex-auto flex-col">
                  <span className="text-[16px] leading-tight font-black">{l.nom}</span>
                  <span className="text-[14px] font-bold text-gris">
                    {l.taille ? `Taille ${l.taille} · ` : ''}x{l.quantite}
                  </span>
                  {l.etat.alerte && <span className="text-[13px] leading-snug font-extrabold text-rose-fonce">{l.etat.alerte}</span>}
                </span>
                <span className="text-[16px] font-black whitespace-nowrap tabular-nums">{prixDepuisCentimes(l.etat.prixCentimes * l.quantite)}</span>
              </li>
            ))}
          </ul>

          <dl className="m-0 flex flex-col gap-2 text-[16px] font-bold">
            <Ligne label="Sous-total" valeur={prixDepuisCentimes(totaux.sousTotal)} />
            <Ligne label={colissimo ? 'Livraison Colissimo' : 'Retrait en main propre'} valeur={totaux.frais ? prixDepuisCentimes(totaux.frais) : 'Gratuit'} />
            {totaux.don > 0 && <Ligne label="Don solidaire" valeur={`+ ${prixDepuisCentimes(totaux.don)}`} className="text-rose-fonce" />}
            <div className="mt-1 flex items-baseline justify-between gap-3 border-t-[3px] border-encre pt-3">
              <dt className="text-[18px] font-black">Total</dt>
              <dd className="kk-display m-0 text-[34px] leading-none">{prixDepuisCentimes(totaux.total)}</dd>
            </div>
          </dl>

          {etat?.erreur && !enCours && (
            <p key={essai} role="alert" className="m-0 rounded-xl border-[3px] border-encre bg-rose-clair px-4 py-3 text-[16px] leading-snug font-extrabold text-rose-fonce">
              {etat.erreur}
            </p>
          )}
          {panier.bloque && (
            <p className="m-0 rounded-xl border-2 border-encre bg-rose-clair px-4 py-3 text-[15px] leading-snug font-extrabold text-rose-fonce">
              Un article pose souci.{' '}
              <Link href="/panier" className="text-rose-fonce underline underline-offset-3">
                Corrige ton panier
              </Link>{' '}
              pour continuer.
            </p>
          )}

          <button type="submit" disabled={enCours || panier.bloque} aria-describedby="paiement-aide" className="kk-btn kk-btn--don kk-btn--lg w-full">
            {enCours ? (
              'Redirection vers le paiement…'
            ) : (
              <>
                <Icone nom="cadenas" size={20} trait={2.6} />
                Payer {prixDepuisCentimes(totaux.total)}
              </>
            )}
          </button>
          <p role="status" className="sr-only">
            {enCours ? 'Redirection vers le paiement…' : ''}
          </p>
          <p id="paiement-aide" className="m-0 text-center text-[14px] leading-snug font-bold text-gris">
            Tu vas être redirigé vers la page de paiement sécurisée Stripe (carte bancaire).
          </p>
        </div>
      </aside>
    </form>
  )
}
