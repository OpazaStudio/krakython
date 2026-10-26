import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'

const paths = ['/', '/nos-partenaires']

export const Partenaires: CollectionConfig = {
  slug: 'partenaires',
  typescript: { interface: 'Partenaire' },
  labels: { singular: 'Partenaire', plural: 'Partenaires' },
  admin: {
    useAsTitle: 'nom',
    defaultColumns: ['nom', 'role', 'ordre'],
    group: 'Contenu',
    description: 'Les structures qui soutiennent le Krakython (page Nos partenaires et bas de l’accueil).',
    livePreview: { url: '/nos-partenaires' },
  },
  access: { create: authenticated, delete: authenticated, read: anyone, update: authenticated },
  defaultSort: 'ordre',
  hooks: {
    afterChange: [revalidateCollection(paths)],
    afterDelete: [revalidateCollectionDelete(paths)],
  },
  fields: [
    { name: 'nom', label: 'Nom', type: 'text', required: true },
    { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'role', label: 'Ce qu’il apporte (accueil)', type: 'text', required: true, admin: { width: '50%', placeholder: 'Prêt de matériel' } },
        { name: 'etiquette', label: 'Étiquette (page partenaires)', type: 'text', admin: { width: '50%', placeholder: 'Matériel' } },
      ],
    },
    { name: 'badge', label: 'Pastille sur le logo (facultatif)', type: 'text', admin: { placeholder: 'Depuis la 1re édition' } },
    { name: 'texte', label: 'Présentation', type: 'textarea', required: true },
    {
      name: 'liens',
      label: 'Liens',
      labels: { singular: 'Lien', plural: 'Liens' },
      type: 'array',
      maxRows: 4,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'texte', label: 'Texte', type: 'text', required: true, admin: { width: '40%', placeholder: 'Leur site' } },
            { name: 'url', label: 'Adresse', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
      ],
    },
    { name: 'ordre', label: 'Ordre', type: 'number', defaultValue: 10, admin: { position: 'sidebar' } },
  ],
}
