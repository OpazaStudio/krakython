import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'

const paths = ['/ils-parlent-de-nous']

export const Presse: CollectionConfig = {
  slug: 'presse',
  typescript: { interface: 'ArticlePresse' },
  labels: { singular: 'Article de presse', plural: 'Presse' },
  admin: {
    useAsTitle: 'titre',
    defaultColumns: ['titre', 'media', 'rubrique', 'date'],
    group: 'Contenu',
    description: 'Les médias qui parlent du Krakython et les articles de la Fédération (page Ils parlent de nous).',
    livePreview: { url: '/ils-parlent-de-nous' },
  },
  access: { create: authenticated, delete: authenticated, read: anyone, update: authenticated },
  defaultSort: '-date',
  hooks: {
    afterChange: [revalidateCollection(paths)],
    afterDelete: [revalidateCollectionDelete(paths)],
  },
  fields: [
    {
      name: 'rubrique',
      label: 'Rubrique',
      type: 'select',
      required: true,
      defaultValue: 'media',
      options: [
        { label: 'Médias (grande carte)', value: 'media' },
        { label: 'Côté Fédération (liste)', value: 'federation' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'media', label: 'Média', type: 'text', required: true, admin: { placeholder: 'France Info' } },
    {
      name: 'titre',
      label: 'Titre',
      type: 'text',
      required: true,
      admin: { description: 'Médias : la ligne « Succès débloqué » en haut de page (ex. « Reportage sur France Info »). Fédération : le titre de l’article.' },
    },
    { name: 'sousTitre', label: 'Type et support', type: 'text', admin: { placeholder: 'Télé · France 3 Nouvelle-Aquitaine', condition: (d) => d?.rubrique !== 'federation' } },
    {
      type: 'row',
      fields: [
        { name: 'date', label: 'Date de parution', type: 'date', required: true, admin: { width: '50%', date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } } },
        { name: 'dateTexte', label: 'Date affichée (facultatif)', type: 'text', admin: { width: '50%', placeholder: 'Juin 2023' } },
      ],
    },
    { name: 'extrait', label: 'Extrait ou citation', type: 'textarea', admin: { condition: (d) => d?.rubrique !== 'federation' } },
    {
      type: 'row',
      fields: [
        { name: 'lien', label: 'Lien', type: 'text', admin: { width: '60%', placeholder: 'https://…' } },
        { name: 'bouton', label: 'Texte du bouton', type: 'text', defaultValue: 'Lire l’article', admin: { width: '40%' } },
      ],
    },
    {
      name: 'videos',
      label: 'Vidéos',
      labels: { singular: 'Vidéo', plural: 'Vidéos' },
      type: 'array',
      admin: { condition: (d) => d?.rubrique !== 'federation', description: 'Pour un reportage vidéo : les liens YouTube s’affichent en vignettes.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'titre', label: 'Titre', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'url', label: 'Lien', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
      ],
    },
  ],
}
