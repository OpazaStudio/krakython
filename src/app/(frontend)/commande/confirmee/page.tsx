import type { Metadata } from 'next'
import { Bandeau, Etapes } from '@/components/boutique/Bandeau'
import { Recu } from '@/components/boutique/Recu'
import { ViderPanier } from '@/components/boutique/ViderPanier'
import { Anneaux, LogoKraken } from '@/components/decor'
import { Fleche } from '@/components/icones'
import { Bouton, PastilleNoire } from '@/components/ui'
import { etatApresPaiement } from '@/lib/boutique/paiement'
import { getGlobal, getPayloadClient, getSite } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Ta commande',
  robots: { index: false, follow: false },
}

type Props = { searchParams: Promise<{ session_id?: string | string[] }> }

/** Identifiant de session Stripe Checkout plausible (évite d'interroger Stripe pour rien). */
const sessionValide = (s: unknown): s is string => typeof s === 'string' && /^cs_[A-Za-z0-9_]{8,250}$/.test(s)

export default async function Page({ searchParams }: Props) {
  const { session_id } = await searchParams
  const session = sessionValide(session_id) ? session_id : null
  const [payload, reglages, site] = await Promise.all([getPayloadClient(), getGlobal('page-boutique', 1), getSite()])
  const commande = session ? await etatApresPaiement(payload, session) : null

  if (!session || !commande || commande.statut === 'annulee') {
    return (
      <>
        <Bandeau surtitre="Erreur 404 de quête" titre="Commande introuvable" couleur="nuit" texte="Ce lien ne correspond à aucune commande en cours. Il a peut-être expiré, ou le paiement a été annulé." />
        <div className="kk-container flex flex-col items-start gap-6 py-[clamp(48px,6vw,80px)]">
          <p className="kk-lead m-0 max-w-[640px]">
            Si tu as été débité, pas de panique : écris-nous
            {site.email ? (
              <>
                {' '}
                à{' '}
                <a href={`mailto:${site.email}`} className="font-black">
                  {site.email}
                </a>
              </>
            ) : null}{' '}
            avec la date et le montant, on retrouve ta commande.
          </p>
          <div className="flex flex-wrap gap-4">
            <Bouton href="/panier" variante="don">
              Revoir mon panier
            </Bouton>
            <Bouton href="/boutique">Retour à la boutique</Bouton>
          </div>
        </div>
      </>
    )
  }

  const enAttente = commande.statut === 'en_attente'

  return (
    <>
      <ViderPanier session={session} />
      {enAttente ? (
        <Bandeau
          surtitre="Chargement…"
          titre="Paiement en cours de vérification"
          couleur="nuit"
          etape={3}
          chevauchement
          texte="Ta banque n’a pas encore confirmé le paiement. Dès que c’est bon, tu reçois un e-mail de confirmation : rien à refaire de ton côté."
        />
      ) : (
        <section aria-labelledby="page-titre" className="relative overflow-hidden border-b-[3px] border-encre bg-bleu">
          <Anneaux />
          <div className="kk-container relative flex flex-col items-center gap-5 pt-[clamp(40px,6vw,72px)] pb-[clamp(110px,12vw,150px)] text-center">
            <div className="relative size-[clamp(150px,20vw,200px)]">
              <div className="absolute inset-0 rounded-full border-[3px] border-encre bg-white shadow-dur-8" />
              <div className="absolute inset-[12%] animate-bob">
                <LogoKraken priority taille={160} className="size-full object-contain" />
              </div>
              <span aria-hidden="true" className="kk-display absolute -right-5 bottom-2 -rotate-[10deg] rounded-xl border-[3px] border-encre bg-rose-bouton px-3.5 py-1.5 text-[30px] leading-none text-white shadow-dur-4">
                GG
              </span>
            </div>
            <PastilleNoire className="!self-center">Quête accomplie</PastilleNoire>
            <h1 id="page-titre" className="kk-h1 max-w-[900px] !text-[clamp(42px,6vw,84px)]">
              {reglages.confirmation?.titre || 'GG, commande validée !'}
            </h1>
            {reglages.confirmation?.texte && <p className="m-0 max-w-[640px] text-[clamp(17px,1.6vw,20px)] leading-[1.5] font-extrabold text-white">{reglages.confirmation.texte}</p>}
            <Etapes courante={4} />
          </div>
        </section>
      )}

      <div className="kk-container relative -mt-[clamp(64px,7vw,96px)] pb-[clamp(64px,8vw,96px)]">
        <div className="mx-auto flex max-w-[760px] flex-col gap-7">
          <Recu commande={commande} reglages={reglages} />
          <div className="flex flex-wrap justify-center gap-4">
            {enAttente ? (
              <Bouton href={`/commande/confirmee?session_id=${encodeURIComponent(session)}`} variante="don">
                Actualiser
              </Bouton>
            ) : (
              <Bouton href="/boutique" variante="don">
                Retour à la boutique
                <Fleche size={20} />
              </Bouton>
            )}
            <Bouton href="/">Accueil du Krakython</Bouton>
          </div>
          {site.email && (
            <p className="m-0 text-center text-[15px] font-bold text-gris">
              Une question sur ta commande ? Écris-nous à{' '}
              <a href={`mailto:${site.email}`} className="font-black">
                {site.email}
              </a>{' '}
              en rappelant le numéro {commande.numero}.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
