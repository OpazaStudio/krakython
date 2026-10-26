import Link from 'next/link'
import { Anneaux, LogoKraken, Tentacule } from '@/components/decor'

export default function NotFound() {
  return (
    <section className="relative overflow-hidden border-b-[3px] border-encre bg-bleu">
      <Anneaux />
      <Tentacule couleur="rose" className="-right-10 -bottom-16 hidden h-[364px] w-[260px] origin-bottom md:block" />
      <div className="kk-container relative flex flex-wrap items-center gap-12 py-[clamp(64px,9vw,120px)]">
        <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-6">
          <span className="kk-pill kk-pill--noir self-start">Erreur 404</span>
          <h1 className="kk-h1">Game over… cette page n’existe pas.</h1>
          <p className="m-0 max-w-[520px] text-[20px] leading-[1.5] font-extrabold text-white">Le kraken a cherché partout. Elle a peut-être changé d’adresse : repars de l’accueil, ou file voir la boutique.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="kk-btn kk-btn--don kk-btn--lg">
              Retour à l’accueil
            </Link>
            <Link href="/boutique" className="kk-btn kk-btn--blanc kk-btn--lg">
              La boutique
            </Link>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-[min(80%,320px)]">
          <div className="absolute inset-0 rounded-full border-[3px] border-encre bg-white shadow-dur-10" />
          <div className="absolute inset-[12%] animate-bob">
            <LogoKraken taille={320} className="size-full object-contain" />
          </div>
          <span className="kk-pixel absolute -right-3 bottom-6 -rotate-6 rounded-xl bg-encre px-3.5 py-2.5 text-[15px] text-ciel shadow-[4px_4px_0_var(--color-rose)]">CONTINUE ?</span>
        </div>
      </div>
    </section>
  )
}
