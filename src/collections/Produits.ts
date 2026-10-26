import type { CollectionBeforeChangeHook, CollectionConfig, Where } from 'payload'
import { authenticated } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'

const paths = (doc: { slug?: string }) => ['/', '/boutique', '/panier', '/commande', ...(doc?.slug ? [`/boutique/${doc.slug}`] : [])]

export const CATEGORIES_PRODUIT = [
  { label: 'Textile', value: 'textile' },
  { label: 'Accessoires', value: 'accessoires' },
  { label: 'Goodies', value: 'goodies' },
] as const

export const ILLUSTRATIONS = [
  { label: 'T-shirt', value: 'tshirt' },
  { label: 'Sweat à capuche', value: 'sweat' },
  { label: 'Casquette', value: 'casquette' },
  { label: 'Mug', value: 'mug' },
  { label: 'Tapis de souris', value: 'tapis' },
  { label: 'Tote bag', value: 'tote' },
  { label: 'Stickers', value: 'stickers' },
  { label: 'Porte-clés', value: 'porte-cles' },
] as const

// Le stock bouge tout seul avec les ventes : un formulaire ouvert depuis un moment le renverrait
// périmé. Le champ « Stock » est donc en lecture seule ; l'asso passe par « Ajouter au stock »
// (± n), appliqué ici sur la valeur fraîche lue en base puis remis à vide (jamais conservé). Le seed et les scripts peuvent écrire
// le stock directement avec le contexte `stockDirect`.
const ajuster = (actuel: number | null | undefined, ajout: unknown): number | null => {
  const n = Number(ajout)
  if (ajout == null || ajout === '' || !Number.isFinite(n) || n === 0) return actuel ?? null
  return Math.max(0, (actuel ?? 0) + Math.trunc(n))
}

const appliquerAjoutsStock: CollectionBeforeChangeHook = ({ data, originalDoc, operation, req }) => {
  if (req.context?.stockDirect) return data
  const original = operation === 'update' ? originalDoc : undefined
  const ajoutProduit = data.ajoutStock
  data.stock = original ? ajuster(original.stock, ajoutProduit) : ajoutProduit != null && ajoutProduit !== '' ? ajuster(null, ajoutProduit) : (data.stock ?? null)
  if (Array.isArray(data.tailles)) {
    data.tailles = data.tailles.map((t: { id?: string; stock?: number | null; ajout?: unknown }) => {
      const avant = original?.tailles?.find((o: { id?: string }) => o.id && o.id === t.id)
      const stock = avant ? ajuster(avant.stock, t.ajout) : t.ajout != null && t.ajout !== '' ? ajuster(null, t.ajout) : operation === 'create' ? (t.stock ?? null) : null
      return { ...t, stock, ajout: null }
    })
  }
  data.ajoutStock = null
  return data
}

const lectureProduits = ({ req }: { req: { user?: unknown } }): boolean | Where => (req.user ? true : { actif: { equals: true } })

export const Produits: CollectionConfig = {
  slug: 'produits',
  typescript: { interface: 'Produit' },
  labels: { singular: 'Produit', plural: 'Produits' },
  admin: {
    useAsTitle: 'nom',
    defaultColumns: ['nom', 'categorie', 'prix', 'actif', 'ordre'],
    group: 'Boutique',
    description: 'Le catalogue de la boutique. Un produit désactivé disparaît du site mais reste dans les anciennes commandes.',
    livePreview: { url: ({ data }) => `/boutique/${data?.slug ?? ''}` },
  },
  access: { create: authenticated, delete: authenticated, read: lectureProduits, update: authenticated },
  defaultSort: 'ordre',
  hooks: {
    beforeChange: [appliquerAjoutsStock],
    afterChange: [revalidateCollection(paths)],
    afterDelete: [revalidateCollectionDelete(paths)],
  },
  fields: [
    { name: 'nom', label: 'Nom', type: 'text', required: true },
    { name: 'actif', label: 'En vente', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'enAvant', label: 'Sur l’accueil', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Les 4 premiers produits cochés apparaissent sur l’accueil.' } },
    slugField('nom'),
    { name: 'categorie', label: 'Catégorie', type: 'select', required: true, defaultValue: 'textile', options: [...CATEGORIES_PRODUIT], admin: { position: 'sidebar' } },
    { name: 'ordre', label: 'Ordre', type: 'number', defaultValue: 10, admin: { position: 'sidebar' } },
    {
      type: 'row',
      fields: [
        {
          name: 'prix',
          label: 'Prix (€ TTC)',
          type: 'number',
          required: true,
          min: 0.5,
          admin: { width: '33%', step: 0.5, placeholder: '25' },
        },
        { name: 'sousTitre', label: 'Petite ligne sous le nom', type: 'text', admin: { width: '67%', placeholder: 'Unisexe · bleu Krakython · S à XXL' } },
      ],
    },
    { name: 'badge', label: 'Pastille (facultatif)', type: 'text', admin: { placeholder: 'Édition 2026' } },
    {
      name: 'photos',
      label: 'Photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'La première photo sert de vignette. Sans photo, le site affiche l’illustration choisie ci-dessous.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'illustration', label: 'Illustration de secours', type: 'select', defaultValue: 'tshirt', options: [...ILLUSTRATIONS], admin: { width: '50%' } },
        {
          name: 'fond',
          label: 'Couleur de fond',
          type: 'select',
          defaultValue: 'bleu',
          options: [
            { label: 'Bleu clair', value: 'bleu' },
            { label: 'Rose pâle', value: 'rose' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'description', label: 'Description', type: 'richText' },
    {
      name: 'tailles',
      label: 'Tailles et stock',
      labels: { singular: 'Taille', plural: 'Tailles' },
      type: 'array',
      admin: {
        description: 'Une ligne par taille. Pour le stock, utilisez « Ajouter au stock » (vide partout = illimité). Laisser la liste vide pour un produit sans taille (mug, stickers…).',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'taille', label: 'Taille', type: 'text', required: true, admin: { width: '34%', placeholder: 'M' } },
            { name: 'stock', label: 'Stock actuel', type: 'number', min: 0, admin: { width: '33%', readOnly: true, description: 'Vide = illimité. Baisse tout seul à chaque vente.' } },
            {
              name: 'ajout',
              label: 'Ajouter au stock',
              type: 'number',
              admin: { width: '33%', placeholder: '+10', description: 'Ex. 10 pour en ajouter dix, -2 pour en retirer.' },
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      admin: { condition: (data) => !Array.isArray(data?.tailles) || data.tailles.length === 0 },
      fields: [
        {
          name: 'stock',
          label: 'Stock actuel',
          type: 'number',
          min: 0,
          admin: { width: '50%', readOnly: true, description: 'Pour un produit sans taille. Vide = illimité. Baisse tout seul à chaque vente.' },
        },
        {
          name: 'ajoutStock',
          label: 'Ajouter au stock',
          type: 'number',
          admin: { width: '50%', placeholder: '+10', description: 'Ex. 10 pour en ajouter dix, -2 pour en retirer.' },
        },
      ],
    },
  ],
}
