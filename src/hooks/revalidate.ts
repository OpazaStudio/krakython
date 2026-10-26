import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

// Les pages du site sont statiques : chaque enregistrement dans l'admin les régénère.
const safeRevalidate = (paths: string[], tags: string[] = []) => {
  try {
    for (const p of paths) revalidatePath(p)
    for (const t of tags) revalidateTag(t, 'max')
    revalidateTag('sitemap', 'max')
  } catch {
    // Hors requête Next (seed, scripts) : rien à régénérer.
  }
}

export const revalidateGlobal =
  (paths: string[], tags: string[] = []): GlobalAfterChangeHook =>
  ({ doc, req: { context } }) => {
    if (!context.disableRevalidate) safeRevalidate(paths, tags)
    return doc
  }

export const revalidateCollection =
  (paths: string[] | ((doc: any) => string[]), tags: string[] = []): CollectionAfterChangeHook =>
  ({ doc, req: { context } }) => {
    if (!context.disableRevalidate) safeRevalidate(typeof paths === 'function' ? paths(doc) : paths, tags)
    return doc
  }

export const revalidateCollectionDelete =
  (paths: string[] | ((doc: any) => string[]), tags: string[] = []): CollectionAfterDeleteHook =>
  ({ doc, req: { context } }) => {
    if (!context.disableRevalidate) safeRevalidate(typeof paths === 'function' ? paths(doc) : paths, tags)
    return doc
  }

// Toutes les pages publiques (le bandeau d'annonce et le pied de page sont partout).
export const ALL_PATHS = [
  '/',
  '/qui-sommes-nous',
  '/actualites',
  '/ils-parlent-de-nous',
  '/nos-partenaires',
  '/faire-un-don',
  '/boutique',
  '/panier',
  '/commande',
  '/mentions-legales',
  '/cgv',
  '/confidentialite',
]

export const revalidateAll = () => safeRevalidate(['/'].concat(ALL_PATHS))
