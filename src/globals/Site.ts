import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { ALL_PATHS, revalidateGlobal } from '@/hooks/revalidate'
import { groupe, paragraphe, texte } from '@/fields/helpers'

export const Site: GlobalConfig = {
  slug: 'site',
  typescript: { interface: 'Site' },
  label: 'Infos de l’asso',
  admin: {
    group: 'Réglages',
    description: 'Coordonnées, réseaux sociaux, pied de page et bénéficiaire. Utilisés sur toutes les pages.',
    livePreview: { url: '/' },
  },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal(ALL_PATHS)] },
  fields: [
    {
      type: 'row',
      fields: [
        texte('nomAsso', 'Nom de l’association', { required: true, defaultValue: 'Association Krakython', admin: { width: '50%' } }),
        { name: 'email', label: 'E-mail de contact', type: 'email', admin: { width: '50%', description: 'Affiché dans le pied de page ; reçoit les messages des formulaires.' } },
      ],
    },
    groupe('reseaux', 'Réseaux sociaux', [
      texte('twitch', 'Chaîne Twitch', { required: true, defaultValue: 'https://www.twitch.tv/krakython' }),
      {
        type: 'row',
        fields: [
          texte('instagram', 'Instagram', { admin: { width: '50%' } }),
          texte('facebook', 'Facebook', { admin: { width: '50%' } }),
        ],
      },
      {
        type: 'row',
        fields: [texte('x', 'X (Twitter)', { admin: { width: '50%' } }), texte('youtube', 'YouTube', { admin: { width: '50%' } })],
      },
    ]),
    groupe('beneficiaire', 'Bénéficiaire des dons', [
      texte('nom', 'Nom', { required: true, defaultValue: 'Fédération Leucémie Espoir' }),
      { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media' },
      paragraphe('texte', 'Présentation courte'),
      texte('lien', 'Site web', { defaultValue: 'https://www.leucemie-espoir.org' }),
    ]),
    texte('lienMoelle', 'Lien « Devenir donneur de moelle osseuse »', { defaultValue: 'https://www.dondemoelleosseuse.fr' }),
    groupe('pied', 'Pied de page', [
      paragraphe('texte', 'Présentation'),
      texte('alerteTitre', 'Titre du formulaire d’alerte', { defaultValue: 'Reçois l’alerte du prochain live' }),
    ]),
  ],
}
