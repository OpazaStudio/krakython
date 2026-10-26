import type { Metadata } from 'next'
import { getGlobal, getPayloadClient } from '@/lib/payload'
import { buildMetadata, SITE } from '@/lib/seo'
import { AccueilView } from './AccueilView'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const accueil = await getGlobal('accueil')
  return buildMetadata({
    meta: accueil.meta,
    title: `${SITE.name} · ${SITE.tagline}`,
    description: accueil.hero?.texte ?? '',
    path: '/',
  })
}

export default async function Page() {
  const payload = await getPayloadClient()
  const [accueil, produits, partenaires] = await Promise.all([
    getGlobal('accueil'),
    payload.find({ collection: 'produits', where: { actif: { equals: true }, enAvant: { equals: true } }, sort: 'ordre', limit: 4, depth: 1 }),
    payload.find({ collection: 'partenaires', sort: 'ordre', limit: 12, depth: 1 }),
  ])
  return <AccueilView accueil={accueil} produits={produits.docs} partenaires={partenaires.docs} />
}
