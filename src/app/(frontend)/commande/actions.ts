'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import * as z from 'zod'
import { autorise } from '@/lib/limite'
import { annulerCommandeEnAttente, creerCommande, ErreurCommande } from '@/lib/boutique/commandes'
import { abandonnerPaiement, COOKIE_PAIEMENT, creerSessionPaiement, revaliderBoutique, sessionStripeValide } from '@/lib/boutique/paiement'
import { getPayloadClient } from '@/lib/payload'

export type EtatPaiement = { erreur: string } | undefined

const LignesSchema = z
  .array(
    z.object({
      produitId: z.number().int().positive(),
      tailleId: z.string().trim().min(1).max(64).nullable(),
      quantite: z.number().int().min(1).max(10),
    }),
  )
  .min(1, { error: 'Ton panier est vide.' })
  .max(30)

const Base = z.object({
  nom: z.string().trim().min(2, { error: 'Ton nom est requis.' }).max(120),
  email: z.email({ error: 'Adresse e-mail invalide.' }),
  cgv: z.literal('on', { error: 'Merci d’accepter les conditions générales de vente.' }),
  arrondi: z.literal('on').optional(),
})

const Colissimo = Base.extend({
  mode: z.literal('colissimo'),
  telephone: z.string().trim().min(6, { error: 'Ton téléphone est requis (suivi Colissimo).' }).max(25),
  adresse: z.string().trim().min(4, { error: 'Ton adresse est requise.' }).max(200),
  codePostal: z
    .string()
    .trim()
    .regex(/^\d{5}$/, { error: 'Code postal invalide.' })
    .refine((cp) => !/^9[78]/.test(cp), { error: 'Colissimo : France métropolitaine uniquement.' }),
  ville: z.string().trim().min(1, { error: 'Ta ville est requise.' }).max(100),
})

const Retrait = Base.extend({
  mode: z.literal('retrait'),
  telephone: z.string().trim().max(25).optional(),
})

const ClientSchema = z.discriminatedUnion('mode', [Colissimo, Retrait], { error: 'Choisis un mode de livraison.' })

const CHAMPS = ['mode', 'nom', 'email', 'telephone', 'adresse', 'codePostal', 'ville', 'cgv', 'arrondi'] as const

/**
 * Formulaire de commande → commande « en attente » (stock réservé) → page de paiement Stripe.
 * Le panier envoyé par le navigateur ne contient que des identifiants et des quantités :
 * prix, tailles et stock sont relus en base.
 */
export async function demarrerPaiement(_prev: EtatPaiement, form: FormData): Promise<EtatPaiement> {
  let lignes: z.infer<typeof LignesSchema>
  try {
    lignes = LignesSchema.parse(JSON.parse(String(form.get('panier') ?? '')))
  } catch {
    return { erreur: 'Panier illisible : recharge la page et réessaie.' }
  }
  const brut = Object.fromEntries(CHAMPS.map((k) => [k, (String(form.get(k) ?? '').trim() || undefined) as string | undefined]))
  const client = ClientSchema.safeParse(brut)
  if (!client.success) return { erreur: client.error.issues[0]?.message ?? 'Formulaire incomplet.' }
  if (!(await autorise('paiement'))) return { erreur: 'Trop de tentatives : patiente quelques minutes.' }

  const payload = await getPayloadClient()
  const pot = await cookies()
  // Un paiement précédent resté ouvert (retour arrière depuis Stripe) : on le ferme d'abord
  // pour libérer le stock qu'il réservait.
  const precedente = pot.get(COOKIE_PAIEMENT)?.value
  if (sessionStripeValide(precedente)) {
    try {
      await abandonnerPaiement(payload, precedente)
    } catch (err) {
      console.error('[paiement] fermeture de la session précédente impossible', err)
    }
    pot.delete(COOKIE_PAIEMENT)
  }
  let url: string
  try {
    const { commande, lignes: resolues, montants } = await creerCommande(
      payload,
      {
        nom: client.data.nom,
        email: client.data.email.toLowerCase(),
        telephone: client.data.telephone,
        mode: client.data.mode,
        ...(client.data.mode === 'colissimo' ? { adresse: client.data.adresse, codePostal: client.data.codePostal, ville: client.data.ville } : {}),
      },
      lignes,
      { arrondi: client.data.arrondi === 'on' },
    )
    try {
      const session = await creerSessionPaiement(commande, resolues, montants)
      if (!session.url) throw new Error('Stripe n’a pas renvoyé d’adresse de paiement.')
      await payload.update({ collection: 'commandes', id: commande.id, overrideAccess: true, context: { systeme: true }, data: { paiement: { sessionId: session.id } } })
      pot.set(COOKIE_PAIEMENT, session.id, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60, path: '/' })
      url = session.url
    } catch (err) {
      await annulerCommandeEnAttente(payload, commande.id)
      throw err
    }
    await revaliderBoutique(payload, commande)
  } catch (err) {
    if (err instanceof ErreurCommande) return { erreur: err.message }
    console.error('[paiement] initialisation impossible', err)
    return { erreur: 'Le paiement n’a pas pu démarrer. Réessaie dans un instant.' }
  }
  redirect(url)
}
