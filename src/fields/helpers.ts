import type { ArrayField, Field, GroupField, SelectField, TextField, TextareaField } from 'payload'

// Raccourcis pour garder les définitions de pages lisibles.

type Extra<T> = Partial<Omit<T, 'name' | 'label' | 'type'>>

export const texte = (name: string, label: string, extra: Extra<TextField> = {}): Field => ({ name, label, type: 'text', ...extra }) as Field

export const paragraphe = (name: string, label: string, extra: Extra<TextareaField> = {}): Field =>
  ({ name, label, type: 'textarea', ...extra }) as Field

export const groupe = (name: string, label: string, fields: Field[], extra: Extra<GroupField> = {}): Field =>
  ({ name, label, type: 'group', fields, ...extra }) as Field

export const liste = (name: string, label: string, [singular, plural]: [string, string], fields: Field[], extra: Extra<ArrayField> = {}): Field =>
  ({ name, label, labels: { singular, plural }, type: 'array', fields, ...extra }) as Field

export const choix = (name: string, label: string, options: { label: string; value: string }[], extra: Extra<SelectField> = {}): Field =>
  ({ name, label, type: 'select', options, defaultValue: options[0]?.value, ...extra }) as Field

export const lien = (name = 'lien', label = 'Lien', admin: TextField['admin'] = {}): Field => texte(name, label, { admin: { placeholder: '/boutique ou https://…', ...admin } })

/** En-tête de page : petite étiquette, grand titre, chapeau. */
export const entete = (extra: Field[] = []): Field =>
  groupe('entete', 'En-tête de la page', [
    texte('surtitre', 'Étiquette', { admin: { description: 'La petite pastille au-dessus du titre.' } }),
    texte('titre', 'Titre', { required: true }),
    paragraphe('intro', 'Chapeau'),
    ...extra,
  ])

/** Titre de section : étiquette + titre (+ texte). */
export const titreSection = (name: string, label: string, extra: Field[] = [], avecTexte = false): Field =>
  groupe(name, label, [texte('surtitre', 'Étiquette'), texte('titre', 'Titre'), ...(avecTexte ? [paragraphe('texte', 'Texte')] : []), ...extra])

export const ICONES = [
  { label: 'Manette', value: 'manette' },
  { label: 'Quiz', value: 'quiz' },
  { label: 'Planète', value: 'globe' },
  { label: 'Cadeau', value: 'cadeau' },
  { label: 'Cœur', value: 'coeur' },
  { label: 'Sac', value: 'sac' },
  { label: 'Goutte', value: 'goutte' },
  { label: 'Groupe', value: 'groupe' },
  { label: 'Ordinateur', value: 'ordi' },
  { label: 'Repas', value: 'repas' },
  { label: 'Maison', value: 'maison' },
  { label: 'Recherche', value: 'recherche' },
  { label: 'Cadenas', value: 'cadenas' },
  { label: 'Camion', value: 'camion' },
  { label: 'Trophée', value: 'trophee' },
  { label: 'Micro', value: 'micro' },
  { label: 'Vidéo', value: 'video' },
  { label: 'Télé', value: 'tv' },
  { label: 'Ballon de rugby', value: 'ballon' },
  { label: 'Photo', value: 'photo' },
  { label: 'Document', value: 'document' },
]

export const icone = (extra: Extra<SelectField> = {}): Field => choix('icone', 'Icône', ICONES, extra)

export const COULEURS = [
  { label: 'Rose', value: 'rose' },
  { label: 'Bleu', value: 'bleu' },
  { label: 'Blanc', value: 'blanc' },
]

export const couleur = (extra: Extra<SelectField> = {}): Field => choix('couleur', 'Couleur', COULEURS, extra)
