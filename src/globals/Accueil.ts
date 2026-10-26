import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'
import { couleur, groupe, icone, lien, liste, paragraphe, texte, titreSection } from '@/fields/helpers'

export const Accueil: GlobalConfig = {
  slug: 'accueil',
  typescript: { interface: 'Accueil' },
  label: 'Accueil',
  admin: { group: 'Pages', livePreview: { url: '/' } },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal(['/'])] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Bandeau',
          fields: [
            groupe('hero', 'Grand bandeau bleu', [
              {
                type: 'row',
                fields: [
                  texte('pastille1', 'Pastille noire', { admin: { width: '50%' } }),
                  texte('pastille2', 'Pastille blanche', { admin: { width: '50%' } }),
                ],
              },
              {
                type: 'row',
                fields: [
                  texte('titre', 'Titre', { required: true, admin: { width: '50%' } }),
                  texte('titreSurligne', 'Suite du titre surlignée en rose', { admin: { width: '50%' } }),
                ],
              },
              paragraphe('texte', 'Texte'),
              {
                type: 'row',
                fields: [
                  texte('boutonDon', 'Bouton de don', { defaultValue: 'Faire un don', admin: { width: '50%' } }),
                  texte('boutonLive', 'Bouton Twitch', { defaultValue: 'Regarder le live', admin: { width: '50%' } }),
                ],
              },
              liste('garanties', 'Petites garanties sous les boutons', ['Garantie', 'Garanties'], [texte('texte', 'Texte', { required: true })], { maxRows: 3 }),
              texte('compteRebours', 'Titre du compte à rebours', { defaultValue: 'Prochain live dans' }),
            ]),
            liste('defile', 'Bande rose qui défile', ['Mot', 'Mots'], [texte('texte', 'Texte', { required: true })], {
              admin: { description: 'Écrits en majuscules automatiquement.' },
            }),
          ],
        },
        {
          label: 'Cagnotte',
          fields: [
            groupe('cagnotte', 'Bloc cagnotte', [
              paragraphe('texte', 'Texte sous la barre'),
              texte('bouton', 'Bouton', { defaultValue: 'Je fais monter la barre' }),
              liste(
                'chiffres',
                'Chiffres à côté',
                ['Chiffre', 'Chiffres'],
                [
                  {
                    type: 'row',
                    fields: [
                      texte('valeur', 'Chiffre', { required: true, admin: { width: '30%' } }),
                      texte('legende', 'Légende', { required: true, admin: { width: '50%' } }),
                      couleur({ admin: { width: '20%' } }),
                    ],
                  },
                ],
                { maxRows: 3 },
              ),
            ]),
          ],
        },
        {
          label: 'Pour Max',
          fields: [
            groupe('max', 'Section « Pour Max »', [
              texte('surtitre', 'Étiquette'),
              texte('titre', 'Titre', { required: true }),
              paragraphe('intro', 'Chapeau'),
              groupe('citation', 'Citation', [paragraphe('texte', 'Citation'), texte('auteur', 'Auteur')]),
              { name: 'texte', label: 'Texte', type: 'richText' },
              texte('bouton', 'Bouton', { defaultValue: 'Faire un don en mémoire de Max' }),
              groupe('fiche', 'Fiche joueur', [
                {
                  type: 'row',
                  fields: [texte('prenom', 'Prénom', { admin: { width: '50%' } }), texte('pseudo', 'Pseudo', { admin: { width: '50%' } })],
                },
                { name: 'photo', label: 'Photo', type: 'upload', relationTo: 'media' },
                liste('infos', 'Caractéristiques', ['Ligne', 'Lignes'], [
                  {
                    type: 'row',
                    fields: [texte('label', 'Intitulé', { required: true, admin: { width: '35%' } }), texte('valeur', 'Valeur', { required: true, admin: { width: '65%' } })],
                  },
                ]),
              ]),
            ]),
          ],
        },
        {
          label: 'Programme',
          fields: [
            titreSection('programme', 'Au programme', [
              liste('items', 'Animations', ['Animation', 'Animations'], [texte('titre', 'Titre', { required: true }), paragraphe('texte', 'Texte', { required: true }), icone()]),
            ]),
          ],
        },
        {
          label: 'Choisis ta classe',
          fields: [
            titreSection(
              'classes',
              'Choisis ta classe',
              [
                liste('items', 'Classes', ['Classe', 'Classes'], [
                  {
                    type: 'row',
                    fields: [texte('nom', 'Nom', { required: true, admin: { width: '50%' } }), icone({ admin: { width: '25%' } }), couleur({ admin: { width: '25%' } })],
                  },
                  paragraphe('texte', 'Texte', { required: true }),
                  texte('pouvoir', 'Pouvoir spécial'),
                  {
                    type: 'row',
                    fields: [texte('bouton', 'Bouton', { required: true, admin: { width: '50%' } }), lien('lien', 'Lien', { width: '50%', description: 'Écrire « don » pour le lien Streamlabs.' })],
                  },
                ]),
              ],
              true,
            ),
          ],
        },
        {
          label: 'Boutique, live, partenaires',
          fields: [
            titreSection('boutique', 'Aperçu de la boutique', [texte('bouton', 'Bouton', { defaultValue: 'Toute la boutique' })], true),
            titreSection(
              'live',
              'Rejoins le live',
              [
                texte('bouton', 'Bouton', { defaultValue: 'Suivre sur Twitch' }),
                texte('alerteExemple', 'Exemple d’alerte de don', { defaultValue: 'Ton pseudo · 20 €' }),
                texte('alerteTexte', 'Texte sous l’alerte', { defaultValue: 'Ton pseudo s’affiche en direct sur le stream' }),
                liste('videos', 'Vidéos à revoir', ['Vidéo', 'Vidéos'], [texte('titre', 'Titre', { required: true }), texte('url', 'Lien YouTube', { required: true })]),
              ],
              true,
            ),
            titreSection('partenaires', 'Partenaires', [texte('bouton', 'Bouton', { defaultValue: 'Devenir partenaire' })]),
          ],
        },
      ],
    },
  ],
}
