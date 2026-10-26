import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { AnnonceBar } from '@/components/AnnonceBar'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { JsonLd } from '@/components/JsonLd'
import { SiteProvider } from '@/lib/contexte'
import { lilita, nunito, silkscreen } from '@/lib/fonts'
import { PanierProvider } from '@/lib/panier/PanierProvider'
import { getEvenement, getSite } from '@/lib/payload'
import { SITE } from '@/lib/seo'
import { getServerSideURL } from '@/utilities/getURL'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: { default: `${SITE.name} · ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description:
    'Le Krakython, marathon caritatif de jeux vidéo : 51 heures de live sur Twitch au profit de la Fédération Leucémie Espoir, en mémoire de Maxime « Krakeunz ».',
  applicationName: SITE.name,
  robots: { index: true, follow: true },
}

export const viewport: Viewport = { themeColor: '#197DC7' }

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [evenement, site] = await Promise.all([getEvenement(), getSite()])
  const base = getServerSideURL()
  const sameAs = Object.values(site.reseaux ?? {}).filter((v): v is string => typeof v === 'string' && v.startsWith('http'))

  return (
    <html lang="fr" className={`${lilita.variable} ${nunito.variable} ${silkscreen.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'NGO',
            '@id': `${base}/#asso`,
            name: site.nomAsso,
            alternateName: 'Krakython',
            url: base,
            logo: `${base}/images/logo-kraken.webp`,
            ...(site.email ? { email: site.email } : {}),
            sameAs,
          }}
        />
        <SiteProvider evenement={evenement} site={site}>
          <PanierProvider>
            <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:font-black">
              Aller au contenu
            </a>
            <AnnonceBar />
            <Header />
            <main id="contenu" className="flex-1 overflow-x-clip">
              {children}
            </main>
            <Footer />
          </PanierProvider>
        </SiteProvider>
      </body>
    </html>
  )
}
