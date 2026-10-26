import type { Metadata } from 'next'
import { Bandeau } from '@/components/boutique/Bandeau'
import { LogoKraken } from '@/components/decor'
import { Fleche, Panier } from '@/components/icones'
import { Bouton } from '@/components/ui'
import { trouverParSession } from '@/lib/boutique/commandes'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Paiement annulé',
  robots: { index: false, follow: false },
}

type Props = { searchParams: Promise<{ session_id?: string | string[] }> }

const sessionValide = (s: unknown): s is string => typeof s === 'string' && /^cs_[A-Za-z0-9_]{8,250}$/.test(s)

export default async function Page({ searchParams }: Props) {
  const { session_id } = await searchParams
  const session = sessionValide(session_id) ? session_id : null
  let dejaPayee = false
  if (session) {
    // La session Stripe a déjà été fermée et le stock rendu par /api/boutique/annulation.
    const payload = await getPayloadClient()
    const commande = await trouverParSession(payload, session)
    dejaPayee = Boolean(commande && commande.statut !== 'en_attente' && commande.statut !== 'annulee')
  }

  if (dejaPayee && session) {
    return (
      <>
        <Bandeau surtitre="Pas de panique" titre="Cette commande est déjà réglée" couleur="bleu" texte="Le paiement est bien passé avant l’annulation : ta commande est validée." />
        <div className="kk-container flex flex-wrap gap-4 py-[clamp(48px,6vw,80px)]">
          <Bouton href={`/commande/confirmee?session_id=${encodeURIComponent(session)}`} variante="don">
            Voir ma commande
            <Fleche size={20} />
          </Bouton>
          <Bouton href="/boutique">Retour à la boutique</Bouton>
        </div>
      </>
    )
  }

  return (
    <>
      <Bandeau surtitre="Partie en pause" titre="Paiement annulé" couleur="rose" etape={3} chevauchement texte="Rien n’a été débité. Tu peux reprendre ta commande quand tu veux." />
      <div className="kk-container relative -mt-[clamp(64px,7vw,88px)] pb-[clamp(64px,8vw,96px)]">
        <div className="mx-auto flex max-w-[680px] flex-col items-center gap-5 rounded-[28px] border-[3px] border-encre bg-white px-6 py-[clamp(32px,5vw,56px)] text-center shadow-dur-8">
          <div className="relative size-[130px]">
            <div className="absolute inset-0 rounded-full border-[3px] border-encre bg-rose-clair" />
            <div className="absolute inset-[12%] animate-bob">
              <LogoKraken taille={100} className="size-full object-contain" />
            </div>
          </div>
          <h2 className="kk-display m-0 text-[clamp(30px,4vw,42px)] leading-none font-normal">Ton panier t’attend</h2>
          <p className="m-0 max-w-[460px] text-[18px] font-bold text-gris">Tes articles sont toujours dans ton inventaire. Attention : tant que la commande n’est pas payée, ils ne te sont pas réservés.</p>
          <div className="flex flex-wrap justify-center gap-4 pt-1">
            <Bouton href="/panier" variante="don">
              <Panier size={20} />
              Retour au panier
            </Bouton>
            <Bouton href="/boutique">Continuer mes achats</Bouton>
          </div>
        </div>
      </div>
    </>
  )
}
