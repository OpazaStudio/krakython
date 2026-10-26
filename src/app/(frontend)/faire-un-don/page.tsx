import type { Metadata } from 'next'
import { getGlobal } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { DonView } from '@/components/don/DonView'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getGlobal('page-don')
  return buildMetadata({
    meta: page.meta,
    title: 'Faire un don',
    description: page.entete?.intro ?? '',
    path: '/faire-un-don',
  })
}

export default async function Page() {
  const page = await getGlobal('page-don')
  return <DonView page={page} />
}
