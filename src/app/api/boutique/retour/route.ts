// Retour de Stripe après paiement : filet de sécurité si le webhook n'est pas encore arrivé
// (ou absent en local). Idempotent ; le webhook reste la référence.
import { NextResponse, type NextRequest } from 'next/server'
import { COOKIE_PAIEMENT, confirmerPaiement, sessionStripeValide } from '@/lib/boutique/paiement'
import { getStripe } from '@/lib/boutique/stripe'
import { autorise } from '@/lib/limite'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id')
  const cible = new URL('/commande/confirmee', request.nextUrl)
  if (!sessionStripeValide(sessionId)) return NextResponse.redirect(cible, 303)
  cible.searchParams.set('session_id', sessionId)

  if (await autorise('retour')) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId)
      if (session.payment_status === 'paid' || session.payment_status === 'no_payment_required') await confirmerPaiement(await getPayloadClient(), session)
    } catch (err) {
      console.error('[retour] vérification Stripe impossible', err)
    }
  }
  const res = NextResponse.redirect(cible, 303)
  res.cookies.delete(COOKIE_PAIEMENT)
  return res
}
