import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { ALL_PATHS, revalidateGlobal } from '@/hooks/revalidate'
import { groupe, liste, paragraphe, texte } from '@/fields/helpers'

export const Evenement: GlobalConfig = {
  slug: 'evenement',
  typescript: { interface: 'Evenement' },
  label: 'Événement et cagnotte',
  admin: {
    group: 'Réglages',
    description: 'L’édition en cours : dates (compte à rebours), lien de don Streamlabs et cagnotte (barre d’XP). Utilisés sur tout le site.',
    livePreview: { url: '/' },
  },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal(ALL_PATHS)] },
  fields: [
    {
      type: 'row',
      fields: [
        texte('edition', 'Nom de l’édition', { required: true, admin: { width: '50%', placeholder: 'Krakython 2026' } }),
        texte('duree', 'Durée du live', { required: true, defaultValue: '51 h', admin: { width: '50%' } }),
      ],
    },
    groupe('dates', 'Dates', [
      {
        type: 'row',
        fields: [
          {
            name: 'debut',
            label: 'Début du live',
            type: 'date',
            admin: { width: '50%', date: { pickerAppearance: 'dayAndTime', timeFormat: 'HH:mm', displayFormat: 'd MMM yyyy, HH:mm' }, description: 'Lance le compte à rebours. Vide = « -- ».' },
          },
          {
            name: 'fin',
            label: 'Fin du live',
            type: 'date',
            admin: { width: '50%', date: { pickerAppearance: 'dayAndTime', timeFormat: 'HH:mm', displayFormat: 'd MMM yyyy, HH:mm' } },
          },
        ],
      },
      texte('libelle', 'Dates en toutes lettres', { required: true, defaultValue: 'Dates bientôt annoncées', admin: { placeholder: 'Du 23 au 25 octobre 2026' } }),
    ]),
    texte('lienDon', 'Lien de don Streamlabs Charity', {
      required: true,
      admin: { description: 'Le bouton « Donner » de la page Faire un don y renvoie. À remplacer à chaque nouvelle édition.' },
    }),
    {
      name: 'donDirect',
      label: 'Les boutons « Faire un don » du site mènent directement à Streamlabs',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Décoché : ils mènent à la page Faire un don, qui explique la démarche avant d’envoyer sur Streamlabs.' },
    },
    groupe('cagnotte', 'Cagnotte (barre d’XP)', [
      {
        type: 'row',
        fields: [
          { name: 'montant', label: 'Montant récolté (€)', type: 'number', min: 0, defaultValue: 0, admin: { width: '50%' } },
          { name: 'objectif', label: 'Objectif (€)', type: 'number', min: 1, defaultValue: 5000, admin: { width: '50%' } },
        ],
      },
      texte('statut', 'Petite mention à côté', { defaultValue: 'Mise à jour pendant le live' }),
      liste(
        'paliers',
        'Paliers et défis',
        ['Palier', 'Paliers'],
        [
          {
            type: 'row',
            fields: [
              { name: 'montant', label: 'À partir de (€)', type: 'number', required: true, min: 0, admin: { width: '30%' } },
              texte('defi', 'Défi débloqué', { required: true, admin: { width: '70%' } }),
            ],
          },
        ],
        { admin: { description: 'Le prochain palier non atteint s’affiche sous l’écran du live sur l’accueil.' } },
      ),
    ]),
    groupe('annonce', 'Bandeau d’annonce (tout en haut du site)', [
      { name: 'actif', label: 'Afficher le bandeau', type: 'checkbox', defaultValue: true },
      paragraphe('texte', 'Texte', { admin: { description: 'Ex. « Du 23 au 25 octobre · 51 h de live sur Twitch contre la leucémie ».' } }),
      {
        type: 'row',
        fields: [texte('lienTexte', 'Texte du lien', { admin: { width: '50%' } }), texte('lien', 'Lien', { admin: { width: '50%' } })],
      },
    ]),
  ],
}
