import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload, type Payload } from 'payload'
import config from '../src/payload.config'
import {
  ACCUEIL,
  ACTUALITES,
  EDITIONS,
  EVENEMENT,
  MEDIA,
  MEMBRES,
  PAGE_ACTUALITES,
  PAGE_BOUTIQUE,
  PAGE_DON,
  PAGE_PARTENAIRES,
  PAGE_PRESSE,
  PARTENAIRES,
  PRESSE,
  PRODUITS,
  QUI_SOMMES_NOUS,
  SITE,
} from './content'
import { CGV, CONFIDENTIALITE, MENTIONS } from './legal'
import { fr } from '../src/lib/typo'

// Seed idempotent : remplit les pages et réglages (réécrits à chaque passage),
// et crée les contenus des collections seulement s'ils n'existent pas encore.

const dirname = path.dirname(fileURLToPath(import.meta.url))
const ctx = { disableRevalidate: true }

/** Applique les espaces insécables français (avant « : ; ! ? ») à tous les textes du contenu de départ. */
const typo = <T,>(v: T): T => {
  if (typeof v === 'string') return fr(v) as T
  if (Array.isArray(v)) return v.map(typo) as T
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, typo(x)])) as T
  return v
}

async function compteAdmin(payload: Payload) {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@krakython.fr'
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!password) throw new Error('SEED_ADMIN_PASSWORD absente : choisis un mot de passe fort dans .env avant de lancer le seed.')
  const existe = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
  if (existe.totalDocs) return payload.logger.info(`Compte ${email} déjà présent.`)
  await payload.create({ collection: 'users', data: { email, password, nom: 'Équipe Krakython' } })
  payload.logger.info(`Compte admin créé : ${email} (mot de passe à changer dès la première connexion).`)
}

async function medias(payload: Payload): Promise<Record<string, number>> {
  const ids: Record<string, number> = {}
  for (const [cle, m] of Object.entries(MEDIA)) {
    const trouve = await payload.find({ collection: 'media', where: { alt: { equals: m.alt } }, limit: 1 })
    if (trouve.docs[0]) {
      ids[cle] = trouve.docs[0].id
      continue
    }
    const doc = await payload.create({ collection: 'media', data: { alt: m.alt }, filePath: path.join(dirname, 'media', m.file), context: ctx })
    ids[cle] = doc.id
    payload.logger.info(`Image ajoutée : ${m.file}`)
  }
  return ids
}

async function creerSiVide<T>(payload: Payload, collection: 'membres' | 'editions' | 'partenaires' | 'presse' | 'actualites' | 'produits', items: T[], data: (item: T, i: number) => Record<string, unknown>) {
  const n = await payload.count({ collection })
  if (n.totalDocs > 0) return payload.logger.info(`${collection} : déjà rempli, on n’y touche pas.`)
  for (const [i, item] of items.entries()) {
    await payload.create({ collection, data: typo(data(item, i)) as never, context: ctx })
  }
  payload.logger.info(`${collection} : ${items.length} entrées créées.`)
}

async function seed() {
  const payload = await getPayload({ config })
  payload.logger.info('Seed : début')

  await compteAdmin(payload)
  const m = await medias(payload)
  const id = (cle?: string | null) => (cle ? m[cle] : undefined)

  const maj = (slug: Parameters<Payload['updateGlobal']>[0]['slug'], data: unknown) => payload.updateGlobal({ slug, data: typo(data) as never, context: ctx })

  await maj('evenement', EVENEMENT)
  await maj('site', { ...SITE, beneficiaire: { ...SITE.beneficiaire, logo: id(SITE.beneficiaire.logo) } })
  await maj('accueil', { ...ACCUEIL, max: { ...ACCUEIL.max, fiche: { ...ACCUEIL.max.fiche, photo: id(ACCUEIL.max.fiche.photo) } } })
  await maj('qui-sommes-nous', QUI_SOMMES_NOUS)
  await maj('page-actualites', PAGE_ACTUALITES)
  await maj('page-presse', { ...PAGE_PRESSE, kit: { ...PAGE_PRESSE.kit, telechargements: PAGE_PRESSE.kit.telechargements.map((t) => ({ ...t, fichier: id(t.fichier) })) } })
  await maj('page-partenaires', PAGE_PARTENAIRES)
  await maj('page-don', PAGE_DON)
  await maj('page-boutique', PAGE_BOUTIQUE)
  await maj('mentions-legales', MENTIONS)
  await maj('cgv', CGV)
  await maj('confidentialite', CONFIDENTIALITE)
  payload.logger.info('Pages et réglages remplis.')

  await creerSiVide(payload, 'membres', MEMBRES, (x, i) => ({
    prenom: x.prenom,
    pseudo: x.pseudo,
    photo: id(x.photo),
    bio: x.bio,
    statut: x.statut ?? 'ready',
    twitch: x.twitch,
    tags: x.tags.map((tag) => ({ tag })),
    ordre: (i + 1) * 10,
  }))
  await creerSiVide(payload, 'editions', EDITIONS, (x) => ({ ...x }))
  await creerSiVide(payload, 'partenaires', PARTENAIRES, (x, i) => ({ ...x, logo: id(x.logo), ordre: (i + 1) * 10 }))
  await creerSiVide(payload, 'presse', PRESSE, (x) => ({ ...x }))
  await creerSiVide(payload, 'actualites', ACTUALITES, (x) => ({ publie: true, ...x, image: id((x as { image?: string }).image) }))
  await creerSiVide(payload, 'produits', PRODUITS, (x, i) => ({
    ...x,
    actif: true,
    ordre: (i + 1) * 10,
    tailles: (x.tailles ?? []).map(([taille, stock]) => ({ taille, stock })),
  }))

  payload.logger.info('Seed : terminé.')
  process.exit(0)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
