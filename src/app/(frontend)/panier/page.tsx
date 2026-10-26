import type { Metadata } from 'next'
import { Bandeau } from '@/components/boutique/Bandeau'
import { versCatalogue } from '@/components/boutique/catalogue'
import { PanierView } from '@/components/boutique/PanierView'
import { getGlobal, getPayloadClient } from '@/lib/payload'

// Le contenu du panier vit dans le navigateur ; la page ne fournit que les réglages
// et le catalogue à jour (prix et stock) pour prévenir avant le paiement.
export const dynamic = 'force-static'
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Panier',
  robots: { index: false, follow: true },
}

export default async function Page() {
  const payload = await getPayloadClient()
  const [reglages, produits] = await Promise.all([
    getGlobal('page-boutique', 1),
    payload.find({ collection: 'produits', where: { actif: { equals: true } }, limit: 200, depth: 0, pagination: false }),
  ])
  return (
    <>
      <Bandeau surtitre={reglages.panier?.titre || 'Ton inventaire'} titre="Ton panier" etape={1} chevauchement />
      <div className="kk-container relative -mt-[clamp(64px,7vw,88px)] pb-[clamp(64px,8vw,96px)]">
        <PanierView reglages={{ panier: reglages.panier, arrondi: reglages.arrondi, colissimo: reglages.colissimo }} produits={produits.docs.map(versCatalogue)} />
      </div>
    </>
  )
}
