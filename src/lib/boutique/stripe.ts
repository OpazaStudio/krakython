import Stripe from 'stripe'

// Clé restreinte (rk_) de préférence, clé secrète (sk_) sinon. Jamais côté navigateur.
let client: Stripe | null = null

export function getStripe(): Stripe {
  if (client) return client
  const cle = process.env.STRIPE_SECRET_KEY
  if (!cle) throw new Error('STRIPE_SECRET_KEY manquante dans l’environnement.')
  client = new Stripe(cle)
  return client
}
