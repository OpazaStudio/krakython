'use client'
import Link from 'next/link'
import type { Edition, Membre, QuiSommesNous } from '@/payload-types'
import { Anneaux, LogoKraken, Tentacule } from '@/components/decor'
import { Fleche, Lecture } from '@/components/icones'
import { CarteMembre } from '@/components/qui-sommes-nous/CarteMembre'
import { EtapeProchaine, EtapeQuete } from '@/components/qui-sommes-nous/JournalQuete'
import { RichText } from '@/components/RichText'
import { Bouton, Etiquette, PastilleNoire } from '@/components/ui'
import { useSite } from '@/lib/contexte'
import { libelleTotal, totalEditions } from '@/lib/editions'
import { useLiveDoc } from '@/lib/useLiveDoc'

type Props = { page: QuiSommesNous; membres: Membre[]; editions: Edition[] }

const CONTACT = '/nos-partenaires#nous-contacter'
const ANNEAUX_60 = { backgroundSize: '60px 60px' }

/** Étiquette pixel + titre de section (taille de la maquette « Qui sommes-nous »). */
function EnteteSection({
  id,
  surtitre,
  titre,
  texte,
  couleur = 'rose',
  className = '',
}: {
  id: string
  surtitre?: string | null
  titre?: string | null
  texte?: string | null
  couleur?: 'rose' | 'bleu'
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-3.5 ${className}`}>
      <Etiquette couleur={couleur}>{surtitre}</Etiquette>
      {titre && (
        <h2 id={id} className="kk-display m-0 text-[clamp(42px,5vw,68px)] leading-none">
          {titre}
        </h2>
      )}
      {texte && <p className="kk-lead max-w-[640px]">{texte}</p>}
    </div>
  )
}

/** Opérateur de l’équation « Kraky + Marathon = Krakython ». */
const Operateur = ({ signe, lu }: { signe: string; lu: string }) => (
  <span className="kk-display text-[64px] leading-none">
    <span aria-hidden="true">{signe}</span>
    <span className="sr-only">{lu}</span>
  </span>
)

export function QuiSommesNousView({ page: initial, membres, editions }: Props) {
  const page = useLiveDoc(initial, { globalSlug: 'qui-sommes-nous' }, 1)
  const { evenement, site } = useSite()
  const twitch = site.reseaux?.twitch || 'https://www.twitch.tv/krakython'
  const { entete, nom, quete, equipe, rejoindre } = page
  const citation = entete.citation
  const video = quete?.video

  return (
    <>
      {/* En-tête */}
      <section aria-labelledby="qsn-titre" className="relative overflow-hidden border-b-[3px] border-encre bg-bleu">
        <Anneaux />
        <Tentacule couleur="rose" className="-right-[50px] -bottom-[70px] h-[364px] w-[260px] origin-bottom" />
        <div className="kk-container relative flex flex-wrap items-center gap-12 pt-[clamp(48px,7vw,88px)] pb-[clamp(64px,8vw,104px)]">
          <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-[22px]">
            <PastilleNoire>{entete.surtitre}</PastilleNoire>
            <h1 id="qsn-titre" className="kk-h1">
              {entete.titre}
            </h1>
            {entete.intro && <p className="m-0 max-w-[600px] text-[20px] leading-[1.5] font-extrabold text-white">{entete.intro}</p>}
          </div>
          {citation?.texte && (
            <figure className="relative m-0 flex min-w-0 flex-[1_1_380px] rotate-2 flex-col gap-4 rounded-[26px] border-[3px] border-encre bg-white px-[30px] pt-[34px] pb-[26px] shadow-dur-10">
              <span aria-hidden="true" className="kk-display absolute -top-[34px] left-[22px] text-[110px] leading-none text-rose [text-shadow:3px_3px_0_var(--color-encre)]">
                “
              </span>
              <blockquote className="m-0 text-[24px] leading-[1.4] font-extrabold">{citation.texte}</blockquote>
              {citation.auteur && (
                <figcaption className="kk-pixel flex items-center gap-2.5 text-[13px] tracking-normal text-bleu-fonce">
                  <LogoKraken taille={34} className="size-[34px] object-contain" />
                  {citation.auteur}
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </section>

      {/* Pourquoi « Krakython » ? */}
      <section aria-labelledby="nom-titre" className="kk-container flex flex-col gap-10 pt-[clamp(64px,8vw,112px)] pb-[clamp(48px,6vw,80px)]">
        <EnteteSection id="nom-titre" surtitre={nom?.surtitre} titre={nom?.titre} className="max-w-[760px]" />
        {(nom?.mot1 || nom?.mot2) && (
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-[18px]">
            <div className="flex max-w-[340px] min-w-0 flex-[1_1_260px] -rotate-2 max-sm:basis-full flex-col gap-1.5 rounded-3xl border-[3px] border-encre bg-white px-6 py-[26px] text-center shadow-dur-7">
              <span className="kk-display text-[52px] leading-none text-bleu-fonce">{nom.mot1}</span>
              {nom.mot1Texte && <span className="text-[17px] font-extrabold text-gris">{nom.mot1Texte}</span>}
            </div>
            <Operateur signe="+" lu="plus" />
            <div className="flex max-w-[340px] min-w-0 flex-[1_1_260px] rotate-[1.5deg] max-sm:basis-full flex-col gap-1.5 rounded-3xl border-[3px] border-encre bg-rose px-6 py-[26px] text-center text-white shadow-dur-7">
              <span className="kk-display text-[52px] leading-none [text-shadow:0_3px_0_var(--color-encre)]">{nom.mot2}</span>
              {nom.mot2Texte && <span className="text-[18px] font-black">{nom.mot2Texte}</span>}
            </div>
            <Operateur signe="=" lu="égale" />
            <div className="flex max-w-[380px] min-w-0 flex-[1_1_300px] -rotate-1 max-sm:basis-full items-center justify-center gap-3.5 rounded-3xl border-[3px] border-encre bg-bleu px-6 py-[18px] text-white shadow-dur-7">
              <span className="relative block size-[clamp(64px,18vw,84px)] shrink-0 animate-bob">
                <LogoKraken taille={84} className="size-full object-contain" />
              </span>
              <span className="kk-display text-[clamp(36px,10vw,46px)] leading-none [text-shadow:0_3px_0_var(--color-encre)]">Krakython</span>
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-start gap-7">
          <RichText data={nom?.texte} className="min-w-0 flex-[2_1_520px] text-[19px] leading-[1.65] font-semibold text-texte [&_a]:font-black" />
          <div className="grid min-w-0 flex-[1_1_320px] grid-cols-[repeat(auto-fit,minmax(min(140px,100%),1fr))] gap-4">
            {(nom?.chiffres ?? []).map((c) => (
              <div key={c.id} className="flex flex-col gap-0.5 rounded-[20px] border-[3px] border-encre bg-white p-[18px] shadow-dur-5">
                <span className="kk-display text-[40px] leading-none">{c.valeur}</span>
                <span className="text-[15px] font-extrabold text-gris">{c.legende}</span>
              </div>
            ))}
            {editions.length > 0 && (
              <div className="col-span-full flex flex-col gap-0.5 rounded-[20px] border-[3px] border-encre bg-rose-clair p-[18px] shadow-dur-5">
                <span className="kk-display text-[40px] leading-none">{libelleTotal(totalEditions(editions))}</span>
                {nom?.totalLegende && <span className="text-[15px] font-extrabold text-gris">{nom.totalLegende}</span>}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Journal de quête */}
      <section aria-labelledby="quete-titre" className="border-y-[3px] border-encre bg-white">
        <div className="mx-auto flex max-w-[1040px] flex-col gap-10 px-[clamp(20px,4vw,40px)] py-[clamp(64px,8vw,112px)]">
          <EnteteSection id="quete-titre" surtitre={quete?.surtitre} titre={quete?.titre} texte={quete?.texte} couleur="bleu" />
          <ol className="m-0 flex list-none flex-col p-0">
            {editions.map((e, i) => (
              <EtapeQuete key={e.id} edition={e} niveau={i + 1} />
            ))}
            <EtapeProchaine
              libelle={evenement.dates?.libelle}
              titre={quete?.prochainTitre || 'La quête continue'}
              bouton={quete?.prochainBouton || 'Activer le rappel Twitch'}
              twitch={twitch}
            />
          </ol>

          {video?.url && (
            <a
              href={video.url}
              target="_blank"
              rel="noopener"
              className="kk-card grid overflow-hidden rounded-[26px] border-[3px] border-encre bg-nuit text-white no-underline shadow-rose-8 hover:text-white md:grid-cols-2"
            >
              <div className="relative grid aspect-video place-items-center border-b-[3px] border-encre bg-bleu md:border-r-[3px] md:border-b-0">
                <Anneaux taille={52} opacite={0.14} />
                <span className="relative grid size-[84px] place-items-center rounded-full border-[3px] border-encre bg-rose-bouton text-white shadow-dur-5">
                  <Lecture size={34} />
                </span>
                <span className="kk-pixel absolute bottom-3 left-3 text-[12px] tracking-normal">YouTube</span>
              </div>
              <div className="flex min-w-0 flex-col justify-center gap-2.5 px-7 py-[26px]">
                {video.surtitre && <span className="kk-pixel text-[12px] tracking-normal text-ciel">{video.surtitre}</span>}
                {video.titre && <span className="kk-display text-[30px] leading-[1.1]">{video.titre}</span>}
                {video.texte && <span className="text-[17px] font-bold text-bleu-clair">{video.texte}</span>}
                <span className="sr-only">(vidéo YouTube, nouvel onglet)</span>
              </div>
            </a>
          )}
        </div>
      </section>

      {/* L’équipe */}
      <section aria-labelledby="equipe-titre" className="kk-container kk-section flex flex-col gap-10">
        <EnteteSection id="equipe-titre" surtitre={equipe?.surtitre} titre={equipe?.titre} texte={equipe?.texte} className="max-w-[700px]" />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(270px,100%),1fr))] gap-6">
          {membres.map((m, i) => (
            <CarteMembre key={m.id} membre={m} numero={i + 1} />
          ))}
          <Link
            href={CONTACT}
            className="kk-card flex min-h-[260px] flex-col items-center justify-center gap-2.5 rounded-3xl border-[3px] border-dashed border-encre bg-papier p-[22px] text-center text-encre no-underline hover:text-encre"
          >
            <span className="kk-pixel text-[12px] tracking-normal text-rose-bouton">Press start</span>
            <span aria-hidden="true" className="kk-display grid size-[84px] place-items-center rounded-full border-[3px] border-dashed border-encre bg-white text-[48px] leading-none">
              +
            </span>
            <span className="kk-display text-[28px] leading-none">{equipe?.recrueTitre || 'Et toi ?'}</span>
            {equipe?.recrueTexte && <span className="text-[15px] font-extrabold text-gris">{equipe.recrueTexte}</span>}
          </Link>
        </div>
      </section>

      {/* Rejoindre la team */}
      {rejoindre?.titre && (
        <section aria-labelledby="rejoindre-titre" className="kk-container pb-[clamp(64px,8vw,112px)]">
          <div className="relative flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[28px] border-[3px] border-encre bg-rose p-[clamp(28px,4vw,48px)] text-white shadow-[9px_9px_0_var(--color-encre)]">
            <div aria-hidden="true" className="kk-rings" style={ANNEAUX_60} />
            <div className="relative flex min-w-0 flex-[1_1_520px] flex-col gap-2.5">
              <h2 id="rejoindre-titre" className="kk-display m-0 text-[clamp(36px,4vw,54px)] leading-none [text-shadow:0_4px_0_var(--color-encre)]">
                {rejoindre.titre}
              </h2>
              {rejoindre.texte && <p className="m-0 text-[20px] leading-[1.5] font-extrabold">{rejoindre.texte}</p>}
            </div>
            <Bouton href={CONTACT} taille="lg" className="relative min-h-[58px] px-[26px] text-[19px]">
              {rejoindre.bouton || 'Nous écrire'}
              <Fleche size={20} />
            </Bouton>
          </div>
        </section>
      )}
    </>
  )
}
