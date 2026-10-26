import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  typescript: { interface: 'User' },
  labels: { singular: 'Utilisateur', plural: 'Utilisateurs' },
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
    description: 'Les membres de l’asso qui peuvent se connecter à cette interface.',
  },
  auth: true,
  fields: [{ name: 'nom', label: 'Nom', type: 'text' }],
}
