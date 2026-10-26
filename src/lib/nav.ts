export const NAV = [
  { href: '/qui-sommes-nous', label: 'Qui sommes-nous' },
  { href: '/actualites', label: 'Actualités' },
  { href: '/ils-parlent-de-nous', label: 'Ils parlent de nous' },
  { href: '/nos-partenaires', label: 'Partenaires' },
  { href: '/boutique', label: 'Boutique' },
] as const

export const estActif = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`)
