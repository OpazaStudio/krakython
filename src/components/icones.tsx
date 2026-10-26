import type { SVGProps } from 'react'

// Pictos au trait des maquettes (24×24, contour arrondi), dessinés en currentColor.

type P = SVGProps<SVGSVGElement> & { size?: number; trait?: number }

const Base = ({ size = 22, trait = 2.5, children, ...rest }: P & { children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={trait} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...rest}>
    {children}
  </svg>
)

export const Panier = (p: P) => (
  <Base {...p}>
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="18" cy="20" r="1.5" />
    <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6.2" />
  </Base>
)
export const Coeur = (p: P) => (
  <Base trait={2.6} {...p}>
    <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" />
  </Base>
)
export const Lecture = ({ size = 20, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
    <path d="M8 5v14l11-7z" />
  </svg>
)
export const Coche = (p: P) => (
  <Base trait={3} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Base>
)
export const Fleche = (p: P) => (
  <Base trait={2.8} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
)
export const Menu = (p: P) => (
  <Base trait={2.8} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Base>
)
export const Croix = (p: P) => (
  <Base trait={2.8} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Base>
)
export const Externe = (p: P) => (
  <Base {...p}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </Base>
)
export const Lien = (p: P) => (
  <Base {...p}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </Base>
)

const DESSINS: Record<string, React.ReactNode> = {
  manette: (
    <>
      <path d="M6 9h12a4 4 0 0 1 4 4v1.5a3.5 3.5 0 0 1-6.3 2.1L14.5 15h-5l-1.2 1.6A3.5 3.5 0 0 1 2 14.5V13a4 4 0 0 1 4-4z" />
      <path d="M7 11.5v3M5.5 13h3" />
      <circle cx="16" cy="12" r=".9" />
      <circle cx="18" cy="14" r=".9" />
    </>
  ),
  quiz: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14" />
      <circle cx="12" cy="17" r=".7" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  cadeau: (
    <>
      <rect x="3" y="8" width="18" height="5" rx="1" />
      <path d="M5 13v8h14v-8M12 8v13M12 8S10.5 3 8 4s-.5 4 4 4zM12 8s1.5-5 4-4 .5 4-4 4z" />
    </>
  ),
  coeur: <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" />,
  sac: (
    <>
      <path d="M5 8h14l-1 13H6z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  goutte: (
    <>
      <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
      <path d="M12 11v6M9 14h6" />
    </>
  ),
  groupe: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2A6.5 6.5 0 0 1 21.5 20" />
    </>
  ),
  cadenas: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  camion: (
    <>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </>
  ),
  ordi: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  repas: (
    <>
      <path d="M4 11h16a8 8 0 0 1-16 0z" />
      <path d="M9 4c0 1.5 1 1.5 1 3M13 4c0 1.5 1 1.5 1 3" />
    </>
  ),
  maison: (
    <>
      <path d="M3 21h18M5 21V10l7-5 7 5v11" />
      <path d="M10 21v-6h4v6" />
    </>
  ),
  recherche: (
    <>
      <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" />
      <path d="M7.5 14h9" />
    </>
  ),
  trophee: (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0z" />
      <path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8M10 17h4" />
    </>
  ),
  micro: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="M16 10l5-3v10l-5-3z" />
    </>
  ),
  tv: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M8 21h8M10 3l2 3 2-3" />
    </>
  ),
  ballon: (
    <>
      <ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-35 12 12)" />
      <path d="M9 15l6-6M10.5 11.5l2 2M12 10l2 2" />
    </>
  ),
  photo: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M21 16l-5-5-9 8" />
    </>
  ),
  document: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
}

/** Picto choisi dans l'admin par son nom (champ « Icône »). */
export function Icone({ nom, ...p }: P & { nom?: string | null }) {
  return <Base {...p}>{DESSINS[nom ?? ''] ?? DESSINS.manette}</Base>
}
