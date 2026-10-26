// Webhook Stripe : source de vérité des paiements de la boutique.
// Événements à activer dans le Dashboard Stripe : checkout.session.completed,
// checkout.session.async_payment_succeeded, checkout.session.async_payment_failed,
// checkout.session.expired.
import type Stripe from 'stripe'
import { annulerParSession, marquerDiffere } from '@/lib/boutique/commandes'
import { confirmerPaiement } from '@/lib/boutique/paiement'
import { getStripe } from '@/lib/boutique/stripe'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return new Response('Webhook non configuré', { status: 500 })
  const signature = request.headers.get('stripe-signature')
  if (!signature) return new Response('Signature absente', { status: 400 })

  const corps = await request.text()
  let event: Stripe.Event
  try {
    event = await getStripe().webhooks.constructEventAsync(corps, signature, secret)
  } catch {
    return new Response('Signature invalide', { status: 400 })
  }

  const payload = await getPayloadClient()
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object
        if (s.payment_status === 'paid' || s.payment_status === 'no_payment_required') await confirmerPaiement(payload, s, { reprise: true })
        else await marquerDiffere(payload, s.id)
        break
      }
      case 'checkout.session.async_payment_succeeded':
        await confirmerPaiement(payload, event.data.object, { reprise: true })
        break
      case 'checkout.session.async_payment_failed':
      case 'checkout.session.expired':
        await annulerParSession(payload, event.data.object.id)
        break
      default:
        break
    }
  } catch (err) {
    console.error(`[webhook] échec du traitement de ${event.type}`, err)
    return new Response('Erreur de traitement', { status: 500 }) // Stripe réessaiera
  }
  return new Response(null, { status: 200 })
}
