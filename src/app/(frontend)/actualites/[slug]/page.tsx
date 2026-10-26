import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { CATEGORIES_ACTU } from '@/collections/Actualites'
import { JsonLd } from '@/components/JsonLd'
import { mediaUrl } from '@/lib/media'
import { getPayloadClient, getSite } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { getServerSideURL } from '@/utilities/getURL'
import { ArticleView } from './ArticleView'

export const dynamic = 'force-static'
export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

const AUTEUR = 'L’équipe du Krakython'

/** Article publié correspondant au slug (null sinon). */
const getActu = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const r = await payload.find({
    collection: 'actualites',
    where: { and: [{ slug: { equals: slug } }, { publie: { equals: true } }] },
    limit: 1,
    depth: 1,
  })
  return r.docs[0] ?? null
})

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const r = await payload.find({ collection: 'actualites', where: { publie: { equals: true } }, depth: 0, pagination: false, select: { slug: true } })
  return r.docs.filter((d) => d.slug).map((d) => ({ slug: d.slug as string }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const actu = await getActu(slug)
  if (!actu) return {}
  const m = buildMetadata({ meta: actu.meta, title: actu.titre, description: actu.resume, path: `/actualites/${slug}`, image: actu.image, type: 'article' })
  return {
    ...m,
    authors: [{ name: AUTEUR }],
    openGraph: {
      ...m.openGraph,
      type: 'article',
      publishedTime: actu.date,
      modifiedTime: actu.updatedAt,
      authors: [AUTEUR],
      section: CATEGORIES_ACTU.find((c) => c.value === actu.categorie)?.label,
    },
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const actu = await getActu(slug)
  if (!actu) notFound()

  const payload = await getPayloadClient()
  const [autres, site] = await Promise.all([
    payload.find({
      collection: 'actualites',
      where: { and: [{ publie: { equals: true } }, { id: { not_equals: actu.id } }] },
      sort: '-date',
      limit: 2,
      depth: 1,
      select: { contenu: false },
    }),
    getSite(),
  ])

  const base = getServerSideURL()
  const url = `${base}/actualites/${slug}`
  const img = mediaUrl(actu.image, 'og') ?? mediaUrl(actu.image)
  const categories = CATEGORIES_ACTU.map(({ label, value, pluriel }) => ({ label, value, pluriel }))

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'NewsArticle',
              '@id': `${url}#article`,
              headline: actu.titre,
              description: actu.resume,
              datePublished: actu.date,
              dateModified: actu.updatedAt,
              inLanguage: 'fr-FR',
              articleSection: categories.find((c) => c.value === actu.categorie)?.label,
              image: [img ? (img.startsWith('http') ? img : `${base}${img}`) : `${base}/opengraph.jpg`],
              mainEntityOfPage: { '@type': 'WebPage', '@id': url },
              author: { '@type': 'Organization', name: AUTEUR, url: `${base}/qui-sommes-nous` },
              publisher: { '@type': 'NGO', '@id': `${base}/#asso`, name: site.nomAsso, logo: { '@type': 'ImageObject', url: `${base}/images/logo-kraken.webp` } },
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${base}/` },
                { '@type': 'ListItem', position: 2, name: 'Actualités', item: `${base}/actualites` },
                { '@type': 'ListItem', position: 3, name: actu.titre, item: url },
              ],
            },
          ],
        }}
      />
      <ArticleView actu={actu} autres={autres.docs} categories={categories} url={url} auteur={AUTEUR} />
    </>
  )
}
