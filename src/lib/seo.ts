import type { Metadata } from 'next'
import { getServerSideURL } from '@/utilities/getURL'
import { mediaUrl, type MediaRef } from './media'

type Meta = { title?: string | null; description?: string | null; image?: MediaRef } | null | undefined

export const SITE = {
  name: 'Krakython',
  tagline: '51 h de jeu contre la leucémie',
}

const absolue = (u: string | null): string | undefined => {
  if (!u) return undefined
  return u.startsWith('http') ? u : `${getServerSideURL()}${u}`
}

export const buildMetadata = (opts: { meta?: Meta; title: string; description: string; path: string; image?: MediaRef; type?: 'website' | 'article' }): Metadata => {
  const custom = opts.meta?.title?.trim()
  const title = custom || opts.title
  const description = (opts.meta?.description?.trim() || opts.description || '').slice(0, 300)
  const og = mediaUrl(opts.meta?.image, 'og') ?? mediaUrl(opts.image, 'og')
  const img = absolue(og ?? mediaUrl(opts.meta?.image) ?? mediaUrl(opts.image)) ?? `${getServerSideURL()}/opengraph.jpg`
  // Dimensions annoncées seulement quand on sert le format 1200×630 (taille « og » ou image par défaut).
  const dims = og || img.endsWith('/opengraph.jpg') ? { width: 1200, height: 630 } : {}
  const url = `${getServerSideURL()}${opts.path}`
  return {
    title: custom ? { absolute: custom } : title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE.name, locale: 'fr_FR', type: opts.type ?? 'website', images: [{ url: img, ...dims }] },
    twitter: { card: 'summary_large_image', title, description, images: [img] },
  }
}
