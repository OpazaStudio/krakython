import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access'

export const Abonnes: CollectionConfig = {
  slug: 'abonnes',
  typescript: { interface: 'Abonne' },
  labels: { singular: 'Inscrit à l’alerte', plural: 'Alerte du prochain live' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'createdAt'],
    group: 'Administration',
    description: 'Les adresses laissées dans le pied de page pour être prévenues du prochain live. À n’utiliser que pour ça.',
  },
  access: { create: () => false, read: authenticated, update: authenticated, delete: authenticated },
  fields: [{ name: 'email', label: 'E-mail', type: 'email', required: true, unique: true, index: true }],
}
