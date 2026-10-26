import type { Metadata } from 'next'
import { PageLegaleView } from '@/components/legal/PageLegaleView'
import { getGlobal } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getGlobal('cgv', 0)
  return buildMetadata({ title: doc.titre || 'Conditions générales de vente', description: 'Conditions de vente de la boutique du Krakython : commande, paiement, livraison, rétractation.', path: '/cgv' })
}

export default async function Page() {
  const doc = await getGlobal('cgv', 0)
  return <PageLegaleView doc={doc} slug="cgv" />
}
