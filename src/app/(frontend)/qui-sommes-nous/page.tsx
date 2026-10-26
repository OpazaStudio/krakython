import type { Metadata } from 'next'
import { getGlobal, getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { QuiSommesNousView } from './QuiSommesNousView'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getGlobal('qui-sommes-nous', 1)
  return buildMetadata({ meta: page.meta, title: 'Qui sommes-nous', description: page.entete?.intro ?? '', path: '/qui-sommes-nous' })
}

export default async function Page() {
  const payload = await getPayloadClient()
  const [page, membres, editions] = await Promise.all([
    getGlobal('qui-sommes-nous', 1),
    payload.find({ collection: 'membres', sort: 'ordre', depth: 1, pagination: false }),
    payload.find({ collection: 'editions', sort: 'debut', depth: 0, pagination: false }),
  ])
  return <QuiSommesNousView page={page} membres={membres.docs} editions={editions.docs} />
}
