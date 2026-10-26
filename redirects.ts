import type { NextConfig } from 'next'

// Anciennes adresses du site WordPress (krakython.wordpress.com) vers les nouvelles pages.
// Les pages Qui sommes-nous, Ils parlent de nous, Nos partenaires et Actualités gardent leur adresse.
const anciennes: Array<[string, string]> = [
  ['/2023/11/15/j-30-avant-le-krakython-2023', '/actualites/j-30-avant-le-krakython-2023'],
  ['/2023/11/21/presentation-les-enfourneaux', '/actualites/presentation-les-enfourneaux'],
  ['/2024/11/27/hommage-a-notre-ami', '/actualites/hommage-a-notre-ami'],
  ['/boutique-2', '/boutique'],
  ['/shop', '/boutique'],
  ['/faire-un-don-2', '/faire-un-don'],
]

export const redirects: NextConfig['redirects'] = async () =>
  anciennes.flatMap(([source, destination]) => [
    { source, destination, permanent: true },
    { source: `${source}/`, destination, permanent: true },
  ])
