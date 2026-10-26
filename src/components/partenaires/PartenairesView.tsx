'use client'
import type { PagePartenaires, Partenaire } from '@/payload-types'
import { Anneaux, LogoKraken } from '@/components/decor'
import { Coche, Externe, Icone } from '@/components/icones'
import { Img } from '@/components/Img'
import { Bouton, Etiquette, PastilleNoire } from '@/components/ui'
import { useSite } from '@/lib/contexte'
import { isMedia } from '@/lib/media'
import { useLiveDoc } from '@/lib/useLiveDoc'
import { fr } from '@/lib/typo'
import { useLiveListe } from '@/components/presse/useLiveListe'
import { FormContact } from './FormContact'

type Props = { page: PagePartenaires; partenaires: Partenaire[]; total: string | null }

// Curseur qui clignote derrière « Player 2 has joined ».
const STYLE = `@keyframes kk-blink{0%,49%{opacity:1}50%,100%{opacity:0}}`

function CartePartenaire({ partenaire: p, index, badgeBleu }: { partenaire: Partenaire; index: number; badgeBleu: boolean }) {
  const liens = (p.liens ?? []).filter((l) => l.url)
  return (
    <article className="kk-card flex flex-col overflow-hidden rounded-[26px] border-[3px] border-encre bg-white shadow-dur-8">
      <div className="relative grid h-[170px] place-items-center border-b-[3px] border-encre bg-white p-5">
        {isMedia(p.logo) ? (
          <span className="relative block h-[92px] w-[82%]">
            <Img media={p.logo} fill contain sizes="300px" alt={p.logo.alt || `Logo ${p.nom}`} style={{ objectPosition: 'center' }} />
          </span>
        ) : (
          <span className="kk-display text-center text-[30px] leading-[1.05]">{p.nom}</span>
        )}
        {p.badge && (
          <span
            className={`kk-pixel absolute top-3.5 right-3.5 rounded-full border-2 border-encre px-2.5 py-[5px] text-[11px] tracking-normal text-white ${badgeBleu ? 'bg-bleu' : 'bg-rose'}`}
          >
            {p.badge}
          </span>
        )}
      </div>
      <div className="flex grow flex-col gap-3 px-6 pt-[22px] pb-[26px]">
        {p.etiquette && (
          <span className={`self-start rounded-full border-2 border-encre px-2.5 py-1 text-[13px] leading-tight font-black ${index % 2 ? 'bg-rose-clair' : 'bg-bleu-clair'}`}>
            {p.etiquette}
          </span>
        )}
        <h3 className="kk-display m-0 text-[30px] leading-[1.05] font-normal">{p.nom}</h3>
        <p className="m-0 grow text-[17px] leading-[1.55] font-semibold text-texte">{fr(p.texte)}</p>
        {liens.length > 0 && (
          <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0">
            {liens.map((l, i) => (
              <li key={l.id ?? i}>
                <a href={l.url} target="_blank" rel="noopener" className="kk-link text-[16px] font-black text-bleu-fonce underline underline-offset-[3px]">
                  {l.texte} <span aria-hidden="true">↗</span>
                  <span className="sr-only"> ({p.nom}, nouvel onglet)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

export function PartenairesView({ page: initial, partenaires: partenairesInitiaux, total }: Props) {
  const page = useLiveDoc(initial, { globalSlug: 'page-partenaires' }, 2)
  const partenaires = useLiveListe(partenairesInitiaux, 'partenaires', 1)
  const { site } = useSite()
  const { entete, merci, beneficiaire: blocBenef, devenir, formulaire } = page
  const benef = site.beneficiaire
  const missions = blocBenef?.missions ?? []
  const scores = blocBenef?.scores
  const lignesScores = scores?.lignes ?? []
  const modes = devenir?.modes ?? []
  const retours = devenir?.retours ?? []

  // Les pastilles des logos alternent bleu / rose.
  let badges = 0
  const badgeBleu = partenaires.map((p) => (p.badge ? badges++ % 2 === 0 : true))

  return (
    <>
      <style href="kk-partenaires" precedence="default">
        {STYLE}
      </style>

      {/* En-tête */}
      <section aria-labelledby="partenaires-titre" className="relative overflow-hidden border-b-[3px] border-encre bg-bleu">
        <Anneaux />
        <div className="kk-container relative flex flex-wrap items-center gap-12 py-[clamp(48px,7vw,88px)]">
          <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-[22px]">
            <PastilleNoire>{entete.surtitre}</PastilleNoire>
            <h1 id="partenaires-titre" className="kk-display m-0 text-[clamp(52px,7vw,100px)] leading-[.95] text-white [text-shadow:0_6px_0_var(--color-encre)]">
              {fr(entete.titre)}
            </h1>
            {entete.intro && <p className="m-0 max-w-[580px] text-[20px] leading-[1.5] font-extrabold text-white">{fr(entete.intro)}</p>}
            <Bouton href="#devenir" variante="don" taille="lg" className="self-start !min-h-[58px] !px-[26px] !text-[19px]">
              {entete.bouton || 'Devenir partenaire'}
            </Bouton>
          </div>
          <div className="flex min-w-0 flex-[1_1_360px] justify-center">
            <div className="relative aspect-square w-[min(100%,380px)]">
              <div className="absolute inset-0 rounded-full border-[3px] border-encre bg-white shadow-dur-12" />
              <div className="absolute top-[10%] left-[12%] h-[76%] w-[76%] animate-bob">
                <LogoKraken taille={300} className="size-full object-contain" />
              </div>
              {entete.bulle && (
                <span className="kk-pixel absolute bottom-[30px] -left-2 -rotate-6 rounded-xl bg-encre px-4 py-3 text-[15px] tracking-normal text-white shadow-[5px_5px_0_var(--color-rose)] sm:-left-6">
                  {entete.bulle}
                  <span aria-hidden="true" className="motion-safe:animate-[kk-blink_1.1s_steps(1)_infinite]">
                    _
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Partenaires */}
      <section aria-labelledby="merci-titre" className="kk-container flex flex-col gap-9 py-[clamp(64px,8vw,104px)]">
        <div className="flex max-w-[720px] flex-col gap-3">
          <Etiquette couleur="bleu">{merci?.surtitre}</Etiquette>
          <h2 id="merci-titre" className="kk-display m-0 text-[clamp(40px,5vw,64px)] leading-none">
            {fr(merci?.titre) || 'Merci à eux'}
          </h2>
        </div>
        {partenaires.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-7">
            {partenaires.map((p, i) => (
              <CartePartenaire key={p.id} partenaire={p} index={i} badgeBleu={badgeBleu[i]} />
            ))}
          </div>
        )}
        <a
          href="#devenir"
          className="kk-card flex flex-wrap items-center justify-between gap-4 rounded-3xl border-[3px] border-encre bg-encre px-7 py-[22px] text-white no-underline shadow-[7px_7px_0_var(--color-rose)] hover:text-white"
        >
          <span className="flex items-center gap-4">
            <span aria-hidden="true" className="kk-display grid size-[60px] shrink-0 place-items-center rounded-full border-[3px] border-white bg-rose-bouton text-[36px] leading-none">
              +
            </span>
            <span className="flex flex-col">
              <span className="kk-pixel text-[12px] tracking-normal text-ciel">Slot libre</span>
              <span className="kk-display text-[30px] leading-[1.05]">{fr(merci?.slotTitre || 'Ta structure ici ?')}</span>
            </span>
          </span>
          <span className="text-[18px] font-black">{merci?.slotLien || 'Rejoindre la partie →'}</span>
        </a>
      </section>

      {/* Bénéficiaire */}
      <section aria-labelledby="benef-titre" className="kk-container pb-[clamp(64px,8vw,104px)]">
        <div className="flex flex-wrap overflow-hidden rounded-[30px] border-[3px] border-encre bg-white shadow-dur-10">
          <div className="flex min-w-0 flex-[2_1_560px] flex-col gap-[18px] p-[clamp(28px,4vw,48px)]">
            {blocBenef?.surtitre && (
              <span className="kk-pixel self-start rounded-full border-2 border-encre bg-rose-clair px-3 py-1.5 text-[12px] tracking-normal text-rose-fonce">{blocBenef.surtitre}</span>
            )}
            {isMedia(benef?.logo) && (
              <span className="relative block h-[76px] w-[min(100%,272px)]">
                <Img media={benef.logo} fill contain sizes="272px" alt={benef.logo.alt || benef.nom} />
              </span>
            )}
            <h2 id="benef-titre" className="kk-display m-0 text-[clamp(40px,5vw,60px)] leading-none">
              {fr(blocBenef?.titre) || `Au profit de la ${benef?.nom ?? 'Fédération Leucémie Espoir'}`}
            </h2>
            {blocBenef?.texte && <p className="m-0 text-[19px] leading-[1.6] font-semibold text-texte">{fr(blocBenef.texte)}</p>}
            {missions.length > 0 && (
              <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-3 p-0">
                {missions.map((m, i) => (
                  <li key={m.id ?? i} className="flex items-start gap-3 text-[17px] leading-[1.4] font-extrabold">
                    <span className="grid size-[30px] shrink-0 place-items-center rounded-full border-2 border-encre bg-bleu text-white">
                      <Coche size={16} trait={3.2} />
                    </span>
                    <span className="pt-[3px]">{m.texte}</span>
                  </li>
                ))}
              </ul>
            )}
            {benef?.lien && (
              <Bouton href={benef.lien} variante="blanc" className="self-start !min-h-[52px] !px-[22px] !text-[17px]">
                {blocBenef?.bouton || 'Découvrir la Fédération'}
                <Externe size={16} trait={2.8} />
              </Bouton>
            )}
          </div>
          {(lignesScores.length > 0 || total) && (
            <div className="-mt-[3px] -ml-[3px] flex min-w-0 flex-[1_1_320px] flex-col justify-center gap-5 border-t-[3px] border-l-[3px] border-encre bg-rose p-[clamp(28px,4vw,44px)] text-white">
              <span className="kk-pixel text-[13px] tracking-normal">{scores?.titre || 'Tableau des scores'}</span>
              {lignesScores.map((l, i) => (
                <div key={l.id ?? i} className="flex flex-col gap-0.5">
                  <span className="kk-display text-[52px] leading-none [text-shadow:0_4px_0_var(--color-encre)]">{l.valeur}</span>
                  <span className="text-[17px] font-black">{l.legende}</span>
                </div>
              ))}
              {total && (
                <div className="flex flex-col gap-0.5 border-t-[3px] border-dashed border-white/60 pt-4">
                  <span className="kk-display text-[52px] leading-none [text-shadow:0_4px_0_var(--color-encre)]">{total}</span>
                  {scores?.totalLegende && <span className="text-[17px] font-black">{scores.totalLegende}</span>}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Devenir partenaire */}
      <section id="devenir" aria-labelledby="devenir-titre" className="scroll-mt-20 border-y-[3px] border-encre bg-white">
        <div className="kk-container flex flex-col gap-10 py-[clamp(64px,8vw,104px)]">
          <div className="flex max-w-[760px] flex-col gap-3">
            <Etiquette>{devenir?.surtitre}</Etiquette>
            <h2 id="devenir-titre" className="kk-display m-0 text-[clamp(40px,5vw,64px)] leading-none">
              {fr(devenir?.titre) || 'Devenir partenaire'}
            </h2>
            {devenir?.texte && <p className="m-0 text-[19px] leading-[1.55] font-semibold text-texte">{fr(devenir.texte)}</p>}
          </div>
          {modes.length > 0 && (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-6">
              {modes.map((m, i) => (
                <article key={m.id ?? i} className="flex flex-col gap-3.5 rounded-3xl border-[3px] border-encre bg-papier p-[26px] shadow-dur-6">
                  <span className={`grid size-16 place-items-center rounded-[18px] border-[3px] border-encre text-white ${i % 2 ? 'bg-rose' : 'bg-bleu'}`}>
                    <Icone nom={m.icone} size={32} trait={2.4} />
                  </span>
                  <h3 className="kk-display m-0 text-[28px] leading-none font-normal">{m.titre}</h3>
                  <p className="m-0 text-[17px] leading-[1.55] font-semibold text-texte">{fr(m.texte)}</p>
                </article>
              ))}
            </div>
          )}
          {retours.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3.5 rounded-[22px] border-[3px] border-encre bg-nuit px-[26px] py-[22px] text-white shadow-rose-6">
              <span className="kk-pixel text-[13px] tracking-normal text-ciel">{devenir?.retourTitre || 'En retour'}</span>
              <ul className="m-0 flex list-none flex-wrap items-center gap-x-7 gap-y-3.5 p-0">
                {retours.map((r, i) => (
                  <li key={r.id ?? i} className="inline-flex items-center gap-2 text-[17px] leading-[1.35] font-extrabold">
                    <Coche size={18} trait={3} className="shrink-0 text-dragee" />
                    {r.texte}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Formulaire */}
      <section id="nous-contacter" className="mx-auto w-full max-w-[980px] scroll-mt-20 px-[clamp(20px,4vw,40px)] py-[clamp(64px,8vw,104px)]">
        <FormContact surtitre={formulaire?.surtitre} titre={formulaire?.titre} delai={formulaire?.delai} />
      </section>
    </>
  )
}
