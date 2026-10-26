import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'

const paths = ['/qui-sommes-nous']

export const Membres: CollectionConfig = {
  slug: 'membres',
  typescript: { interface: 'Membre' },
  labels: { singular: 'Membre', plural: 'Équipe' },
  admin: {
    useAsTitle: 'prenom',
    defaultColumns: ['prenom', 'pseudo', 'statut', 'ordre'],
    group: 'Contenu',
    description: 'Les fiches joueurs de la page Qui sommes-nous, dans l’ordre du champ « Ordre ».',
    livePreview: { url: '/qui-sommes-nous' },
  },
  access: { create: authenticated, delete: authenticated, read: anyone, update: authenticated },
  defaultSort: 'ordre',
  hooks: {
    afterChange: [revalidateCollection(paths)],
    afterDelete: [revalidateCollectionDelete(paths)],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'prenom', label: 'Prénom', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'pseudo', label: 'Pseudo', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'photo', label: 'Photo', type: 'upload', relationTo: 'media' },
    { name: 'bio', label: 'Présentation', type: 'textarea', required: true, admin: { description: 'Deux phrases maximum.' } },
    {
      name: 'tags',
      label: 'Jeux et genres préférés',
      labels: { singular: 'Tag', plural: 'Tags' },
      type: 'array',
      maxRows: 4,
      fields: [{ name: 'tag', label: 'Tag', type: 'text', required: true }],
    },
    { name: 'twitch', label: 'Lien de sa chaîne Twitch', type: 'text', admin: { placeholder: 'https://www.twitch.tv/…' } },
    {
      name: 'statut',
      label: 'Statut sur la fiche',
      type: 'select',
      defaultValue: 'ready',
      options: [
        { label: 'Ready', value: 'ready' },
        { label: 'Nouvelle recrue', value: 'recrue' },
        { label: 'Pour toujours (en mémoire)', value: 'memoire' },
      ],
      admin: { position: 'sidebar', description: '« Pour toujours » affiche la fiche en bleu nuit.' },
    },
    { name: 'ordre', label: 'Ordre', type: 'number', defaultValue: 10, admin: { position: 'sidebar' } },
  ],
}
