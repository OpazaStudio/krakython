import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'
import { entete, groupe, liste, paragraphe, texte, titreSection } from '@/fields/helpers'

export const QuiSommesNous: GlobalConfig = {
  slug: 'qui-sommes-nous',
  typescript: { interface: 'QuiSommesNous' },
  label: 'Qui sommes-nous',
  admin: {
    group: 'Pages',
    livePreview: { url: '/qui-sommes-nous' },
    description: 'Les fiches de l’équipe se gèrent dans Contenu → Équipe, le journal de quête dans Contenu → Éditions.',
  },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal(['/qui-sommes-nous'])] },
  fields: [
    entete([groupe('citation', 'Citation', [paragraphe('texte', 'Citation'), texte('auteur', 'Auteur')])]),
    titreSection('nom', 'Pourquoi « Krakython » ?', [
      {
        type: 'row',
        fields: [
          texte('mot1', '1er mot', { defaultValue: 'Kraky', admin: { width: '33%' } }),
          texte('mot1Texte', 'Explication', { admin: { width: '67%' } }),
        ],
      },
      {
        type: 'row',
        fields: [
          texte('mot2', '2e mot', { defaultValue: 'Marathon', admin: { width: '33%' } }),
          texte('mot2Texte', 'Explication', { admin: { width: '67%' } }),
        ],
      },
      { name: 'texte', label: 'Texte', type: 'richText' },
      liste('chiffres', 'Chiffres', ['Chiffre', 'Chiffres'], [
        {
          type: 'row',
          fields: [texte('valeur', 'Chiffre', { required: true, admin: { width: '30%' } }), texte('legende', 'Légende', { required: true, admin: { width: '70%' } })],
        },
      ]),
      texte('totalLegende', 'Légende du total récolté', {
        defaultValue: 'récoltés depuis le début de l’aventure',
        admin: { description: 'Le total est calculé à partir des montants saisis dans Contenu → Éditions.' },
      }),
    ]),
    titreSection(
      'quete',
      'Journal de quête',
      [
        texte('prochainTitre', 'Titre de la prochaine édition', { defaultValue: 'La quête continue' }),
        texte('prochainBouton', 'Bouton', { defaultValue: 'Activer le rappel Twitch' }),
        groupe('video', 'Vidéo mise en avant', [
          texte('surtitre', 'Étiquette', { defaultValue: 'En vidéo' }),
          texte('titre', 'Titre'),
          paragraphe('texte', 'Texte'),
          texte('url', 'Lien YouTube'),
        ]),
      ],
      true,
    ),
    titreSection('equipe', 'L’équipe', [texte('recrueTitre', 'Carte « Et toi ? »', { defaultValue: 'Et toi ?' }), texte('recrueTexte', 'Texte de la carte')], true),
    groupe('rejoindre', 'Bandeau « Rejoindre la team »', [texte('titre', 'Titre'), paragraphe('texte', 'Texte'), texte('bouton', 'Bouton', { defaultValue: 'Nous écrire' })]),
  ],
}
