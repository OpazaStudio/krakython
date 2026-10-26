import type { CSSProperties } from 'react'
import { Anneaux, LogoKraken } from '@/components/decor'
import { Icone } from '@/components/icones'
import { Img } from '@/components/Img'
import { isMedia } from '@/lib/media'
import { annee, dateCourte, FOND_CATEGORIE, formeImage, tailleEtiquette, type ActuResume, type CategorieActu } from './outils'

// Visuels des actualités : la maquette prévoit un médaillon rond pour les portraits,
// un cadre blanc pour les logos et une vignette « J-30 » quand il n’y a pas d’image.

const POINTS: CSSProperties = { backgroundImage: 'radial-gradient(circle, rgb(159 208 245 / .2) 0 2px, transparent 2px)', backgroundSize: '24px 24px' }
const ANNEAUX_60: CSSProperties = { backgroundSize: '60px 60px' }
const CENTRE: CSSProperties = { objectPosition: 'center' }
const PICTO_CATEGORIE: Record<string, string> = { partenaire: 'maison', evenement: 'manette', asso: 'coeur' }

const ratio = (a: ActuResume): CSSProperties => (isMedia(a.image) && a.image.width && a.image.height ? { aspectRatio: `${a.image.width} / ${a.image.height}` } : { aspectRatio: '3 / 1' })

/** Pastille de catégorie + date courte. */
export function MetaActu({ actu, categorie, grand = false }: { actu: ActuResume; categorie?: CategorieActu; grand?: boolean }) {
  return (
    <div className={`flex flex-wrap items-center ${grand ? 'gap-3' : 'gap-2.5'}`}>
      {categorie && <PastilleCategorie categorie={categorie} grand={grand} />}
      <time dateTime={actu.date} className={`kk-pixel tracking-normal text-gris ${grand ? 'text-[13px]' : 'text-[12px]'}`}>
        {dateCourte(actu.date)}
      </time>
    </div>
  )
}

export const PastilleCategorie = ({ categorie, grand = false }: { categorie: CategorieActu; grand?: boolean }) => (
  <span className={`rounded-full border-2 border-encre font-black ${grand ? 'px-3 py-[5px] text-[14px]' : 'px-2.5 py-1 text-[13px]'} ${FOND_CATEGORIE[categorie.value] ?? 'bg-white'}`}>
    {categorie.label}
  </span>
)

/** Vignette sans image : « Krakython 2023 » + l’étiquette en très grand (ou le logo). */
function SansImage({ actu, tailles, className = '' }: { actu: ActuResume; tailles: [string, string, string]; className?: string }) {
  return (
    <div className={`relative flex flex-col items-center justify-center gap-1 overflow-hidden bg-bleu px-4 text-center text-white ${className}`}>
      <Anneaux taille={52} opacite={0.14} />
      {actu.etiquette ? (
        <>
          <span className="kk-pixel relative text-[14px] tracking-normal">Krakython {annee(actu.date)}</span>
          <span className={`kk-display relative leading-none [text-shadow:0_5px_0_var(--color-encre)] ${tailleEtiquette(actu.etiquette, tailles)}`}>{actu.etiquette}</span>
        </>
      ) : (
        <span className="relative block aspect-square w-[34%] animate-bob">
          <LogoKraken taille={180} className="size-full object-contain" />
        </span>
      )}
    </div>
  )
}

/** Logo posé dans un cadre blanc légèrement penché. */
function CadreLogo({ actu, largeur, sizes, className = '' }: { actu: ActuResume; largeur: string; sizes: string; className?: string }) {
  if (!isMedia(actu.image)) return null
  return (
    <div className={`flex items-center justify-center bg-rose-clair p-6 ${className}`}>
      <span className="-rotate-3 rounded-2xl border-[3px] border-encre bg-white px-[22px] py-[18px] shadow-dur-5">
        <span className={`relative block ${largeur}`} style={ratio(actu)}>
          <Img media={actu.image} fill contain sizes={sizes} style={CENTRE} />
        </span>
      </span>
    </div>
  )
}

/** En-tête 16/9 des cartes de la liste. */
export function VisuelCarte({ actu }: { actu: ActuResume }) {
  const cadre = 'relative aspect-video overflow-hidden border-b-[3px] border-encre'
  if (!isMedia(actu.image)) return <SansImage actu={actu} tailles={['text-[80px]', 'text-[60px]', 'text-[44px]']} className={cadre} />
  const forme = formeImage(actu.image)
  if (forme === 'logo') return <CadreLogo actu={actu} largeur="w-[min(250px,60vw)]" sizes="250px" className={cadre} />
  if (forme === 'rond') {
    return (
      <div className={`${cadre} flex items-center justify-center bg-nuit`}>
        <div aria-hidden="true" className="absolute inset-0" style={POINTS} />
        <span className="relative block size-[124px] overflow-hidden rounded-full border-[3px] border-white shadow-[5px_5px_0_var(--color-rose)]">
          <Img media={actu.image} fill sizes="124px" size="miniature" />
        </span>
      </div>
    )
  }
  return (
    <div className={`${cadre} bg-bleu-clair`}>
      <Img media={actu.image} fill sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw" size="carte" />
    </div>
  )
}

/** Moitié visuelle de la carte « À la une ». */
export function VisuelUne({ actu }: { actu: ActuResume }) {
  const media = isMedia(actu.image) ? actu.image : null
  const forme = media ? formeImage(media) : null
  return (
    <div className="relative grid min-h-[300px] place-items-center overflow-hidden border-b-[3px] border-encre bg-bleu sm:min-h-[340px] lg:border-r-[3px] lg:border-b-0">
      {media && forme === 'photo' ? (
        <Img media={media} fill priority sizes="(min-width: 1024px) 620px, 100vw" size="large" />
      ) : (
        <>
          <div aria-hidden="true" className="kk-rings" style={ANNEAUX_60} />
          <div className="relative grid aspect-square w-[min(230px,58vw)] place-items-center overflow-hidden rounded-full border-[3px] border-encre bg-white shadow-dur-8">
            {media && forme === 'rond' && <Img media={media} fill priority sizes="230px" size="carte" />}
            {media && forme === 'logo' && (
              <span className="relative block h-1/2 w-[78%]">
                <Img media={media} fill contain priority sizes="180px" style={CENTRE} />
              </span>
            )}
            {!media && (
              <span className="relative block size-[76%]">
                <LogoKraken taille={180} priority className="size-full object-contain" />
              </span>
            )}
          </div>
        </>
      )}
      <span className="kk-display absolute top-[22px] left-[22px] -rotate-6 rounded-xl border-[3px] border-encre bg-rose-bouton px-3.5 py-2 text-[22px] leading-[1.2] text-white shadow-dur-4">
        À la une
      </span>
      {actu.etiquette && (
        <span className="kk-pixel absolute right-[22px] bottom-[22px] rotate-[5deg] rounded-[10px] bg-encre px-3 py-2 text-[13px] tracking-normal text-ciel">{actu.etiquette}</span>
      )}
    </div>
  )
}

/** Grande image en tête d’article. */
export function VisuelArticle({ actu }: { actu: ActuResume }) {
  const media = isMedia(actu.image) ? actu.image : null
  const cadre = 'relative overflow-hidden rounded-[28px] border-[3px] border-encre shadow-dur-10'
  if (!media) return <SansImage actu={actu} tailles={['text-[clamp(72px,14vw,150px)]', 'text-[clamp(56px,10vw,110px)]', 'text-[clamp(40px,7vw,80px)]']} className={`${cadre} aspect-[21/9] min-h-[220px]`} />
  const forme = formeImage(media)
  if (forme === 'logo') return <CadreLogo actu={actu} largeur="w-[min(420px,60vw)]" sizes="420px" className={`${cadre} aspect-[21/9] min-h-[220px]`} />
  if (forme === 'rond') {
    return (
      <div className={`${cadre} grid aspect-video place-items-center bg-nuit`} style={{ ...POINTS, backgroundSize: '28px 28px' }}>
        <span className="relative block aspect-square h-[80%] overflow-hidden rounded-full border-4 border-white shadow-[10px_10px_0_var(--color-rose)]">
          <Img media={media} fill priority sizes="(min-width: 1040px) 460px, 70vw" size="large" />
        </span>
      </div>
    )
  }
  return (
    <div className={`${cadre} aspect-video bg-bleu-clair`}>
      <Img media={media} fill priority sizes="(min-width: 1040px) 1000px, 100vw" size="large" />
    </div>
  )
}

/** Vignette carrée des cartes « À lire aussi ». */
export function VignetteActu({ actu }: { actu: ActuResume }) {
  const media = isMedia(actu.image) ? actu.image : null
  const cadre = 'relative size-[110px] shrink-0 overflow-hidden rounded-2xl border-[3px] border-encre'
  if (!media) {
    return (
      <span className={`${cadre} grid place-items-center bg-bleu px-1.5 text-center text-white`}>
        {actu.etiquette ? (
          <span className={`kk-display leading-none [text-shadow:0_3px_0_var(--color-encre)] ${tailleEtiquette(actu.etiquette, ['text-[34px]', 'text-[24px]', 'text-[18px]'])}`}>{actu.etiquette}</span>
        ) : (
          <span className="relative block size-[70%]">
            <LogoKraken taille={80} className="size-full object-contain" />
          </span>
        )}
      </span>
    )
  }
  if (formeImage(media) === 'logo') {
    // Un logo serait illisible à cette taille : picto de la catégorie, comme sur la maquette.
    return (
      <span className={`${cadre} grid place-items-center bg-rose-clair text-encre`}>
        <Icone nom={PICTO_CATEGORIE[actu.categorie] ?? 'maison'} size={48} trait={1.8} />
      </span>
    )
  }
  return (
    <span className={`${cadre} bg-bleu-clair`}>
      <Img media={media} fill sizes="110px" size="miniature" />
    </span>
  )
}
