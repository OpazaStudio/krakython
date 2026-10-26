import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Actualites } from './collections/Actualites'
import { Membres } from './collections/Membres'
import { Partenaires } from './collections/Partenaires'
import { Presse } from './collections/Presse'
import { Editions } from './collections/Editions'
import { Produits } from './collections/Produits'
import { Commandes } from './collections/Commandes'
import { Messages } from './collections/Messages'
import { Abonnes } from './collections/Abonnes'
import { Evenement } from './globals/Evenement'
import { Site } from './globals/Site'
import { Accueil } from './globals/Accueil'
import { QuiSommesNous } from './globals/QuiSommesNous'
import { PageActualites } from './globals/PageActualites'
import { PagePresse } from './globals/Presse'
import { PagePartenaires } from './globals/PagePartenaires'
import { PageDon } from './globals/PageDon'
import { PageBoutique } from './globals/PageBoutique'
import { Cgv, Confidentialite, MentionsLegales } from './globals/Legal'
import { expediteurDetail } from './lib/email'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const SITE_NAME = 'Krakython'

const CLE_RESEND = process.env.RESEND_API_KEY
const EXPEDITEUR = expediteurDetail()

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' · Krakython',
      description: 'Administration du site du Krakython',
    },
    components: {
      beforeDashboard: ['/components/admin/ACommander#ACommander'],
      graphics: { Logo: '/components/admin/Logo#Logo', Icon: '/components/admin/Icone#Icone' },
    },
    livePreview: {
      breakpoints: [
        { label: 'Téléphone', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablette', name: 'tablet', width: 820, height: 1180 },
        { label: 'Ordinateur', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  i18n: {
    supportedLanguages: { fr },
    fallbackLanguage: 'fr',
  },
  collections: [Actualites, Membres, Editions, Partenaires, Presse, Media, Produits, Commandes, Messages, Abonnes, Users],
  globals: [Accueil, QuiSommesNous, PageActualites, PagePresse, PagePartenaires, PageDon, MentionsLegales, Cgv, Confidentialite, PageBoutique, Evenement, Site],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures.filter((f) => !['upload', 'relationship', 'horizontalRule', 'indent', 'align', 'checklist', 'subscript', 'superscript', 'inlineCode'].includes(f.key)),
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
      FixedToolbarFeature(),
    ],
  }),
  email: CLE_RESEND ? resendAdapter({ apiKey: CLE_RESEND, defaultFromAddress: EXPEDITEUR.adresse, defaultFromName: EXPEDITEUR.nom }) : undefined,
  secret: process.env.PAYLOAD_SECRET || '',
  cors: [getServerSideURL()].filter(Boolean),
  // Le cookie de session de l'admin n'est accepté que depuis le site lui-même.
  csrf: [getServerSideURL(), process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''].filter(Boolean),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    migrationDir: path.resolve(dirname, 'migrations'),
    push: false,
  }),
  sharp,
  plugins: [
    seoPlugin({
      globals: ['accueil', 'qui-sommes-nous', 'page-actualites', 'page-presse', 'page-partenaires', 'page-don', 'page-boutique'],
      collections: ['actualites', 'produits'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => {
        const d = doc as { titre?: string; nom?: string; entete?: { titre?: string } }
        const t = d?.titre ?? d?.nom ?? d?.entete?.titre
        return t ? `${t} · ${SITE_NAME}` : `${SITE_NAME} · 51 h de jeu contre la leucémie`
      },
      generateDescription: ({ doc }) => {
        const d = doc as { resume?: string; sousTitre?: string; entete?: { intro?: string } }
        return d?.resume ?? d?.entete?.intro ?? d?.sousTitre ?? ''
      },
      generateURL: ({ doc, collectionSlug }) => {
        const base = getServerSideURL()
        const slug = (doc as { slug?: string })?.slug
        if (collectionSlug === 'actualites' && slug) return `${base}/actualites/${slug}`
        if (collectionSlug === 'produits' && slug) return `${base}/boutique/${slug}`
        return base
      },
    }),
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: { disablePayloadAccessControl: true } },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
