import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'
import { entete, groupe, paragraphe, texte } from '@/fields/helpers'

export const PageActualites: GlobalConfig = {
  slug: 'page-actualites',
  typescript: { interface: 'PageActualites' },
  label: 'Actualités (page)',
  admin: { group: 'Pages', livePreview: { url: '/actualites' }, description: 'Les articles eux-mêmes se gèrent dans Contenu → Actualités.' },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal(['/actualites'])] },
  fields: [
    entete([texte('titreSurligne', 'Mot du titre surligné', { admin: { description: 'Doit apparaître tel quel dans le titre. Ex. « Kraken ».' } })]),
    texte('listeTitre', 'Titre de la liste', { defaultValue: 'Nos derniers articles' }),
    groupe('alerte', 'Bloc d’inscription', [texte('titre', 'Titre'), paragraphe('texte', 'Texte'), texte('bouton', 'Bouton', { defaultValue: 'Je m’abonne' })]),
  ],
}
