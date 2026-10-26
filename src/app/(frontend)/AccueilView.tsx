'use client'
import Link from 'next/link'
import type { Accueil, Partenaire, Produit } from '@/payload-types'
import { BarreXp, nombreFr, prochainPalier } from '@/components/Cagnotte'
import { CompteRebours } from '@/components/CompteRebours'
import { Anneaux, LogoKraken, Pulse, Tentacule } from '@/components/decor'
import { Defile } from '@/components/Defile'
import { CarteProduit } from '@/components/boutique/CarteProduit'
import { Coche, Coeur, Fleche, Icone, Lecture } from '@/components/icones'
import { Img } from '@/components/Img'
import { RichText } from '@/components/RichText'
import { Bouton, Etiquette, PastilleNoire, TitreSection } from '@/components/ui'
import { useLienDon, useResoudreLien, useSite } from '@/lib/contexte'
import { isMedia } from '@/lib/media'
import { useLiveDoc } from '@/lib/useLiveDoc'

type Props = { accueil: Accueil; produits: Produit[]; partenaires: Partenaire[] }

const FOND_CHIFFRE: Record<string, string> = {
  bleu: 'bg-bleu text-white',
  rose: 'bg-rose text-white',
  blanc: 'bg-white text-encre',
}

export function AccueilView({ accueil: initial, produits, partenaires }: Props) {
  const accueil = useLiveDoc(initial, { globalSlug: 'accueil' }, 2)
  const { evenement, site } = useSite()
  const don = useLienDon()
  const resoudre = useResoudreLien()
  const twitch = site.reseaux?.twitch || 'https://www.twitch.tv/krakython'
  const { hero, cagnotte, max, programme, classes, boutique, live, partenaires: blocPartenaires } = accueil
  const palier = prochainPalier(evenement.cagnotte)
  const beneficiaire = site.beneficiaire

  return (
    <>
      {/* Bandeau */}
      <section id="evenement" className="relative overflow-hidden border-b-[3px] border-encre bg-bleu">
        <Anneaux />
        <Tentacule couleur="bleu" className="-bottom-10 -left-[70px] hidden h-[420px] w-[300px] origin-bottom md:block" />
        <Tentacule couleur="rose" className="-top-[90px] -right-[60px] hidden h-[364px] w-[260px] md:block" style={{ transform: 'scaleY(-1)' }} />

        <div className="kk-container relative flex flex-wrap items-center gap-14 pt-[clamp(36px,7vw,88px)] pb-[clamp(80px,9vw,120px)]">
          <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-7">
            <div className="flex flex-wrap gap-2.5">
              {hero.pastille1 && <span className="kk-pill kk-pill--noir">{hero.pastille1}</span>}
              {hero.pastille2 && <span className="kk-pill kk-pill--blanc">{hero.pastille2}</span>}
            </div>
            <h1 className="kk-display m-0 text-[clamp(48px,7vw,104px)] leading-[0.98] tracking-[.005em] text-white [text-shadow:0_6px_0_var(--color-encre)]">
              {hero.titre}{' '}
              {hero.titreSurligne && (
                <span className="rounded-[18px] border-[3px] border-encre bg-rose px-[.16em] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">{hero.titreSurligne}</span>
              )}
            </h1>
            {hero.texte && <p className="m-0 max-w-[560px] text-[clamp(18px,1.6vw,21px)] leading-[1.5] font-extrabold text-white">{hero.texte}</p>}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Bouton href={don.href} externe={don.externe} variante="don" taille="lg">
                <Coeur size={22} />
                {hero.boutonDon || 'Faire un don'}
              </Bouton>
              <Bouton href={twitch} variante="blanc" taille="lg">
                <Lecture size={20} />
                {hero.boutonLive || 'Regarder le live'}
              </Bouton>
            </div>
            {!!hero.garanties?.length && (
              <div className="flex flex-wrap gap-2.5">
                {hero.garanties.map((g) => (
                  <span key={g.id} className="inline-flex items-center gap-2 rounded-xl border-[3px] border-encre bg-white px-3.5 py-2 text-[15px] font-extrabold">
                    <Coche size={18} className="text-bleu-fonce" />
                    {g.texte}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-[1_1_420px] flex-col items-center">
            <div className="relative aspect-square w-[min(100%,460px)]">
              <div className="absolute inset-0 rounded-full border-[3px] border-encre bg-white shadow-dur-12" />
              <div aria-hidden="true" className="absolute inset-[22px] rounded-full border-[3px] border-dashed border-ciel" />
              <div className="absolute top-[9%] left-[11%] h-[78%] w-[78%] animate-bob">
                <LogoKraken priority taille={460} alt="Logo du Krakython : un cœur-kraken bleu tenant une manette rose" className="size-full object-contain" />
              </div>
              <span className="kk-display absolute top-[34px] -left-1.5 inline-flex -rotate-[10deg] items-center gap-2 rounded-[14px] border-[3px] border-encre bg-rose-bouton px-4 py-2.5 text-[24px] tracking-[.04em] text-white shadow-dur-4">
                <Pulse couleur="#fff" taille={12} />
                LIVE
              </span>
              <span className="kk-pixel absolute top-[46%] -right-2.5 rotate-[8deg] rounded-xl bg-encre px-3.5 py-2.5 text-[15px] text-ciel shadow-[4px_4px_0_var(--color-rose)]">
                P1 · READY
              </span>
            </div>
            <div className="relative z-[2] -mt-[34px] flex w-[min(100%,470px)] flex-col gap-3.5 rounded-[22px] border-[3px] border-encre bg-encre px-[22px] pt-5 pb-[22px] text-white shadow-rose-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="kk-pixel text-[13px] text-ciel">{hero.compteRebours || 'Prochain live dans'}</span>
                <span className="text-[15px] font-extrabold text-dragee">{evenement.dates?.libelle}</span>
              </div>
              <CompteRebours debut={evenement.dates?.debut} />
            </div>
          </div>
        </div>
      </section>

      <Defile mots={(accueil.defile ?? []).map((d) => d.texte)} />

      {/* Cagnotte */}
      <section aria-labelledby="cagnotte-titre" className="kk-container flex flex-wrap gap-7 pt-[clamp(72px,9vw,120px)] pb-[clamp(56px,7vw,96px)]">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-[22px] rounded-[28px] border-[3px] border-encre bg-white p-[clamp(24px,4vw,44px)] shadow-dur-8">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <Etiquette couleur="bleu">Cagnotte {evenement.edition} · Barre d’XP</Etiquette>
            {evenement.cagnotte?.statut && (
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-encre bg-rose-clair px-3 py-1.5 text-[14px] font-extrabold">
                <Pulse couleur="var(--color-rose-bouton)" taille={9} />
                {evenement.cagnotte.statut}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
            <h2 id="cagnotte-titre" className="kk-display m-0 text-[clamp(48px,6vw,80px)] leading-none">
              {nombreFr(evenement.cagnotte?.montant)} €
            </h2>
            <span className="text-[19px] font-extrabold text-gris">sur un objectif de {nombreFr(evenement.cagnotte?.objectif)} €</span>
          </div>
          <BarreXp cagnotte={evenement.cagnotte} />
          {cagnotte?.texte && <p className="m-0 max-w-[620px] text-[18px] leading-[1.55] font-semibold">{cagnotte.texte}</p>}
          <div className="flex flex-wrap gap-3.5">
            <Bouton href={don.href} externe={don.externe} variante="don">
              {cagnotte?.bouton || 'Je fais monter la barre'}
            </Bouton>
          </div>
        </div>

        <div className="grid min-w-0 flex-[1_1_300px] grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-5">
          {(cagnotte?.chiffres ?? []).map((c) => (
            <div key={c.id} className={`flex flex-col gap-1 rounded-3xl border-[3px] border-encre p-6 shadow-dur-6 ${FOND_CHIFFRE[c.couleur ?? 'bleu']}`}>
              <span className={`kk-display text-[64px] leading-none ${c.couleur === 'blanc' ? '' : '[text-shadow:0_4px_0_var(--color-encre)]'}`}>{c.valeur}</span>
              <span className="text-[19px] leading-[1.35] font-extrabold">{c.legende}</span>
            </div>
          ))}
          {beneficiaire?.nom && (
            <div className="flex flex-col gap-1.5 rounded-3xl border-[3px] border-encre bg-white p-6 shadow-dur-6">
              <Etiquette couleur="bleu" className="!text-[13px]">
                Au profit de
              </Etiquette>
              <span className="kk-display text-[28px] leading-[1.1]">{beneficiaire.nom}</span>
              {beneficiaire.texte && <span className="text-[16px] leading-[1.45] font-bold text-gris">{beneficiaire.texte}</span>}
            </div>
          )}
        </div>
      </section>

      {/* Pour Max */}
      <section id="max" aria-labelledby="max-titre" className="border-y-[3px] border-encre bg-white">
        <div className="kk-container kk-section flex flex-wrap-reverse items-center gap-[clamp(40px,6vw,88px)]">
          <div className="flex min-w-0 flex-[1_1_360px] justify-center">
            <div className="relative flex w-[min(100%,400px)] -rotate-3 flex-col gap-3.5 rounded-[26px] border-[3px] border-encre bg-bleu p-4 shadow-dur-12">
              <div aria-hidden="true" className="absolute -top-[18px] left-1/2 -ml-[60px] h-[34px] w-[120px] rotate-[4deg] border-2 border-encre bg-dragee/85" />
              <div className="kk-pixel flex items-center justify-between px-1 pt-1 text-[14px] text-white">
                <span>Fiche joueur</span>
                <span>P1</span>
              </div>
              <div
                className="grid aspect-square place-items-center rounded-2xl border-[3px] border-encre bg-bleu-clair p-[18px]"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgb(25 125 199 / .12) 0 14px, transparent 14px 28px)' }}
              >
                <div className="relative size-full overflow-hidden rounded-full border-[3px] border-encre bg-white">
                  {isMedia(max.fiche?.photo) && <Img media={max.fiche.photo} fill sizes="360px" size="carte" />}
                </div>
              </div>
              <div className="flex flex-col gap-2.5 rounded-2xl border-[3px] border-encre bg-white px-[18px] py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2.5">
                  <span className="kk-display text-[30px] leading-none">{max.fiche?.prenom}</span>
                  <span className="kk-pixel text-[14px] font-bold tracking-normal text-rose-bouton">{max.fiche?.pseudo}</span>
                </div>
                <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-1.5 text-[15px]">
                  {(max.fiche?.infos ?? []).map((i) => (
                    <div key={i.id} className="contents">
                      <dt className="font-black text-bleu-fonce">{i.label}</dt>
                      <dd className="m-0 font-bold">{i.valeur}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
          <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-[22px]">
            <Etiquette>{max.surtitre}</Etiquette>
            <h2 id="max-titre" className="kk-display m-0 text-[clamp(48px,6vw,84px)] leading-none">
              {max.titre}
            </h2>
            {max.intro && <p className="m-0 text-[20px] leading-[1.6] font-bold">{max.intro}</p>}
            {max.citation?.texte && (
              <figure className="mx-0 my-1 rounded-[18px] border-[3px] border-encre bg-rose-clair px-6 py-5 shadow-dur-5">
                <blockquote className="kk-display m-0 text-[clamp(22px,2.2vw,26px)] leading-[1.25]">« {max.citation.texte} »</blockquote>
                {max.citation.auteur && <figcaption className="kk-pixel mt-2.5 text-[13px] text-rose-fonce">{max.citation.auteur}</figcaption>}
              </figure>
            )}
            <RichText data={max.texte} className="text-[18px] leading-[1.65]" />
            <div className="flex flex-wrap gap-3.5 pt-1.5">
              <Bouton href={don.href} externe={don.externe} variante="don">
                {max.bouton || 'Faire un don en mémoire de Max'}
              </Bouton>
            </div>
          </div>
        </div>
      </section>

      {/* Programme */}
      <section id="programme" aria-labelledby="programme-titre" className="relative overflow-hidden border-b-[3px] border-encre bg-bleu">
        <Anneaux opacite={0.12} />
        <div className="kk-container kk-section relative flex flex-col gap-11">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="flex flex-col gap-3.5">
              <PastilleNoire>{programme?.surtitre}</PastilleNoire>
              <h2 id="programme-titre" className="kk-h2 text-white [text-shadow:0_5px_0_var(--color-encre)]">
                {programme?.titre}
              </h2>
            </div>
            <span className="rounded-[14px] border-[3px] border-encre bg-white px-[18px] py-3 text-[18px] font-black shadow-dur-5">{evenement.dates?.libelle} · en direct sur Twitch</span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-6">
            {(programme?.items ?? []).map((item, i) => {
              const rose = i % 2 === 0
              return (
                <article key={item.id} className="kk-card flex flex-col overflow-hidden rounded-[22px_22px_18px_18px] border-[3px] border-encre bg-white shadow-dur-7">
                  <div aria-hidden="true" className="h-5 bg-encre" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #1D1D1B 0 10px, #3A3A38 10px 14px)' }} />
                  <div className={`flex items-start justify-between border-b-[3px] border-encre p-[22px] ${rose ? 'bg-rose' : 'bg-ciel'}`}>
                    <span className="grid size-16 place-items-center rounded-[18px] border-[3px] border-encre bg-white">
                      <Icone nom={item.icone} size={34} trait={2.2} />
                    </span>
                    <span className={`kk-pixel text-[22px] font-bold ${rose ? 'text-white' : 'text-encre'}`}>{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="flex flex-col gap-2.5 px-[22px] pt-[22px] pb-[26px]">
                    <h3 className="kk-display m-0 text-[30px] leading-[1.05]">{item.titre}</h3>
                    <p className="m-0 text-[17px] leading-[1.55] font-semibold text-texte">{item.texte}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Choisis ta classe */}
      <section aria-labelledby="classe-titre" className="kk-container kk-section flex flex-col gap-11">
        <TitreSection id="classe-titre" surtitre={classes?.surtitre} titre={classes?.titre} texte={classes?.texte} />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-6">
          {(classes?.items ?? []).map((c, i) => {
            const rose = (c.couleur ?? (i % 2 ? 'bleu' : 'rose')) === 'rose'
            const l = resoudre(c.lien)
            const estDon = c.lien === 'don'
            return (
              <article key={c.id} className="kk-card flex flex-col gap-4 rounded-3xl border-[3px] border-encre bg-white p-6 shadow-dur-7">
                <div className="flex items-center justify-between">
                  <span className={`grid size-[60px] place-items-center rounded-full border-[3px] border-encre text-white ${rose ? 'bg-rose' : 'bg-bleu'}`}>
                    <Icone nom={c.icone} size={28} trait={2.6} />
                  </span>
                  <span className="kk-pixel text-[12px] tracking-normal text-gris">Classe {i + 1}</span>
                </div>
                <h3 className="kk-display m-0 text-[34px] leading-none">{c.nom}</h3>
                <p className="m-0 flex-grow text-[17px] leading-[1.5] font-semibold text-texte">{c.texte}</p>
                {c.pouvoir && (
                  <div className={`rounded-xl border-2 border-encre px-3 py-2.5 text-[15px] font-extrabold ${rose ? 'bg-rose-clair' : 'bg-bleu-clair'}`}>
                    <span className={`kk-pixel mb-0.5 block text-[11px] tracking-normal ${rose ? 'text-rose-fonce' : 'text-bleu-fonce'}`}>Pouvoir spécial</span>
                    {c.pouvoir}
                  </div>
                )}
                <Bouton href={l.href} externe={l.externe} variante={estDon ? 'don' : 'blanc'} taille="sm" className="w-full !min-h-[50px]">
                  {c.bouton}
                </Bouton>
              </article>
            )
          })}
        </div>
      </section>

      {/* Boutique */}
      {produits.length > 0 && (
        <section aria-labelledby="boutique-titre" className="border-y-[3px] border-encre bg-rose-clair">
          <div className="kk-container kk-section flex flex-col gap-10">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <TitreSection id="boutique-titre" surtitre={boutique?.surtitre} titre={boutique?.titre} texte={boutique?.texte} couleur="rose-fonce" className="max-w-[680px]" />
              <Bouton href="/boutique">
                {boutique?.bouton || 'Toute la boutique'}
                <Fleche size={20} />
              </Bouton>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] gap-6">
              {produits.map((p) => (
                <CarteProduit key={p.id} produit={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Live Twitch */}
      <section aria-labelledby="live-titre" className="relative overflow-hidden border-b-[3px] border-encre bg-nuit text-white">
        <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgb(159 208 245 / .16) 0 2px, transparent 2px)', backgroundSize: '28px 28px' }} />
        <div className="kk-container kk-section relative flex flex-wrap items-center gap-[clamp(40px,6vw,80px)]">
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-[22px]">
            <span className="kk-pill self-start border-[3px] border-white bg-rose-bouton text-white">
              <Pulse couleur="#fff" taille={9} />
              {live?.surtitre || 'On air'}
            </span>
            <h2 id="live-titre" className="kk-h2">
              {live?.titre}
            </h2>
            {live?.texte && <p className="m-0 max-w-[520px] text-[19px] leading-[1.6] font-semibold text-bleu-clair">{live.texte}</p>}
            <div className="flex flex-wrap gap-3.5">
              <Bouton href={twitch} className="!shadow-[5px_5px_0_var(--color-rose)]">
                <Lecture size={18} />
                {live?.bouton || 'Suivre sur Twitch'}
              </Bouton>
            </div>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {[
                { l: 'Instagram', h: site.reseaux?.instagram },
                { l: 'X', h: site.reseaux?.x },
                { l: 'Facebook', h: site.reseaux?.facebook },
              ]
                .filter((x) => x.h)
                .map((x) => (
                  <a key={x.l} href={x.h!} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center rounded-full border-2 border-ciel px-4 text-[15px] font-extrabold text-white no-underline hover:text-dragee">
                    {x.l}
                  </a>
                ))}
            </div>
          </div>
          <div className="relative min-w-0 flex-[1_1_520px]">
            <div className="relative aspect-video overflow-hidden rounded-[22px] border-[3px] border-white bg-bleu shadow-[10px_10px_0_var(--color-rose)]">
              <Anneaux taille={56} opacite={0.14} />
              <div className="absolute top-1/2 left-1/2 w-[34%] -translate-x-1/2 -translate-y-[54%]">
                <LogoKraken taille={240} className="h-auto w-full" />
              </div>
              <span className="kk-pixel absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-lg border-2 border-encre bg-rose-bouton px-2.5 py-1.5 text-[13px] tracking-normal text-white">
                <Pulse couleur="#fff" taille={8} />
                Live
              </span>
              <div className="absolute inset-x-4 bottom-4 flex flex-col gap-1.5">
                <div className="h-4 overflow-hidden rounded-full border-2 border-encre bg-nuit/60">
                  <div className="h-full bg-rose" style={{ width: `${Math.min(100, Math.round(((evenement.cagnotte?.montant ?? 0) / (evenement.cagnotte?.objectif || 1)) * 100))}%` }} />
                </div>
                <span className="kk-pixel text-[12px] tracking-normal text-white">{palier ? `Prochain palier · ${palier.defi}` : `Objectif · ${nombreFr(evenement.cagnotte?.objectif)} €`}</span>
              </div>
            </div>
            <div className="absolute -right-2 -bottom-9 flex w-[min(78%,300px)] rotate-3 flex-col gap-1 rounded-[18px] border-[3px] border-encre bg-white px-4 py-3.5 text-encre shadow-dur-6">
              <span className="kk-pixel text-[13px] font-bold tracking-normal text-rose-bouton">Nouveau don !</span>
              <span className="kk-display text-[24px] leading-[1.1]">{live?.alerteExemple}</span>
              <span className="text-[14px] font-bold text-gris">{live?.alerteTexte}</span>
            </div>
          </div>
          {!!live?.videos?.length && (
            <div className="flex flex-[1_1_100%] flex-col gap-[18px] pt-12">
              <span className="kk-pixel text-[13px] tracking-normal text-ciel">À revoir</span>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))] gap-6">
                {live.videos.map((v, i) => (
                  <a
                    key={v.id}
                    href={v.url}
                    target="_blank"
                    rel="noopener"
                    className="kk-card flex items-center gap-[18px] rounded-[20px] border-[3px] border-encre bg-white p-3.5 text-encre no-underline shadow-rose-6 hover:text-encre"
                  >
                    <span className={`grid aspect-video w-[min(176px,40%)] shrink-0 place-items-center rounded-xl border-[3px] border-encre ${i % 2 ? 'bg-rose' : 'bg-bleu'}`}>
                      <span className={`grid size-[46px] place-items-center rounded-full border-[3px] ${i % 2 ? 'border-white bg-encre' : 'border-encre bg-rose-bouton'} text-white`}>
                        <Lecture size={18} />
                      </span>
                    </span>
                    <span className="flex flex-col gap-1.5">
                      <span className="kk-pixel text-[12px] tracking-normal text-rose-bouton">Vidéo</span>
                      <span className="kk-display text-[clamp(20px,2vw,26px)] leading-[1.1]">{v.titre}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Partenaires */}
      <section id="partenaires" aria-labelledby="partenaires-titre" className="bg-white">
        <div className="kk-container flex flex-col gap-9 py-[clamp(72px,8vw,112px)]">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="flex flex-col gap-3.5">
              <Etiquette couleur="bleu">{blocPartenaires?.surtitre}</Etiquette>
              <h2 id="partenaires-titre" className="kk-display m-0 text-[clamp(40px,5vw,64px)] leading-none">
                {blocPartenaires?.titre}
              </h2>
            </div>
            <Bouton href="/nos-partenaires#devenir" taille="sm" className="!min-h-[52px]">
              {blocPartenaires?.bouton || 'Devenir partenaire'}
            </Bouton>
          </div>
          <div className="flex flex-wrap gap-6">
            {beneficiaire?.nom && (
              <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-2.5 rounded-3xl border-[3px] border-encre bg-bleu p-7 text-white shadow-dur-7">
                <span className="kk-pixel text-[13px] tracking-[.05em]">Au profit de</span>
                <span className="self-start rounded-[14px] border-[3px] border-encre bg-white px-4 py-3 shadow-dur-4">
                  {isMedia(beneficiaire.logo) ? (
                    <span className="relative block h-[52px] w-[186px]">
                      <Img media={beneficiaire.logo} fill contain sizes="186px" />
                    </span>
                  ) : (
                    <span className="kk-display text-[22px] text-encre">{beneficiaire.nom}</span>
                  )}
                </span>
                {beneficiaire.texte && <p className="m-0 text-[18px] leading-[1.5] font-bold">{beneficiaire.texte}</p>}
                {beneficiaire.lien && (
                  <a href={beneficiaire.lien} target="_blank" rel="noopener" className="kk-link text-[17px] font-black text-white underline underline-offset-4">
                    Découvrir la Fédération →
                  </a>
                )}
              </div>
            )}
            <div className="grid min-w-0 flex-[2_1_520px] grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-4">
              {partenaires.map((p) => (
                <Link
                  key={p.id}
                  href="/nos-partenaires"
                  className="kk-card flex min-h-[130px] flex-col justify-center gap-1.5 rounded-[18px] border-[3px] border-encre bg-white px-5 py-[18px] text-encre no-underline shadow-dur-5 hover:text-encre"
                >
                  <span className="relative block h-14 w-full">{isMedia(p.logo) && <Img media={p.logo} fill contain sizes="220px" />}</span>
                  <span className="kk-display text-[20px] leading-[1.1]">{p.nom}</span>
                  <span className="text-[14px] font-extrabold text-bleu-fonce">{p.role}</span>
                </Link>
              ))}
              <Link
                href="/nos-partenaires#devenir"
                className="kk-card flex min-h-[130px] flex-col items-center justify-center gap-1.5 rounded-[18px] border-[3px] border-dashed border-encre bg-papier px-5 py-[18px] text-center text-encre no-underline hover:text-encre"
              >
                <span className="kk-display text-[36px] leading-none">+</span>
                <span className="text-[16px] font-black">Ta structure ici ?</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
