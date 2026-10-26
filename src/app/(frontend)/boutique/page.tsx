import type { Metadata } from 'next'
import { CATEGORIES_PRODUIT } from '@/collections/Produits'
import { BoutiqueView } from '@/components/boutique/BoutiqueView'
import { getGlobal, getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-static'
export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await getGlobal('page-boutique', 1)
  return buildMetadata({
    meta: page.meta,
    title: 'Boutique',
    description: page.entete?.intro || 'Textile, goodies et accessoires aux couleurs du Krakython : chaque commande soutient l’association.',
    path: '/boutique',
  })
}

export default async function Page() {
  const payload = await getPayloadClient()
  const [reglages, produits] = await Promise.all([
    getGlobal('page-boutique', 1),
    payload.find({ collection: 'produits', where: { actif: { equals: true } }, sort: 'ordre', limit: 100, depth: 1, pagination: false }),
  ])
  const categories = CATEGORIES_PRODUIT.map((c) => ({ label: c.label, value: c.value }))
  return <BoutiqueView reglages={reglages} produits={produits.docs} categories={categories} />
}
