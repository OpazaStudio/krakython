import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'

const paths = ['/', '/qui-sommes-nous']

export const Editions: CollectionConfig = {
  slug: 'editions',
  typescript: { interface: 'Edition' },
  labels: { singular: 'Édition', plural: 'Éditions' },
  admin: {
    useAsTitle: 'titre',
    defaultColumns: ['titre', 'periode', 'montant', 'debut'],
    group: 'Contenu',
    description: 'Le « journal de quête » de la page Qui sommes-nous : une entrée par édition passée. Le total récolté se calcule tout seul.',
    livePreview: { url: '/qui-sommes-nous' },
  },
  access: { create: authenticated, delete: authenticated, read: anyone, update: authenticated },
  defaultSort: 'debut',
  hooks: {
    afterChange: [revalidateCollection(paths)],
    afterDelete: [revalidateCollectionDelete(paths)],
  },
  fields: [
    { name: 'titre', label: 'Titre', type: 'text', required: true, admin: { placeholder: 'Le tout premier Krakython' } },
    {
      type: 'row',
      fields: [
        { name: 'periode', label: 'Dates affichées', type: 'text', required: true, admin: { width: '50%', placeholder: '17 → 19 déc. 2021' } },
        {
          name: 'debut',
          label: 'Date de début (pour le tri)',
          type: 'date',
          required: true,
          admin: { width: '50%', date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
        },
      ],
    },
    { name: 'montant', label: 'Montant récolté (€)', type: 'number', min: 0, admin: { description: 'Laisser vide si le montant n’est pas encore confirmé.' } },
    { name: 'texte', label: 'Résumé', type: 'textarea', required: true },
  ],
}
