import type { Field } from 'payload'

export const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const slugField = (from = 'titre'): Field => ({
  name: 'slug',
  label: 'Adresse de la page (slug)',
  type: 'text',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Généré automatiquement depuis le titre si vide. Lettres, chiffres et tirets.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        const source = typeof value === 'string' && value.trim() ? value : (data?.[from] as string | undefined)
        return source ? slugify(source) : value
      },
    ],
  },
})
