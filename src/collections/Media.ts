import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { anyone, authenticated } from '@/access'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  typescript: { interface: 'Media' },
  labels: { singular: 'Image', plural: 'Images' },
  admin: {
    group: 'Contenu',
    description: 'Photos, logos, visuels de la boutique, PDF du kit presse. Une image de 1600 px de large suffit ; le site la redimensionne.',
  },
  access: { create: authenticated, delete: authenticated, read: anyone, update: authenticated },
  fields: [
    {
      name: 'alt',
      label: 'Description de l’image',
      type: 'text',
      required: true,
      admin: {
        description: 'Une phrase qui décrit l’image (lue par Google et par les lecteurs d’écran). Ex. « L’équipe en plein live, manettes en main ».',
      },
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: ({ doc }) => {
      const d = doc as { url?: string; sizes?: { miniature?: { url?: string } } }
      return d.sizes?.miniature?.url || d.url || null
    },
    focalPoint: true,
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'miniature', width: 400, withoutEnlargement: true },
      { name: 'carte', width: 900, withoutEnlargement: true },
      { name: 'large', width: 1800, withoutEnlargement: true },
      { name: 'og', width: 1200, height: 630, crop: 'center', withoutEnlargement: true },
    ],
  },
}
