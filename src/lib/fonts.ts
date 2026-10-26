import localFont from 'next/font/local'

// Polices auto-hébergées (fichiers woff2 dans src/fonts, licence OFL) :
// aucune requête vers Google au build ni dans le navigateur.
export const lilita = localFont({
  src: [{ path: '../fonts/LilitaOne-400.woff2', weight: '400', style: 'normal' }],
  variable: '--font-lilita',
  display: 'swap',
})

export const nunito = localFont({
  src: [
    { path: '../fonts/Nunito-500.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/Nunito-600.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/Nunito-700.woff2', weight: '700', style: 'normal' },
    { path: '../fonts/Nunito-800.woff2', weight: '800', style: 'normal' },
    { path: '../fonts/Nunito-900.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-nunito',
  display: 'swap',
})

export const silkscreen = localFont({
  src: [
    { path: '../fonts/Silkscreen-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Silkscreen-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-silkscreen',
  display: 'swap',
})
