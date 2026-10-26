import type { Metadata } from 'next'
import { getGlobal, getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { PresseView } from '@/components/presse/PresseView'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getGlobal('page-presse')
  return buildMetadata({
    meta: page.meta,
    title: 'Ils parlent de nous',
    description: page.entete?.intro ?? '',
    path: '/ils-parlent-de-nous',
  })
}

export default async function Page() {
  const payload = await getPayloadClient()
  const [page, articles] = await Promise.all([getGlobal('page-presse'), payload.find({ collection: 'presse', sort: '-date', limit: 100, depth: 0 })])
  return <PresseView page={page} articles={articles.docs} />
}
