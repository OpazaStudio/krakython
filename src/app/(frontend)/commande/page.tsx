import type { Metadata } from 'next'
import { Bandeau } from '@/components/boutique/Bandeau'
import { versCatalogue } from '@/components/boutique/catalogue'
import { CommandeForm } from '@/components/boutique/CommandeForm'
import { getGlobal, getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-static'
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Commande',
  robots: { index: false, follow: false },
}

export default async function Page() {
  const payload = await getPayloadClient()
  const [reglages, produits] = await Promise.all([
    getGlobal('page-boutique', 1),
    payload.find({ collection: 'produits', where: { actif: { equals: true } }, limit: 200, depth: 0, pagination: false }),
  ])
  return (
    <>
      <Bandeau surtitre="Presque fini" titre="Valide ta commande" texte="Encore deux infos et ton loot part en préparation." etape={2} chevauchement />
      <div className="kk-container relative -mt-[clamp(64px,7vw,88px)] pb-[clamp(64px,8vw,96px)]">
        <CommandeForm
          reglages={{ colissimo: reglages.colissimo, retrait: reglages.retrait, arrondi: reglages.arrondi, panier: reglages.panier }}
          produits={produits.docs.map(versCatalogue)}
        />
      </div>
    </>
  )
}
