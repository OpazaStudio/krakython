import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'
import { entete, groupe, liste, paragraphe, texte, titreSection } from '@/fields/helpers'

export const PagePresse: GlobalConfig = {
  slug: 'page-presse',
  typescript: { interface: 'PagePresse' },
  label: 'Ils parlent de nous',
  admin: { group: 'Pages', livePreview: { url: '/ils-parlent-de-nous' }, description: 'Les articles se gèrent dans Contenu → Presse.' },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal(['/ils-parlent-de-nous'])] },
  fields: [
    entete(),
    titreSection('medias', 'Section médias'),
    titreSection('federation', 'Section « Côté Fédération »'),
    titreSection(
      'kit',
      'Espace presse',
      [
        liste(
          'telechargements',
          'Fichiers à télécharger',
          ['Fichier', 'Fichiers'],
          [
            {
              type: 'row',
              fields: [texte('libelle', 'Nom', { required: true, admin: { width: '60%' } }), texte('format', 'Format', { admin: { width: '40%', placeholder: 'PNG' } })],
            },
            { name: 'fichier', label: 'Fichier', type: 'upload', relationTo: 'media' },
            texte('lien', 'Ou lien externe', { admin: { description: 'Pour un ZIP ou un PDF hébergé ailleurs (Drive, WeTransfer…).' } }),
          ],
        ),
        { name: 'email', label: 'E-mail presse', type: 'email' },
        groupe('enBref', 'Encadré « en bref »', [
          texte('titre', 'Titre', { defaultValue: 'Le Krakython en bref' }),
          liste('lignes', 'Lignes', ['Ligne', 'Lignes'], [
            {
              type: 'row',
              fields: [texte('terme', 'Intitulé', { required: true, admin: { width: '30%' } }), paragraphe('definition', 'Contenu', { required: true, admin: { width: '70%' } })],
            },
          ]),
          liste('pastilles', 'Pastilles', ['Pastille', 'Pastilles'], [texte('texte', 'Texte', { required: true })], { maxRows: 4 }),
        ]),
      ],
      true,
    ),
  ],
}
