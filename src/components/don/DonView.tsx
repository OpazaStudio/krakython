'use client'
import Link from 'next/link'
import { useId, useState } from 'react'
import type { PageDon } from '@/payload-types'
import { nombreFr, pourcentage } from '@/components/Cagnotte'
import { Anneaux, LogoKraken, Pulse } from '@/components/decor'
import { Coche, Coeur, Externe, Icone } from '@/components/icones'
import { Bouton, PastilleNoire } from '@/components/ui'
import { useSite } from '@/lib/contexte'
import { useLiveDoc } from '@/lib/useLiveDoc'
import { fr } from '@/lib/typo'

// L'alerte de l'aperçu glisse en place à chaque changement de montant.
const STYLE = `@keyframes kk-slide{0%{transform:translateY(10px);opacity:0}100%{transform:translateY(0);opacity:1}}`

const MONTANTS_PAR_DEFAUT = [10, 20, 50, 100]

const CHAMP =
  'min-h-[52px] w-full min-w-0 rounded-[14px] border-[3px] border-encre bg-white px-4 text-[17px] text-encre transition-shadow duration-150 focus:shadow-[4px_4px_0_var(--color-bleu)] focus:outline-none'

const euros = (n: number) => `${nombreFr(n)} €`

/** Lien interne (Next) ou externe (nouvel onglet) selon l'adresse saisie. */
function LienAuto({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener" className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

export function DonView({ page: initial }: { page: PageDon }) {
  const page = useLiveDoc(initial, { globalSlug: 'page-don' }, 2)
  const { evenement, site } = useSite()
  const { entete, etapes, test, destination, memoire } = page
  const id = useId()

  const cagnotte = evenement.cagnotte
  const p = pourcentage(cagnotte)
  const annee = evenement.edition?.match(/\d{4}/)?.[0]

  // Simulateur d'alerte (rien n'est envoyé).
  const montants = test?.montants?.length ? test.montants.map((m) => m.valeur) : MONTANTS_PAR_DEFAUT
  const [choisi, setChoisi] = useState<number | null>(null)
  const [pseudo, setPseudo] = useState('')
  const [message, setMessage] = useState('')
  const montant = choisi != null && montants.includes(choisi) ? choisi : (montants[1] ?? montants[0])
  const pseudoAffiche = pseudo.trim() || 'Ton pseudo'
  const messageAffiche = message.trim() ? `« ${message.trim()} »` : 'Ton message apparaîtra ici.'

  const items = etapes?.items ?? []
  const garanties = etapes?.garanties ?? []
  const missions = destination?.items ?? []
  const benef = site.beneficiaire

  return (
    <>
      <style href="kk-don" precedence="default">
        {STYLE}
      </style>

      {/* En-tête + cagnotte */}
      <section aria-labelledby="don-titre" className="relative overflow-hidden border-b-[3px] border-encre bg-bleu">
        <Anneaux />
        <div className="kk-container relative flex flex-wrap items-end justify-between gap-8 pt-[clamp(44px,6vw,72px)] pb-32">
          <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-[18px]">
            <PastilleNoire>{entete.surtitre}</PastilleNoire>
            <h1 id="don-titre" className="kk-h1">
              {fr(entete.titre)}
            </h1>
            {entete.intro && <p className="m-0 max-w-[600px] text-[20px] leading-[1.5] font-extrabold text-white">{fr(entete.intro)}</p>}
          </div>
          <div className="flex min-w-0 flex-[0_1_400px] flex-col gap-2.5 rounded-[20px] border-[3px] border-encre bg-white px-5 py-[18px] shadow-dur-7">
            <div className="flex flex-wrap items-center justify-between gap-x-2.5 gap-y-1">
              <span className="kk-pixel text-[13px] tracking-normal text-bleu-fonce">Cagnotte{annee ? ` ${annee}` : ''}</span>
              {cagnotte?.statut && (
                <span className="inline-flex items-center gap-1.5 text-[13px] font-extrabold">
                  <Pulse couleur="var(--color-rose-bouton)" taille={8} />
                  {cagnotte.statut}
                </span>
              )}
            </div>
            <p className="kk-display m-0 text-[34px] leading-none">
              {euros(cagnotte?.montant ?? 0)}{' '}
              <span className="font-sans text-[16px] font-extrabold text-gris">/ {euros(cagnotte?.objectif ?? 0)}</span>
            </p>
            <div
              role="progressbar"
              aria-label="Progression de la cagnotte"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={p}
              aria-valuetext={`${p} % : ${euros(cagnotte?.montant ?? 0)} sur ${euros(cagnotte?.objectif ?? 0)}`}
              className="h-[22px] overflow-hidden rounded-full border-[3px] border-encre bg-bleu-clair"
            >
              {p > 0 && (
                <div
                  className="h-full border-r-[3px] border-encre bg-bleu transition-[width] duration-700"
                  style={{ width: `${p}%`, backgroundImage: 'repeating-linear-gradient(-45deg, rgb(255 255 255 / .2) 0 8px, transparent 8px 16px)' }}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="kk-container relative -mt-[88px] flex flex-wrap items-start gap-7 pb-[clamp(64px,8vw,96px)]">
        {/* Quête */}
        <div className="flex min-w-0 flex-[999_1_600px] flex-col overflow-hidden rounded-[28px] border-[3px] border-encre bg-white shadow-[9px_9px_0_var(--color-encre)]">
          <section aria-labelledby="quete-titre" className="flex flex-col gap-[22px] border-b-[3px] border-dashed border-brume p-[clamp(24px,3.5vw,40px)]">
            <div className="flex flex-col gap-1.5">
              {etapes?.surtitre && <span className="kk-pixel text-[13px] tracking-normal text-rose-bouton">{etapes.surtitre}</span>}
              <h2 id="quete-titre" className="kk-display m-0 text-[38px] leading-none">
                {fr(etapes?.titre) || 'Comment donner'}
              </h2>
            </div>
            {items.length > 0 && (
              <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-4 p-0">
                {items.map((e, i) => (
                  <li key={e.id ?? i} className="flex flex-col gap-2.5 rounded-[20px] border-[3px] border-encre bg-papier p-[18px]">
                    <span aria-hidden="true" className={`kk-pixel grid size-12 place-items-center rounded-[14px] border-[3px] border-encre text-[18px] font-bold tracking-normal text-white ${i % 2 ? 'bg-rose' : 'bg-bleu'}`}>
                      {i + 1}
                    </span>
                    <h3 className="kk-display m-0 text-[24px] leading-[1.1] font-normal">{fr(e.titre)}</h3>
                    <p className="m-0 text-[16px] leading-[1.5] font-semibold text-texte">{fr(e.texte)}</p>
                  </li>
                ))}
              </ol>
            )}
            <Bouton href={evenement.lienDon} externe variante="don" taille="lg" className="w-full !min-h-[68px] gap-2.5 px-4 text-center !text-[clamp(19px,5vw,22px)] sm:gap-3 sm:px-6">
              <Coeur size={22} className="shrink-0" />
              {etapes?.bouton || 'Donner sur Streamlabs Charity'}
              <Externe size={18} trait={2.8} className="shrink-0" />
              <span className="sr-only"> (nouvel onglet)</span>
            </Bouton>
            {garanties.length > 0 && (
              <ul className="m-0 flex list-none flex-wrap justify-center gap-x-5 gap-y-2 p-0 text-[14px] font-extrabold text-gris">
                {garanties.map((g, i) => (
                  <li key={g.id ?? i} className="inline-flex items-center gap-1.5">
                    {i === 0 ? <Icone nom="cadenas" size={16} trait={2.6} className="shrink-0" /> : <Coche size={16} trait={2.8} className="shrink-0" />}
                    {g.texte}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="test-titre" className="flex flex-col gap-[18px] bg-rose-pale p-[clamp(24px,3.5vw,40px)]">
            <div className="flex flex-col gap-1.5">
              {test?.surtitre && <span className="kk-pixel text-[13px] tracking-normal text-rose-bouton">{test.surtitre}</span>}
              <h2 id="test-titre" className="kk-display m-0 text-[34px] leading-none">
                {fr(test?.titre) || 'Teste ton alerte'}
              </h2>
              {test?.texte && <p className="m-0 text-[16px] font-bold text-gris">{fr(test.texte)}</p>}
            </div>
            <div role="group" aria-label="Montant de test" className="flex flex-wrap gap-2.5">
              {montants.map((v) => {
                const actif = v === montant
                return (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={actif}
                    onClick={() => setChoisi(v)}
                    className={`kk-btn font-display min-h-[52px] min-w-0 flex-1 rounded-[14px] px-2 text-[22px] sm:min-w-[88px] sm:flex-none sm:px-4 font-normal shadow-dur-3 hover:shadow-dur-6 active:shadow-[1px_1px_0_var(--color-encre)] ${actif ? 'bg-rose-bouton text-white' : 'bg-white text-encre'}`}
                  >
                    {euros(v)}
                  </button>
                )
              })}
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor={`${id}-pseudo`} className="text-[16px] font-black">
                  Ton pseudo
                </label>
                <input
                  id={`${id}-pseudo`}
                  type="text"
                  maxLength={24}
                  autoComplete="nickname"
                  placeholder="Ex. Krakeunz"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  className={`${CHAMP} font-extrabold`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor={`${id}-message`} className="text-[16px] font-black">
                  Ton message
                </label>
                <input
                  id={`${id}-message`}
                  type="text"
                  maxLength={100}
                  autoComplete="off"
                  placeholder="Pour Max !"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${CHAMP} font-bold`}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Colonne */}
        <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-6">
          <div className="flex flex-col gap-3.5 rounded-3xl border-[3px] border-encre bg-nuit p-[18px] text-white shadow-[7px_7px_0_var(--color-rose)]">
            <div className="flex items-center justify-between gap-2.5 px-1 pt-0.5">
              <span id={`${id}-apercu`} className="kk-pixel text-[13px] tracking-normal text-ciel">
                Aperçu de ton alerte
              </span>
              <span aria-hidden="true" className="kk-pixel inline-flex items-center gap-1.5 rounded-md bg-rose-bouton px-2 py-1 text-[11px] tracking-normal">
                <Pulse couleur="#fff" taille={7} />
                Live
              </span>
            </div>
            <div role="group" aria-labelledby={`${id}-apercu`} className="relative grid aspect-[16/10] max-h-[320px] place-items-center rounded-2xl border-[3px] border-white bg-bleu p-[18px]">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-[13px]"
                style={{ backgroundImage: 'radial-gradient(circle, transparent 0 7px, rgb(255 255 255 / .14) 7px 10px, transparent 10px)', backgroundSize: '48px 48px' }}
              />
              <span className="absolute right-3 bottom-2.5 block size-16">
                <LogoKraken taille={64} className="size-full object-contain" />
              </span>
              <div
                key={montant}
                className="relative flex w-full max-w-[300px] -rotate-2 flex-col gap-1 rounded-2xl border-[3px] border-encre bg-white px-4 py-3.5 text-encre shadow-dur-5 motion-safe:animate-[kk-slide_.5s_ease-out_both]"
              >
                <span className="kk-pixel text-[13px] font-bold tracking-normal text-rose-bouton">Nouveau don !</span>
                <span className="kk-display text-[26px] leading-[1.05] [overflow-wrap:anywhere]">{pseudoAffiche}</span>
                <span className="kk-display text-[34px] leading-none text-rose-bouton">+{euros(montant)}</span>
                <span className="text-[15px] leading-[1.4] font-bold text-gris [overflow-wrap:anywhere]">{messageAffiche}</span>
              </div>
            </div>
          </div>

          {(missions.length > 0 || benef?.nom) && (
            <section aria-labelledby="destination-titre" className="flex flex-col gap-[18px] rounded-3xl border-[3px] border-encre bg-white p-6 shadow-dur-7">
              {destination?.surtitre && <span className="kk-pixel text-[13px] tracking-normal text-bleu-fonce">{destination.surtitre}</span>}
              <h2 id="destination-titre" className="kk-display m-0 text-[30px] leading-none">
                {destination?.titre || 'Où va ton don'}
              </h2>
              {missions.map((m, i) => (
                <div key={m.id ?? i} className="flex items-start gap-3.5">
                  <span className={`grid size-12 shrink-0 place-items-center rounded-[14px] border-[3px] border-encre text-white ${i % 2 ? 'bg-rose' : 'bg-bleu'}`}>
                    <Icone nom={m.icone} size={24} trait={2.5} />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <h3 className="m-0 text-[17px] leading-[1.3] font-black">{m.titre}</h3>
                    <p className="m-0 text-[16px] leading-[1.45] font-semibold text-texte">{fr(m.texte)}</p>
                  </div>
                </div>
              ))}
              {benef?.nom && (
                <p className="m-0 border-t-2 border-dashed border-brume pt-3.5 text-[15px] font-extrabold text-gris">
                  Bénéficiaire :{' '}
                  {benef.lien ? (
                    <a href={benef.lien} target="_blank" rel="noopener" className="font-black text-bleu-fonce">
                      {benef.nom}
                    </a>
                  ) : (
                    <span className="font-black text-encre">{benef.nom}</span>
                  )}
                </p>
              )}
            </section>
          )}

          {memoire?.texte && (
            <div className="flex flex-col gap-3 rounded-3xl border-[3px] border-encre bg-rose-clair p-6 shadow-dur-7">
              {memoire.surtitre && <span className="kk-pixel text-[13px] tracking-normal text-rose-fonce">{memoire.surtitre}</span>}
              <p className="m-0 text-[17px] leading-[1.5] font-bold">{fr(memoire.texte)}</p>
              {memoire.lien && (
                <LienAuto href={memoire.lien} className="kk-link self-start text-[16px] font-black text-encre underline underline-offset-[3px]">
                  {memoire.lienTexte || 'Lire notre hommage →'}
                </LienAuto>
              )}
            </div>
          )}

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(160px,100%),1fr))] gap-3.5">
            <Bouton href="/boutique" variante="blanc" taille="sm" className="min-h-[54px] px-3.5 text-center text-[16px]">
              Voir la boutique
            </Bouton>
            {site.lienMoelle && (
              <Bouton href={site.lienMoelle} variante="blanc" taille="sm" className="min-h-[54px] px-3.5 text-center text-[16px]">
                Don de moelle osseuse
              </Bouton>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
