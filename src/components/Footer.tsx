'use client'
import Link from 'next/link'
import { useLienDon, useSite } from '@/lib/contexte'
import { LogoKraken } from './decor'
import { FormAlerte } from './FormAlerte'

const Colonne = ({ titre, children }: { titre: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-3">
    <span className="kk-pixel text-[13px] tracking-normal text-ciel">{titre}</span>
    {children}
  </div>
)

const lienCls = 'kk-link font-bold text-white'

export function Footer() {
  const { site } = useSite()
  const don = useLienDon()
  const r = site.reseaux ?? {}
  const reseaux = [
    { label: 'Twitch', href: r.twitch },
    { label: 'Instagram', href: r.instagram },
    { label: 'Facebook', href: r.facebook },
    { label: 'X', href: r.x },
    { label: 'YouTube', href: r.youtube },
  ].filter((x) => x.href)

  return (
    <footer id="contact" className="border-t-[3px] border-encre bg-encre text-white">
      <div className="kk-container flex flex-col gap-12 pt-[clamp(56px,7vw,88px)] pb-8">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-[18px]">
            <div className="flex items-center gap-3">
              <LogoKraken className="size-[60px] object-contain" taille={60} />
              <span className="kk-display text-[34px]">Krakython</span>
            </div>
            {site.pied?.texte && <p className="m-0 max-w-[400px] text-[17px] leading-[1.55] font-semibold text-brume">{site.pied.texte}</p>}
            <FormAlerte titre={site.pied?.alerteTitre || 'Reçois l’alerte du prochain live'} sombre />
          </div>
          <div className="grid min-w-0 flex-[2_1_520px] grid-cols-[repeat(auto-fit,minmax(min(150px,100%),1fr))] gap-7">
            <Colonne titre="Le Krakython">
              <Link href="/qui-sommes-nous" className={lienCls}>
                Qui sommes-nous
              </Link>
              <Link href="/actualites" className={lienCls}>
                Actualités
              </Link>
              <Link href="/ils-parlent-de-nous" className={lienCls}>
                Ils parlent de nous
              </Link>
              <Link href="/nos-partenaires" className={lienCls}>
                Partenaires
              </Link>
            </Colonne>
            <Colonne titre="Soutenir">
              <a href={don.href} className={lienCls} {...(don.externe ? { target: '_blank', rel: 'noopener' } : {})}>
                Faire un don
              </a>
              <Link href="/boutique" className={lienCls}>
                Boutique
              </Link>
              {site.lienMoelle && (
                <a href={site.lienMoelle} target="_blank" rel="noopener" className={lienCls}>
                  Don de moelle osseuse
                </a>
              )}
              <Link href="/nos-partenaires#devenir" className={lienCls}>
                Devenir partenaire
              </Link>
            </Colonne>
            <Colonne titre="Suivre">
              {reseaux.map((x) => (
                <a key={x.label} href={x.href!} target="_blank" rel="noopener" className={lienCls}>
                  {x.label}
                </a>
              ))}
              {site.email && (
                <a href={`mailto:${site.email}`} className="kk-link font-bold break-all text-brume">
                  {site.email}
                </a>
              )}
            </Colonne>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-3 border-t-2 border-encre-3 pt-6 text-[14px] font-bold text-brume">
          <span>
            © {new Date().getFullYear()} {site.nomAsso}
          </span>
          <div className="flex flex-wrap gap-x-[22px] gap-y-2">
            <Link href="/mentions-legales" className="kk-link text-brume">
              Mentions légales
            </Link>
            <Link href="/cgv" className="kk-link text-brume">
              CGV boutique
            </Link>
            <Link href="/confidentialite" className="kk-link text-brume">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
