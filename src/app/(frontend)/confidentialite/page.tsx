import type { Metadata } from 'next'
import { PageLegaleView } from '@/components/legal/PageLegaleView'
import { getGlobal } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getGlobal('confidentialite', 0)
  return buildMetadata({ title: doc.titre || 'Confidentialité', description: 'Comment le Krakython traite vos données : commandes, messages, alerte du prochain live.', path: '/confidentialite' })
}

export default async function Page() {
  const doc = await getGlobal('confidentialite', 0)
  return <PageLegaleView doc={doc} slug="confidentialite" />
}
