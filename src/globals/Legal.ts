import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

const pageLegale = (slug: string, label: string, path: string, iface: string): GlobalConfig => ({
  slug,
  typescript: { interface: iface },
  label,
  admin: { group: 'Pages', livePreview: { url: path } },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal([path])] },
  fields: [
    { name: 'titre', label: 'Titre', type: 'text', required: true },
    { name: 'majLe', label: 'Mise à jour le', type: 'date', admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } } },
    { name: 'contenu', label: 'Contenu', type: 'richText' },
  ],
})

export const MentionsLegales = pageLegale('mentions-legales', 'Mentions légales', '/mentions-legales', 'MentionsLegales')
export const Cgv = pageLegale('cgv', 'CGV de la boutique', '/cgv', 'Cgv')
export const Confidentialite = pageLegale('confidentialite', 'Confidentialité', '/confidentialite', 'Confidentialite')
