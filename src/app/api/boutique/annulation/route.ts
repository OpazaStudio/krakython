// Bouton « retour » sur la page de paiement Stripe : on ferme la session et on rend le stock
// tout de suite, puis on affiche la page « Paiement annulé ».
import { NextResponse, type NextRequest } from 'next/server'
import { abandonnerPaiement, COOKIE_PAIEMENT, sessionStripeValide } from '@/lib/boutique/paiement'
import { autorise } from '@/lib/limite'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id')
  const cible = new URL('/commande/annulee', request.nextUrl)
  if (sessionStripeValide(sessionId)) {
    cible.searchParams.set('session_id', sessionId)
    if (await autorise('retour')) {
      try {
        await abandonnerPaiement(await getPayloadClient(), sessionId)
      } catch (err) {
        console.error('[annulation] impossible', err)
      }
    }
  }
  const res = NextResponse.redirect(cible, 303)
  res.cookies.delete(COOKIE_PAIEMENT)
  return res
}
