import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'
import { entete, groupe, icone, liste, paragraphe, texte } from '@/fields/helpers'

export const PageBoutique: GlobalConfig = {
  slug: 'page-boutique',
  typescript: { interface: 'PageBoutique' },
  label: 'Boutique (page et livraison)',
  admin: {
    group: 'Boutique',
    livePreview: { url: '/boutique' },
    description: 'Textes de la boutique, frais de livraison et arrondi solidaire.',
  },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal(['/boutique', '/panier', '/commande', '/'])] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Textes',
          fields: [
            entete([
              texte('bulle', 'Bulle animée', { defaultValue: '+1 loot' }),
              liste('badges', 'Pastilles', ['Pastille', 'Pastilles'], [texte('texte', 'Texte', { required: true }), icone()], { maxRows: 4 }),
            ]),
            groupe('panier', 'Panier', [
              texte('titre', 'Titre', { defaultValue: 'Ton inventaire' }),
              texte('videTitre', 'Panier vide : titre', { defaultValue: 'Le Kraken a faim' }),
              texte('videTexte', 'Panier vide : texte', { defaultValue: 'Ton panier est vide. Ajoute un article pour commencer.' }),
            ]),
            groupe('soutien', 'Bandeau bleu en bas', [texte('titre', 'Titre'), texte('texte', 'Texte'), texte('bouton', 'Bouton', { defaultValue: 'Faire un don' })]),
            groupe('confirmation', 'Page de confirmation', [
              texte('titre', 'Titre', { defaultValue: 'GG, commande validée !' }),
              paragraphe('texte', 'Texte'),
            ]),
          ],
        },
        {
          label: 'Livraison et paiement',
          fields: [
            groupe('colissimo', 'Colissimo à domicile', [
              { name: 'actif', label: 'Proposer la livraison Colissimo', type: 'checkbox', defaultValue: true },
              {
                type: 'row',
                fields: [
                  { name: 'prix', label: 'Frais de port (€)', type: 'number', min: 0, defaultValue: 6.5, admin: { width: '40%', step: 0.1 } },
                  texte('delai', 'Délai annoncé', { defaultValue: 'sous 5 à 7 jours', admin: { width: '60%' } }),
                ],
              },
            ]),
            groupe('retrait', 'Retrait en main propre', [
              { name: 'actif', label: 'Proposer le retrait en main propre', type: 'checkbox', defaultValue: true },
              paragraphe('texte', 'Explication affichée à l’acheteur', {
                defaultValue: 'Gratuit. À récupérer pendant le Krakython ou à La Rochelle : on t’écrit pour convenir du moment.',
              }),
            ]),
            groupe('arrondi', 'Arrondi solidaire', [
              { name: 'actif', label: 'Proposer l’arrondi solidaire au panier', type: 'checkbox', defaultValue: true },
              texte('titre', 'Titre', { defaultValue: 'Ajouter un don à ma commande' }),
              texte('texte', 'Texte', { defaultValue: 'Arrondi aux 5 € supérieurs, reversé à la Fédération Leucémie Espoir' }),
            ]),
          ],
        },
      ],
    },
  ],
}
