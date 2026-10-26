import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access'

export const SUJETS_MESSAGE = [
  { label: 'Devenir partenaire', value: 'partenariat' },
  { label: 'Rejoindre l’équipe', value: 'equipe' },
  { label: 'Presse', value: 'presse' },
  { label: 'Autre', value: 'autre' },
]

export const Messages: CollectionConfig = {
  slug: 'messages',
  typescript: { interface: 'Message' },
  labels: { singular: 'Message reçu', plural: 'Messages reçus' },
  admin: {
    useAsTitle: 'nom',
    defaultColumns: ['nom', 'sujet', 'structure', 'traite', 'createdAt'],
    group: 'Administration',
    description: 'Les messages envoyés depuis le formulaire « Nous contacter ». Ils sont aussi envoyés par e-mail si Resend est configuré.',
  },
  access: { create: () => false, read: authenticated, update: authenticated, delete: authenticated },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'nom', label: 'Nom', type: 'text', required: true, admin: { width: '50%', readOnly: true } },
        { name: 'email', label: 'E-mail', type: 'email', required: true, admin: { width: '50%', readOnly: true } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'structure', label: 'Structure', type: 'text', admin: { width: '50%', readOnly: true } },
        { name: 'sujet', label: 'Sujet', type: 'select', options: SUJETS_MESSAGE, defaultValue: 'autre', admin: { width: '50%', readOnly: true } },
      ],
    },
    { name: 'soutien', label: 'Type de soutien proposé', type: 'text', admin: { readOnly: true } },
    { name: 'message', label: 'Message', type: 'textarea', required: true, admin: { readOnly: true } },
    { name: 'traite', label: 'Traité', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
