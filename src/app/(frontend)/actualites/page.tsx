import type { Metadata } from 'next'
import { CATEGORIES_ACTU } from '@/collections/Actualites'
import { getGlobal, getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { ActualitesView } from './ActualitesView'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getGlobal('page-actualites', 1)
  return buildMetadata({ meta: page.meta, title: 'Actualités', description: page.entete?.intro ?? '', path: '/actualites' })
}

export default async function Page() {
  const payload = await getPayloadClient()
  const [page, actus] = await Promise.all([
    getGlobal('page-actualites', 1),
    payload.find({
      collection: 'actualites',
      where: { publie: { equals: true } },
      sort: '-date',
      depth: 1,
      pagination: false,
      select: { contenu: false },
    }),
  ])
  const categories = CATEGORIES_ACTU.map(({ label, value, pluriel }) => ({ label, value, pluriel }))
  return <ActualitesView page={page} actus={actus.docs} categories={categories} />
}
