import type { Metadata } from 'next'
import { PageLegaleView } from '@/components/legal/PageLegaleView'
import { getGlobal } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getGlobal('mentions-legales', 0)
  return buildMetadata({ title: doc.titre || 'Mentions légales', description: 'Éditeur, hébergement et propriété intellectuelle du site du Krakython.', path: '/mentions-legales' })
}

export default async function Page() {
  const doc = await getGlobal('mentions-legales', 0)
  return <PageLegaleView doc={doc} slug="mentions-legales" />
}
