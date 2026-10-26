import type { Metadata } from 'next'
import { libelleTotal, totalEditions } from '@/lib/editions'
import { getGlobal, getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { PartenairesView } from '@/components/partenaires/PartenairesView'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getGlobal('page-partenaires')
  return buildMetadata({
    meta: page.meta,
    title: 'Nos partenaires',
    description: page.entete?.intro ?? '',
    path: '/nos-partenaires',
  })
}

export default async function Page() {
  const payload = await getPayloadClient()
  const [page, partenaires, editions] = await Promise.all([
    getGlobal('page-partenaires'),
    payload.find({ collection: 'partenaires', sort: 'ordre', limit: 50, depth: 1 }),
    payload.find({ collection: 'editions', limit: 200, depth: 0, pagination: false, select: { montant: true } }),
  ])
  const total = editions.docs.length ? libelleTotal(totalEditions(editions.docs)) : null
  return <PartenairesView page={page} partenaires={partenaires.docs} total={total} />
}
