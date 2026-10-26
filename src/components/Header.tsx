'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLienDon } from '@/lib/contexte'
import { estActif, NAV } from '@/lib/nav'
import { usePanier } from '@/lib/panier/PanierProvider'
import { LogoHorizontal } from './decor'
import { Coeur, Croix, Menu, Panier } from './icones'
import { Bouton } from './ui'

function BoutonPanier({ petit = false }: { petit?: boolean }) {
  const { nombre, pret } = usePanier()
  const n = pret ? nombre : 0
  return (
    <Link
      href="/panier"
      aria-label={`Panier, ${n} article${n > 1 ? 's' : ''}`}
      className={`kk-btn kk-btn--blanc relative !p-0 ${petit ? '!min-h-11 size-11 !rounded-xl !shadow-none' : '!min-h-12 size-12 !shadow-dur-4'}`}
    >
      <Panier size={petit ? 20 : 22} />
      {n > 0 && (
        <span className="absolute -top-2.5 -right-2.5 grid h-6 min-w-6 place-items-center rounded-full border-2 border-encre bg-rose-bouton px-1 text-[13px] font-black text-white">{n}</span>
      )}
    </Link>
  )
}

export function Header() {
  const pathname = usePathname()
  const don = useLienDon()
  const [ouvert, setOuvert] = useState(false)

  useEffect(() => {
    // Ferme le menu mobile à chaque changement de page.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOuvert(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-encre bg-white">
      <nav aria-label="Navigation principale" className="kk-container flex items-center justify-between gap-x-7 gap-y-3 py-2.5 lg:py-3">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Krakython, retour à l’accueil">
          <LogoHorizontal className="h-[38px] w-auto lg:h-[46px]" />
        </Link>

        <div className="hidden flex-wrap items-center gap-x-[26px] gap-y-1.5 text-[16px] font-extrabold lg:flex">
          {NAV.map((n) => {
            const actif = estActif(pathname, n.href)
            return (
              <Link key={n.href} href={n.href} aria-current={actif ? 'page' : undefined} className={`kk-link ${actif ? 'text-rose-bouton' : 'text-encre'}`}>
                {n.label}
              </Link>
            )
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <BoutonPanier />
          <Bouton href={don.href} externe={don.externe} variante={pathname === '/faire-un-don' ? 'noir' : 'don'} taille="sm" className={pathname === '/faire-un-don' ? '' : '!shadow-dur-4'}>
            <Coeur size={20} />
            Faire un don
          </Bouton>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <BoutonPanier petit />
          <button
            type="button"
            aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            onClick={() => setOuvert((o) => !o)}
            className="grid size-11 cursor-pointer place-items-center rounded-xl border-[3px] border-encre bg-encre p-0 text-white"
          >
            {ouvert ? <Croix size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {ouvert && (
        <div id="menu-mobile" className="border-t-[3px] border-encre bg-white lg:hidden">
          <div className="kk-container flex flex-col gap-1 py-4">
            {NAV.map((n) => {
              const actif = estActif(pathname, n.href)
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={actif ? 'page' : undefined}
                  className={`kk-display rounded-xl px-3 py-2.5 text-[26px] leading-tight ${actif ? 'bg-rose-clair text-rose-fonce' : 'text-encre'}`}
                >
                  {n.label}
                </Link>
              )
            })}
            <Bouton href={don.href} externe={don.externe} variante="don" className="mt-3 w-full">
              <Coeur size={20} />
              Faire un don
            </Bouton>
          </div>
        </div>
      )}
    </header>
  )
}
