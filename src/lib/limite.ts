import { headers } from 'next/headers'

// Limiteur de débit en mémoire, fenêtre glissante, par instance serveur.
// Suffisant pour freiner les robots sur les formulaires d'une asso.

type Limiteur = (cle: string) => boolean

function creer(limite: number, fenetreMs: number): Limiteur {
  const coups = new Map<string, number[]>()
  return (cle) => {
    const maintenant = Date.now()
    for (const [k, t] of coups) {
      const gardes = t.filter((x) => x > maintenant - fenetreMs)
      if (gardes.length) coups.set(k, gardes)
      else coups.delete(k)
    }
    const t = coups.get(cle) ?? []
    if (t.length >= limite) return false
    t.push(maintenant)
    coups.set(cle, t)
    return true
  }
}

const g = globalThis as unknown as { __kkLimites?: Record<string, Limiteur> }
const LIMITES = {
  alerte: [5, 60 * 60 * 1000],
  message: [3, 60 * 60 * 1000],
  paiement: [10, 10 * 60 * 1000],
  retour: [30, 10 * 60 * 1000],
} as const
const limites = (g.__kkLimites ??= {})
for (const [type, [limite, fenetre]] of Object.entries(LIMITES)) limites[type] ??= creer(limite, fenetre)

export async function autorise(type: keyof typeof LIMITES): Promise<boolean> {
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'inconnue'
  return limites[type](ip)
}
