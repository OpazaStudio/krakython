import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'
import { entete, groupe, icone, liste, paragraphe, texte, titreSection } from '@/fields/helpers'

export const PagePartenaires: GlobalConfig = {
  slug: 'page-partenaires',
  typescript: { interface: 'PagePartenaires' },
  label: 'Nos partenaires',
  admin: { group: 'Pages', livePreview: { url: '/nos-partenaires' }, description: 'Les partenaires eux-mêmes se gèrent dans Contenu → Partenaires.' },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal(['/nos-partenaires', '/'])] },
  fields: [
    entete([texte('bouton', 'Bouton', { defaultValue: 'Devenir partenaire' }), texte('bulle', 'Bulle animée', { defaultValue: 'Player 2 has joined' })]),
    titreSection('merci', 'Liste des partenaires', [texte('slotTitre', 'Carte vide', { defaultValue: 'Ta structure ici ?' }), texte('slotLien', 'Lien de la carte vide', { defaultValue: 'Rejoindre la partie →' })]),
    titreSection(
      'beneficiaire',
      'Bénéficiaire',
      [
        liste('missions', 'Missions', ['Mission', 'Missions'], [texte('texte', 'Texte', { required: true })]),
        texte('bouton', 'Bouton', { defaultValue: 'Découvrir la Fédération' }),
        groupe('scores', 'Tableau des scores', [
          texte('titre', 'Titre', { defaultValue: 'Tableau des scores' }),
          liste('lignes', 'Lignes', ['Ligne', 'Lignes'], [
            {
              type: 'row',
              fields: [texte('valeur', 'Chiffre', { required: true, admin: { width: '30%' } }), texte('legende', 'Légende', { required: true, admin: { width: '70%' } })],
            },
          ]),
          texte('totalLegende', 'Légende du total', { defaultValue: 'versés depuis 2021', admin: { description: 'Total calculé depuis Contenu → Éditions.' } }),
        ]),
      ],
      true,
    ),
    titreSection(
      'devenir',
      'Devenir partenaire',
      [
        liste('modes', 'Façons d’aider', ['Façon', 'Façons'], [texte('titre', 'Titre', { required: true }), paragraphe('texte', 'Texte', { required: true }), icone()]),
        texte('retourTitre', 'Titre « En retour »', { defaultValue: 'En retour' }),
        liste('retours', 'Ce que le partenaire reçoit', ['Contrepartie', 'Contreparties'], [texte('texte', 'Texte', { required: true })]),
      ],
      true,
    ),
    titreSection('formulaire', 'Formulaire de contact', [texte('delai', 'Délai de réponse', { admin: { placeholder: 'Réponse de l’équipe sous une semaine' } })]),
  ],
}
