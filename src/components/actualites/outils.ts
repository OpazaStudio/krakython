import type { Actualite, Media } from '@/payload-types'

// Petits outils partagés par la page Actualités et les articles.

export type CategorieActu = { value: string; label: string; pluriel: string }

/** Article sans son texte complet (listes, cartes). */
export type ActuResume = Omit<Actualite, 'contenu'> & { contenu?: Actualite['contenu'] }

/** Fond de la pastille de catégorie, comme sur la maquette. */
export const FOND_CATEGORIE: Record<string, string> = {
  asso: 'bg-rose-clair',
  partenaire: 'bg-bleu-clair',
  evenement: 'bg-white',
}

// Fuseau fixe : même rendu côté serveur et navigateur (pas d’écart d’hydratation).
const fmtCourt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Paris' })
const fmtLong = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' })
const fmtAnnee = new Intl.DateTimeFormat('fr-FR', { year: 'numeric', timeZone: 'Europe/Paris' })

const valide = (d?: string | null) => (d && !Number.isNaN(new Date(d).getTime()) ? new Date(d) : null)

/** « 27 nov. 2024 » */
export const dateCourte = (d?: string | null) => {
  const x = valide(d)
  return x ? fmtCourt.format(x) : ''
}

/** « 27 novembre 2024 » */
export const dateLongue = (d?: string | null) => {
  const x = valide(d)
  return x ? fmtLong.format(x) : ''
}

export const annee = (d?: string | null) => {
  const x = valide(d)
  return x ? fmtAnnee.format(x) : ''
}

/**
 * Comment présenter une image : portrait carré (médaillon rond), logo (cadre blanc)
 * ou photo (plein cadre).
 */
export type Forme = 'rond' | 'logo' | 'photo'

export const formeImage = (m: Media): Forme => {
  if (m.mimeType === 'image/svg+xml') return 'logo'
  const r = (m.width || 16) / (m.height || 9)
  if (r >= 1.9) return 'logo'
  if (r >= 0.8 && r <= 1.25) return 'rond'
  return 'photo'
}

type Noeud = { text?: unknown; children?: unknown }

/** Temps de lecture estimé (200 mots par minute, 1 min au minimum). */
export const tempsLecture = (contenu: unknown): number => {
  let mots = 0
  const parcourir = (n: unknown) => {
    if (!n || typeof n !== 'object') return
    const { text, children } = n as Noeud
    if (typeof text === 'string') mots += text.split(/\s+/).filter(Boolean).length
    if (Array.isArray(children)) children.forEach(parcourir)
  }
  parcourir((contenu as { root?: unknown } | null)?.root)
  return Math.max(1, Math.ceil(mots / 200))
}

/** Taille du texte de la vignette sans image selon sa longueur (« J-30 » en très grand). */
export const tailleEtiquette = (texte: string, tailles: [string, string, string]) => (texte.length <= 5 ? tailles[0] : texte.length <= 8 ? tailles[1] : tailles[2])
