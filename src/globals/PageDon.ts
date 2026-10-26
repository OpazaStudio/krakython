import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'
import { entete, groupe, icone, liste, paragraphe, texte, titreSection } from '@/fields/helpers'

export const PageDon: GlobalConfig = {
  slug: 'page-don',
  typescript: { interface: 'PageDon' },
  label: 'Faire un don',
  admin: {
    group: 'Pages',
    livePreview: { url: '/faire-un-don' },
    description: 'Le lien Streamlabs et la cagnotte se règlent dans Réglages → Événement et cagnotte.',
  },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal(['/faire-un-don'])] },
  fields: [
    entete(),
    titreSection('etapes', 'Mode d’emploi', [
      liste('items', 'Étapes', ['Étape', 'Étapes'], [texte('titre', 'Titre', { required: true }), paragraphe('texte', 'Texte', { required: true })], { maxRows: 4 }),
      texte('bouton', 'Bouton', { defaultValue: 'Donner sur Streamlabs Charity' }),
      liste('garanties', 'Garanties sous le bouton', ['Garantie', 'Garanties'], [texte('texte', 'Texte', { required: true })], { maxRows: 3 }),
    ]),
    titreSection(
      'test',
      'Simulateur d’alerte',
      [liste('montants', 'Montants proposés', ['Montant', 'Montants'], [{ name: 'valeur', label: 'Montant (€)', type: 'number', required: true, min: 1 }], { maxRows: 5 })],
      true,
    ),
    titreSection('destination', 'Où va ton don', [
      liste('items', 'Missions', ['Mission', 'Missions'], [texte('titre', 'Titre', { required: true }), paragraphe('texte', 'Texte', { required: true }), icone()]),
    ]),
    groupe('memoire', 'Encadré « En mémoire de Max »', [texte('surtitre', 'Étiquette'), paragraphe('texte', 'Texte'), texte('lienTexte', 'Texte du lien'), texte('lien', 'Lien')]),
  ],
}
