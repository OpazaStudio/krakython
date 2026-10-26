import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getServerSideURL()
  const payload = await getPayloadClient()
  const [actus, produits] = await Promise.all([
    payload.find({ collection: 'actualites', where: { publie: { equals: true } }, limit: 500, depth: 0, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'produits', where: { actif: { equals: true } }, limit: 500, depth: 0, select: { slug: true, updatedAt: true } }),
  ])
  const pages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/faire-un-don`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/boutique`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/qui-sommes-nous`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/actualites`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/ils-parlent-de-nous`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/nos-partenaires`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/mentions-legales`, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${base}/cgv`, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${base}/confidentialite`, changeFrequency: 'yearly', priority: 0.1 },
  ]
  for (const a of actus.docs) pages.push({ url: `${base}/actualites/${a.slug}`, lastModified: a.updatedAt ?? undefined, changeFrequency: 'monthly', priority: 0.5 })
  for (const p of produits.docs) pages.push({ url: `${base}/boutique/${p.slug}`, lastModified: p.updatedAt ?? undefined, changeFrequency: 'weekly', priority: 0.6 })
  return pages
}
