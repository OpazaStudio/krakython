'use client'
import type { ArticlePresse, PagePresse } from '@/payload-types'
import { LogoKraken } from '@/components/decor'
import { Externe, Fleche, Icone, Lecture } from '@/components/icones'
import { Img } from '@/components/Img'
import { Bouton, Etiquette } from '@/components/ui'
import { useSite } from '@/lib/contexte'
import { isMedia, mediaUrl } from '@/lib/media'
import { useLiveDoc } from '@/lib/useLiveDoc'
import { fr } from '@/lib/typo'
import { useLiveListe } from './useLiveListe'

type Props = { page: PagePresse; articles: ArticlePresse[] }

// Effet « succès débloqué » : les toasts glissent depuis la droite.
const STYLE = `@keyframes kk-toast{0%{opacity:0;transform:translateX(40px)}100%{opacity:1;transform:translateX(0)}}`

const DATE_COURTE = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

const dateCourte = (a: ArticlePresse) => {
  if (a.dateTexte?.trim()) return a.dateTexte.trim()
  const d = new Date(a.date)
  return Number.isNaN(d.getTime()) ? '' : DATE_COURTE.format(d)
}

const estPdf = (lien?: string | null) => /\.pdf($|[?#])/i.test(lien ?? '')

/** Picto du toast, deviné d'après le support (radio, télé, vidéo, rugby…). */
function PictoMedia({ article }: { article: ArticlePresse }) {
  const s = `${article.sousTitre ?? ''} ${article.media}`.toLowerCase()
  if (article.videos?.length || /vid[ée]o|youtube/.test(s)) return <Lecture size={24} />
  if (/radio|podcast/.test(s)) return <Icone nom="micro" size={24} trait={2.4} />
  if (/t[ée]l[ée]|\btv\b/.test(s)) return <Icone nom="tv" size={24} trait={2.4} />
  if (/rugby/.test(s)) return <Icone nom="ballon" size={24} trait={2.4} />
  return <Icone nom="document" size={24} trait={2.4} />
}

// En-têtes des grandes cartes : les reportages vidéo passent en « nuit ».
const THEMES = {
  bleu: { entete: 'bg-bleu text-white', titre: '[text-shadow:0_3px_0_var(--color-encre)]', pastille: 'bg-encre text-white' },
  rose: { entete: 'bg-rose text-white', titre: '[text-shadow:0_3px_0_var(--color-encre)]', pastille: 'bg-encre text-white' },
  clair: { entete: 'bg-bleu-clair text-encre', titre: '', pastille: 'bg-encre text-white' },
  nuit: { entete: 'bg-nuit text-white', titre: '', pastille: 'bg-rose-bouton text-white' },
} as const
const CYCLE = ['bleu', 'rose', 'clair'] as const

function CarteMedia({ article, theme }: { article: ArticlePresse; theme: keyof typeof THEMES }) {
  const t = THEMES[theme]
  const videos = article.videos ?? []
  return (
    <article className="kk-card flex flex-col overflow-hidden rounded-[26px] border-[3px] border-encre bg-white shadow-dur-8">
      <div className={`flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-encre px-[26px] py-5 ${t.entete}`}>
        <h3 className={`kk-display m-0 text-[34px] leading-none font-normal ${t.titre}`}>{article.media}</h3>
        {article.sousTitre && <span className={`kk-pixel rounded-full px-3 py-1.5 text-[12px] tracking-normal ${t.pastille}`}>{article.sousTitre}</span>}
      </div>
      <div className="flex grow flex-col gap-4 px-[26px] pt-6 pb-7">
        {videos.length > 0 ? (
          <>
            <div className="grid grow grid-cols-[repeat(auto-fit,minmax(min(180px,100%),1fr))] content-start gap-3.5">
              {videos.map((v, j) => (
                <a
                  key={v.id ?? j}
                  href={v.url}
                  target="_blank"
                  rel="noopener"
                  className={`kk-card relative grid aspect-video place-items-center overflow-hidden rounded-2xl border-[3px] border-encre text-white no-underline shadow-dur-4 hover:text-white ${j % 2 ? 'bg-rose' : 'bg-bleu'}`}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{ backgroundImage: 'radial-gradient(circle, transparent 0 6px, rgb(255 255 255 / .15) 6px 8px, transparent 8px)', backgroundSize: '36px 36px' }}
                  />
                  <span className={`relative grid size-14 place-items-center rounded-full border-[3px] ${j % 2 ? 'border-white bg-encre' : 'border-encre bg-rose-bouton'}`}>
                    <Lecture size={22} />
                  </span>
                  <span className="kk-pixel absolute bottom-2 left-2.5 text-[12px] tracking-normal">
                    <span className="sr-only">Vidéo {article.media} : </span>
                    {v.titre}
                  </span>
                </a>
              ))}
            </div>
            {article.extrait && <p className="m-0 text-[17px] leading-[1.5] font-bold text-texte">{fr(article.extrait)}</p>}
          </>
        ) : (
          article.extrait && (
            <blockquote cite={article.lien || undefined} className="m-0 grow text-[19px] leading-[1.55] font-bold text-texte">
              «&nbsp;{fr(article.extrait)}&nbsp;»
            </blockquote>
          )
        )}
        {article.lien && (
          <Bouton
            href={article.lien}
            variante="noir"
            className="self-start !min-h-[50px] !px-5 !text-[16px] !shadow-[4px_4px_0_var(--color-rose)] hover:!shadow-[6px_6px_0_var(--color-rose)] active:!shadow-[1px_1px_0_var(--color-rose)]"
          >
            {article.bouton || (estPdf(article.lien) ? 'Lire le PDF' : 'Lire l’article')}
            <Externe size={16} trait={2.8} />
          </Bouton>
        )}
      </div>
    </article>
  )
}

function LigneFederation({ article }: { article: ArticlePresse }) {
  const contenu = (
    <>
      <span className="kk-pixel flex-[0_0_140px] text-[13px] tracking-normal text-bleu-fonce">
        <time dateTime={article.date}>{dateCourte(article)}</time>
      </span>
      <span className="min-w-0 flex-[1_1_360px] text-[19px] leading-[1.35] font-black">{fr(article.titre)}</span>
      {article.lien && (
        <span className="text-[15px] font-black text-rose-bouton">
          {estPdf(article.lien) ? 'PDF' : 'Lire'} <span aria-hidden="true">↗</span>
          <span className="sr-only"> (nouvel onglet)</span>
        </span>
      )}
    </>
  )
  const cls = 'flex flex-wrap items-center gap-x-6 gap-y-2 px-[26px] py-5 text-encre no-underline'
  if (!article.lien) return <div className={cls}>{contenu}</div>
  return (
    <a href={article.lien} target="_blank" rel="noopener" className={`${cls} bg-white transition-colors hover:bg-bleu-clair hover:text-encre focus-visible:outline-offset-[-5px]`}>
      {contenu}
    </a>
  )
}

type Telechargement = NonNullable<NonNullable<PagePresse['kit']>['telechargements']>[number]

function LienTelechargement({ item }: { item: Telechargement }) {
  const fichier = isMedia(item.fichier) ? item.fichier : null
  const href = (fichier ? mediaUrl(fichier) : null) ?? (item.lien?.trim() || null)
  if (!href) return null
  const extension = /\.([a-z0-9]{2,5})(?:$|[?#])/i.exec(href)?.[1]
  const format = (item.format || extension || '').toUpperCase()
  const distant = !fichier

  let vignette = null
  if (fichier?.mimeType?.startsWith('image/')) {
    const ratio = (fichier.width ?? 1) / (fichier.height ?? 1)
    const h = ratio > 1.6 ? 30 : 40
    const w = ratio > 1.6 ? Math.min(Math.round(h * ratio), 180) : 40
    vignette = (
      <span className="relative block max-w-[28vw] shrink-0" style={{ width: w, height: h }}>
        <Img media={fichier} alt="" fill contain sizes={`${w}px`} />
      </span>
    )
  } else {
    const photo = /zip|photo|image|jpe?g|png/i.test(`${format} ${item.libelle}`)
    vignette = <Icone nom={photo ? 'photo' : 'document'} size={34} trait={2.2} className={`shrink-0 ${photo ? 'text-bleu-fonce' : 'text-rose-bouton'}`} />
  }

  return (
    <li>
      <a
        href={href}
        {...(distant ? {} : { download: fichier?.filename || true })}
        target="_blank"
        rel="noopener"
        className="kk-btn kk-btn--blanc kk-btn--sm w-full !min-h-16 !justify-between !rounded-2xl !bg-papier !px-5"
      >
        <span className="flex min-w-0 items-center gap-3.5">
          {vignette}
          <span className="text-[17px] font-black">{item.libelle}</span>
        </span>
        <span className="kk-pixel shrink-0 text-[12px] font-normal tracking-normal text-gris">
          {format} <span aria-hidden="true">{distant ? '↗' : '↓'}</span>
          <span className="sr-only">{distant ? ' (nouvel onglet)' : ' (téléchargement)'}</span>
        </span>
      </a>
    </li>
  )
}

export function PresseView({ page: initial, articles: articlesInitiaux }: Props) {
  const page = useLiveDoc(initial, { globalSlug: 'page-presse' }, 2)
  const articles = useLiveListe(articlesInitiaux, 'presse', 0)
  const { site } = useSite()
  const { entete, medias: blocMedias, federation: blocFederation, kit } = page

  const medias = articles.filter((a) => a.rubrique !== 'federation')
  const federation = articles.filter((a) => a.rubrique === 'federation')

  // Thème de chaque carte : nuit pour les reportages vidéo, sinon bleu → rose → bleu clair.
  let rang = 0
  const themes = medias.map((a) => (a.videos?.length ? 'nuit' : CYCLE[rang++ % CYCLE.length]))

  const email = kit?.email?.trim() || site.email?.trim()
  const telechargements = (kit?.telechargements ?? []).filter((t) => isMedia(t.fichier) || t.lien?.trim())
  const enBref = kit?.enBref
  const pastilles = enBref?.pastilles ?? []
  const lignes = enBref?.lignes ?? []

  return (
    <>
      <style href="kk-presse" precedence="default">
        {STYLE}
      </style>

      {/* En-tête */}
      <section aria-labelledby="presse-titre" className="relative overflow-hidden border-b-[3px] border-encre bg-nuit text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle, rgb(159 208 245 / .18) 0 2px, transparent 2px)', backgroundSize: '28px 28px' }}
        />
        <div className="kk-container relative flex flex-wrap items-center gap-12 py-[clamp(48px,7vw,88px)]">
          <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-[22px]">
            {entete.surtitre && <span className="kk-pill self-start border-[3px] border-white bg-rose-bouton text-white">{entete.surtitre}</span>}
            <h1 id="presse-titre" className="kk-display m-0 text-[clamp(52px,7vw,100px)] leading-[.95] [text-shadow:0_6px_0_var(--color-encre)]">
              {fr(entete.titre)}
            </h1>
            {entete.intro && <p className="m-0 max-w-[560px] text-[20px] leading-[1.55] font-bold text-bleu-clair">{fr(entete.intro)}</p>}
          </div>
          {medias.length > 0 && (
            <ul aria-label="Succès débloqués" className="m-0 flex min-w-0 flex-[1_1_420px] list-none flex-col gap-3.5 p-0">
              {medias.map((a, i) => (
                <li
                  key={a.id}
                  className={`flex items-center gap-3.5 rounded-full border-[3px] border-encre bg-white py-2 pr-[22px] pl-2 text-encre shadow-rose-6 motion-safe:animate-[kk-toast_.6s_cubic-bezier(.2,.9,.3,1.2)_both] ${i % 2 ? 'ml-[clamp(0px,4vw,48px)]' : ''}`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <span className={`grid size-[52px] shrink-0 place-items-center rounded-full border-[3px] border-encre text-white ${i % 2 ? 'bg-rose' : 'bg-bleu'}`}>
                    <PictoMedia article={a} />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="kk-pixel text-[12px] tracking-normal text-rose-bouton">Succès débloqué</span>
                    <span className="text-[18px] leading-[1.3] font-black">{fr(a.titre)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Médias */}
      {medias.length > 0 && (
        <section aria-labelledby="medias-titre" className="kk-container flex flex-col gap-8 pt-[clamp(64px,8vw,104px)]">
          <div className="flex flex-col gap-3">
            <Etiquette>{blocMedias?.surtitre}</Etiquette>
            <h2 id="medias-titre" className="kk-display m-0 text-[clamp(40px,5vw,64px)] leading-none">
              {fr(blocMedias?.titre) || 'Dans les médias'}
            </h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(460px,100%),1fr))] gap-7">
            {medias.map((a, i) => (
              <CarteMedia key={a.id} article={a} theme={themes[i]} />
            ))}
          </div>
        </section>
      )}

      {/* Côté Fédération */}
      {federation.length > 0 && (
        <section aria-labelledby="federation-titre" className="kk-container flex flex-col gap-7 py-[clamp(64px,8vw,104px)]">
          <div className="flex flex-col gap-3">
            <Etiquette couleur="bleu">{blocFederation?.surtitre}</Etiquette>
            <h2 id="federation-titre" className="kk-display m-0 text-[clamp(36px,4.5vw,56px)] leading-none">
              {fr(blocFederation?.titre) || `Côté ${site.beneficiaire?.nom ?? 'Fédération'}`}
            </h2>
          </div>
          <ul className="m-0 list-none overflow-hidden rounded-3xl border-[3px] border-encre bg-white p-0 shadow-dur-7">
            {federation.map((a, i) => (
              <li key={a.id} className={i < federation.length - 1 ? 'border-b-2 border-dashed border-brume' : ''}>
                <LigneFederation article={a} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Espace presse */}
      <section aria-labelledby="kit-titre" className={`border-t-[3px] border-encre bg-white ${federation.length ? '' : 'mt-[clamp(64px,8vw,104px)]'}`}>
        <div className="kk-container flex flex-wrap items-stretch gap-8 py-[clamp(64px,8vw,104px)]">
          <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-[18px]">
            <Etiquette>{kit?.surtitre}</Etiquette>
            <h2 id="kit-titre" className="kk-display m-0 text-[clamp(40px,5vw,64px)] leading-none">
              {fr(kit?.titre) || 'Espace presse'}
            </h2>
            {kit?.texte && <p className="m-0 text-[19px] leading-[1.55] font-semibold text-texte">{fr(kit.texte)}</p>}
            {telechargements.length > 0 && (
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {telechargements.map((t, i) => (
                  <LienTelechargement key={t.id ?? i} item={t} />
                ))}
              </ul>
            )}
            {email ? (
              <Bouton href={`mailto:${email}`} externe={false} variante="don" className="max-w-full self-start [overflow-wrap:anywhere]">
                Contact presse : {email}
              </Bouton>
            ) : (
              <Bouton href="/nos-partenaires?sujet=presse#nous-contacter" variante="don" className="self-start">
                Contacter l’équipe
                <Fleche size={20} />
              </Bouton>
            )}
          </div>

          {(lignes.length > 0 || pastilles.length > 0) && (
            <div className="flex min-w-0 flex-[1_1_400px] flex-col gap-[18px] rounded-[26px] border-[3px] border-encre bg-bleu p-[clamp(24px,3vw,36px)] text-white shadow-[9px_9px_0_var(--color-encre)]">
              <div className="flex items-center justify-between gap-3">
                <h3 className="kk-display m-0 text-[32px] leading-none font-normal [text-shadow:0_3px_0_var(--color-encre)]">{fr(enBref?.titre) || 'Le Krakython en bref'}</h3>
                <span className="relative block size-16 shrink-0">
                  <LogoKraken taille={64} className="size-full object-contain" />
                </span>
              </div>
              {lignes.length > 0 && (
                <dl className="m-0 grid grid-cols-1 overflow-hidden rounded-[18px] border-[3px] border-encre bg-white text-encre sm:grid-cols-[minmax(0,auto)_minmax(0,1fr)]">
                  {lignes.map((l, i) => {
                    // Sur mobile l'intitulé passe au-dessus de son contenu.
                    const dernier = i === lignes.length - 1
                    const bord = 'border-dashed border-brume'
                    return (
                      <div key={l.id ?? i} className="contents">
                        <dt className={`kk-pixel px-4 pt-3.5 pb-1 text-[12px] tracking-normal text-bleu-fonce sm:pb-3.5 ${dernier ? '' : `${bord} sm:border-b-2`}`}>{l.terme}</dt>
                        <dd className={`m-0 px-4 pt-0 pb-3.5 text-[16px] leading-[1.45] font-extrabold sm:pt-3.5 ${dernier ? '' : `${bord} border-b-2`}`}>{fr(l.definition)}</dd>
                      </div>
                    )
                  })}
                </dl>
              )}
              {pastilles.length > 0 && (
                <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
                  {pastilles.map((p, i) => (
                    <li
                      key={p.id ?? i}
                      className={`rounded-full px-3.5 py-2 text-[15px] leading-tight font-black ${i === pastilles.length - 1 && pastilles.length > 1 ? 'border-2 border-encre bg-rose-bouton' : 'bg-encre'}`}
                    >
                      {p.texte}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
