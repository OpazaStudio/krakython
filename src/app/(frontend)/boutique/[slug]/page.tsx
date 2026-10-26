import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { CATEGORIES_PRODUIT } from '@/collections/Produits'
import { JsonLd } from '@/components/JsonLd'
import { ProduitView } from '@/components/boutique/ProduitView'
import { estEpuise } from '@/lib/boutique/produit'
import { isMedia, mediaUrl } from '@/lib/media'
import { getGlobal, getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-static'
export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

const getProduit = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'produits', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  const produit = docs[0]
  return produit?.actif ? produit : null
})

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'produits', where: { actif: { equals: true } }, limit: 200, depth: 0, pagination: false, select: { slug: true } })
  return docs.filter((p) => p.slug).map((p) => ({ slug: p.slug as string }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const produit = await getProduit(slug)
  if (!produit) return { title: 'Produit introuvable', robots: { index: false } }
  return buildMetadata({
    meta: produit.meta,
    title: produit.nom,
    description: [produit.sousTitre, 'Boutique officielle du Krakython : chaque achat soutient l’association.'].filter(Boolean).join(' · '),
    path: `/boutique/${slug}`,
    image: produit.photos?.[0],
  })
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const produit = await getProduit(slug)
  if (!produit) notFound()

  const payload = await getPayloadClient()
  const [reglages, autres] = await Promise.all([
    getGlobal('page-boutique', 1),
    payload.find({ collection: 'produits', where: { actif: { equals: true }, id: { not_equals: produit.id } }, sort: 'ordre', limit: 4, depth: 1 }),
  ])

  const base = getServerSideURL()
  const absolue = (u: string | null) => (u ? (u.startsWith('http') ? u : `${base}${u}`) : null)
  const images = (produit.photos ?? []).filter(isMedia).map((m) => absolue(mediaUrl(m, 'large') ?? mediaUrl(m)))
  const categorie = CATEGORIES_PRODUIT.find((c) => c.value === produit.categorie)?.label ?? 'Boutique'

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: produit.nom,
          ...(produit.sousTitre ? { description: produit.sousTitre } : {}),
          sku: produit.slug,
          category: categorie,
          url: `${base}/boutique/${slug}`,
          image: images.length ? images : [`${base}/images/logo-kraken.webp`],
          brand: { '@type': 'Brand', name: 'Krakython' },
          offers: {
            '@type': 'Offer',
            url: `${base}/boutique/${slug}`,
            price: produit.prix.toFixed(2),
            priceCurrency: 'EUR',
            availability: estEpuise(produit) ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: { '@id': `${base}/#asso` },
          },
        }}
      />
      <ProduitView produit={produit} categorie={categorie} reglages={{ colissimo: reglages.colissimo, retrait: reglages.retrait }} autres={autres.docs} />
    </>
  )
}
