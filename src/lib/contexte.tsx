'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Evenement, Site } from '@/payload-types'
import { useLiveDoc } from './useLiveDoc'

// Réglages partagés par toutes les pages (événement, cagnotte, réseaux…),
// mis à jour en direct quand on les modifie dans l'admin.

type Contexte = { evenement: Evenement; site: Site }
const Ctx = createContext<Contexte | null>(null)

export function SiteProvider({ evenement, site, children }: Contexte & { children: ReactNode }) {
  const ev = useLiveDoc(evenement, { globalSlug: 'evenement' }, 1)
  const s = useLiveDoc(site, { globalSlug: 'site' }, 1)
  return <Ctx.Provider value={{ evenement: ev, site: s }}>{children}</Ctx.Provider>
}

export function useSite(): Contexte {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSite doit être utilisé sous <SiteProvider>.')
  return ctx
}

/** Où mènent les boutons « Faire un don » : la page dédiée, ou Streamlabs directement. */
export function useLienDon(): { href: string; externe: boolean } {
  const { evenement } = useSite()
  return evenement.donDirect && evenement.lienDon ? { href: evenement.lienDon, externe: true } : { href: '/faire-un-don', externe: false }
}

/** Résout un lien saisi dans l'admin : « don » = bouton de don, « twitch » = chaîne Twitch. */
export function useResoudreLien() {
  const don = useLienDon()
  const { site } = useSite()
  return (lien?: string | null): { href: string; externe: boolean } => {
    const l = (lien ?? '').trim()
    if (l === 'don') return don
    if (l === 'twitch') return { href: site.reseaux?.twitch || 'https://www.twitch.tv/krakython', externe: true }
    if (!l) return { href: '/', externe: false }
    return { href: l, externe: /^https?:\/\//.test(l) }
  }
}
