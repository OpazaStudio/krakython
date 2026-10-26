import type { CollectionConfig } from 'payload'
import type { Where } from 'payload'
import { authenticated } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'

const paths = (doc: { slug?: string }) => ['/', '/actualites', ...(doc?.slug ? [`/actualites/${doc.slug}`] : [])]

export const CATEGORIES_ACTU = [
  { label: 'Événement', value: 'evenement', pluriel: 'Événements' },
  { label: 'Partenaires', value: 'partenaire', pluriel: 'Partenaires' },
  { label: 'L’asso', value: 'asso', pluriel: 'L’asso' },
] as const

export const Actualites: CollectionConfig = {
  slug: 'actualites',
  typescript: { interface: 'Actualite' },
  labels: { singular: 'Actualité', plural: 'Actualités' },
  admin: {
    useAsTitle: 'titre',
    defaultColumns: ['titre', 'categorie', 'date', 'publie'],
    group: 'Contenu',
    description: 'Les articles de la page Actualités. Les trois derniers publiés apparaissent aussi sur la page.',
    livePreview: { url: ({ data }) => `/actualites/${data?.slug ?? ''}` },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    // Les brouillons ne sont visibles que de l'équipe connectée (API REST et GraphQL comprises).
    read: ({ req }): boolean | Where => (req.user ? true : { publie: { equals: true } }),
    update: authenticated,
  },
  defaultSort: '-date',
  hooks: {
    afterChange: [revalidateCollection(paths)],
    afterDelete: [revalidateCollectionDelete(paths)],
  },
  fields: [
    { name: 'titre', label: 'Titre', type: 'text', required: true },
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
    },
    { name: 'publie', label: 'Publiée', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'aLaUne', label: 'À la une', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Mise en avant en grand en haut de la page Actualités.' } },
    slugField('titre'),
    { name: 'categorie', label: 'Catégorie', type: 'select', required: true, defaultValue: 'evenement', options: CATEGORIES_ACTU.map(({ label, value }) => ({ label, value })), admin: { position: 'sidebar' } },
    { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' },
    {
      name: 'etiquette',
      label: 'Texte de la vignette sans image',
      type: 'text',
      admin: { description: 'Affiché en grand sur la vignette quand l’article n’a pas d’image. Ex. « J-30 ».', condition: (data) => !data?.image },
    },
    { name: 'resume', label: 'Résumé', type: 'textarea', required: true, admin: { description: 'Une ou deux phrases affichées dans la liste des actualités.' } },
    { name: 'contenu', label: 'Texte', type: 'richText' },
  ],
}
