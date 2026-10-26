import { APIError, type CollectionAfterChangeHook, type CollectionBeforeChangeHook, type CollectionConfig } from 'payload'
import { authenticated } from '@/access'
import { revalidateCollection } from '@/hooks/revalidate'
import { executeurDe, rendreStockCommande } from '@/lib/boutique/stock'
import { MODE_LABELS, MODES_LIVRAISON, peutPasser, STATUT_LABELS, STATUTS, type ModeLivraison, type Statut } from '@/lib/boutique/statuts'

// Garde-fou du cycle de vie : l'admin ne peut pas revenir en arrière (ex. « Expédiée » → « Payée »)
// ni marquer « Payée » à la main une commande que Stripe n'a pas confirmée.
const controlerStatut: CollectionBeforeChangeHook = async ({ data, originalDoc, operation, req }) => {
  if (operation !== 'update' || !originalDoc) return data
  const de = originalDoc.statut as Statut
  const vers = (data.statut ?? de) as Statut
  const mode = (originalDoc.livraison?.mode ?? 'colissimo') as ModeLivraison
  const systeme = Boolean(req.context?.systeme)

  if (vers !== de) {
    if (!peutPasser(de, vers, mode)) {
      throw new APIError(`Passage impossible de « ${STATUT_LABELS[de]} » à « ${STATUT_LABELS[vers]} ».`, 400, undefined, true)
    }
    if (de === 'en_attente' && vers === 'payee' && !systeme) {
      throw new APIError('Une commande passe en « Payée » automatiquement quand Stripe confirme le paiement.', 400, undefined, true)
    }
    if (vers === 'annulee' && !systeme) data.annuleePar = 'admin'
  }
  return data
}

// Une fois l'annulation enregistrée (dans la même transaction) : stock rendu, et paiement Stripe
// encore ouvert fermé pour que le client ne puisse plus payer une commande annulée.
const apresAnnulation: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  if (operation !== 'update' || previousDoc?.statut === 'annulee' || doc.statut !== 'annulee') return doc
  await rendreStockCommande(req.payload, doc.id, doc.lignes, await executeurDe(req.payload, req))
  const session = doc.paiement?.sessionId as string | undefined
  if (previousDoc?.statut === 'en_attente' && session && process.env.STRIPE_SECRET_KEY) {
    void import('@/lib/boutique/stripe')
      .then(({ getStripe }) => getStripe().checkout.sessions.expire(session))
      .catch(() => {})
  }
  return doc
}

const lectureSeule = { readOnly: true }

export const Commandes: CollectionConfig = {
  slug: 'commandes',
  typescript: { interface: 'Commande' },
  labels: { singular: 'Commande', plural: 'Commandes' },
  admin: {
    useAsTitle: 'numero',
    defaultColumns: ['numero', 'statut', 'clientNom', 'total', 'createdAt'],
    group: 'Boutique',
    listSearchableFields: ['numero', 'clientNom', 'clientEmail'],
    description:
      'Les commandes passées sur la boutique. Changez le statut au fil de la préparation. Annuler une commande remet les articles en stock mais ne rembourse pas : le remboursement se fait depuis le Dashboard Stripe.',
  },
  access: { create: () => false, delete: () => false, read: authenticated, update: authenticated },
  defaultSort: '-createdAt',
  hooks: {
    beforeChange: [controlerStatut],
    afterChange: [apresAnnulation, revalidateCollection(['/boutique'])],
  },
  fields: [
    { name: 'numero', label: 'N° de commande', type: 'text', required: true, unique: true, index: true, admin: lectureSeule },
    {
      name: 'statut',
      label: 'Statut',
      type: 'select',
      required: true,
      defaultValue: 'en_attente',
      index: true,
      options: STATUTS.map((value) => ({ label: STATUT_LABELS[value], value })),
      admin: { position: 'sidebar' },
    },
    {
      name: 'numeroSuivi',
      label: 'N° de suivi Colissimo',
      type: 'text',
      admin: { position: 'sidebar', condition: (data) => data?.livraison?.mode === 'colissimo' },
    },
    { name: 'note', label: 'Note interne', type: 'textarea', admin: { position: 'sidebar', description: 'Visible seulement dans l’admin.' } },
    {
      type: 'row',
      fields: [
        { name: 'clientNom', label: 'Nom', type: 'text', required: true, admin: { ...lectureSeule, width: '34%' } },
        { name: 'clientEmail', label: 'E-mail', type: 'email', required: true, index: true, admin: { ...lectureSeule, width: '33%' } },
        { name: 'clientTelephone', label: 'Téléphone', type: 'text', admin: { ...lectureSeule, width: '33%' } },
      ],
    },
    {
      name: 'livraison',
      label: 'Livraison',
      type: 'group',
      admin: lectureSeule,
      fields: [
        { name: 'mode', label: 'Mode', type: 'select', required: true, options: MODES_LIVRAISON.map((value) => ({ label: MODE_LABELS[value], value })) },
        { name: 'adresse', label: 'Adresse', type: 'text' },
        {
          type: 'row',
          fields: [
            { name: 'codePostal', label: 'Code postal', type: 'text', admin: { width: '30%' } },
            { name: 'ville', label: 'Ville', type: 'text', admin: { width: '70%' } },
          ],
        },
      ],
    },
    {
      name: 'lignes',
      label: 'Articles',
      labels: { singular: 'Article', plural: 'Articles' },
      type: 'array',
      admin: lectureSeule,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'nom', label: 'Produit', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'taille', label: 'Taille', type: 'text', admin: { width: '15%' } },
            { name: 'quantite', label: 'Qté', type: 'number', required: true, admin: { width: '15%' } },
            { name: 'prixUnitaire', label: 'Prix unitaire (€)', type: 'number', required: true, admin: { width: '30%' } },
          ],
        },
        { name: 'produit', label: 'Fiche produit', type: 'relationship', relationTo: 'produits' },
        { name: 'tailleId', type: 'text', admin: { hidden: true } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'sousTotal', label: 'Articles (€)', type: 'number', required: true, admin: { ...lectureSeule, width: '25%' } },
        { name: 'fraisLivraison', label: 'Livraison (€)', type: 'number', required: true, defaultValue: 0, admin: { ...lectureSeule, width: '25%' } },
        { name: 'donSolidaire', label: 'Don solidaire (€)', type: 'number', defaultValue: 0, admin: { ...lectureSeule, width: '25%' } },
        { name: 'total', label: 'Total payé (€)', type: 'number', required: true, admin: { ...lectureSeule, width: '25%' } },
      ],
    },
    {
      name: 'paiement',
      label: 'Paiement Stripe',
      type: 'group',
      admin: lectureSeule,
      fields: [
        { name: 'sessionId', label: 'Session Checkout', type: 'text', unique: true, index: true },
        { name: 'paymentIntent', label: 'Paiement', type: 'text' },
        { name: 'differe', label: 'Paiement différé en cours (virement, prélèvement…)', type: 'checkbox', defaultValue: false },
        { name: 'payeLe', label: 'Payée le', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    { name: 'stockReserve', type: 'checkbox', defaultValue: false, admin: { hidden: true } },
    {
      name: 'annuleePar',
      type: 'select',
      options: [
        { label: 'Système', value: 'systeme' },
        { label: 'Admin', value: 'admin' },
      ],
      admin: { hidden: true },
    },
    { name: 'emailsEnvoyes', type: 'checkbox', defaultValue: false, admin: { hidden: true } },
  ],
}
