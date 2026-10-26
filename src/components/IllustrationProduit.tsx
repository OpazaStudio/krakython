import { LogoKraken } from './decor'

// Illustrations au trait des maquettes, utilisées tant qu'un produit n'a pas de photo.
// Le logo est posé dessus à l'endroit du marquage.

const ENC = '#1D1D1B'

const DESSINS: Record<string, { svg: React.ReactNode; logo: { left: string; top: string; width: string } }> = {
  tshirt: {
    svg: (
      <>
        <path d="M62 34 L84 24 Q100 40 116 24 L138 34 L174 62 L152 88 L140 78 L140 178 L60 178 L60 78 L48 88 L26 62 Z" fill="#197DC7" stroke={ENC} strokeWidth="5" strokeLinejoin="round" />
        <path d="M84 24 Q100 40 116 24" fill="none" stroke={ENC} strokeWidth="5" strokeLinecap="round" />
      </>
    ),
    logo: { left: '38%', top: '36%', width: '24%' },
  },
  sweat: {
    svg: (
      <>
        <path d="M58 52 Q64 22 100 20 Q136 22 142 52 L172 72 L180 166 L154 170 L146 104 L146 180 L54 180 L54 104 L46 170 L20 166 L28 72 Z" fill="#F23852" stroke={ENC} strokeWidth="5" strokeLinejoin="round" />
        <path d="M76 54 Q100 74 124 54 Q120 34 100 32 Q80 34 76 54 Z" fill="#B01E38" stroke={ENC} strokeWidth="5" strokeLinejoin="round" />
        <path d="M70 146 H130 L138 174 H62 Z" fill="none" stroke={ENC} strokeWidth="4" strokeLinejoin="round" />
        <path d="M92 68 V86 M108 68 V86" stroke={ENC} strokeWidth="4" strokeLinecap="round" />
      </>
    ),
    logo: { left: '39%', top: '46%', width: '22%' },
  },
  casquette: {
    svg: (
      <>
        <path d="M42 126 Q42 62 100 58 Q158 62 158 126 Z" fill="#197DC7" stroke={ENC} strokeWidth="5" strokeLinejoin="round" />
        <path d="M28 124 Q100 108 172 124 Q182 142 152 148 Q100 158 48 148 Q18 142 28 124 Z" fill="#F23852" stroke={ENC} strokeWidth="5" strokeLinejoin="round" />
        <circle cx="100" cy="58" r="7" fill="#F23852" stroke={ENC} strokeWidth="4" />
      </>
    ),
    logo: { left: '39%', top: '36%', width: '22%' },
  },
  mug: {
    svg: (
      <>
        <path d="M136 84 Q172 84 172 118 Q172 152 136 152" fill="none" stroke={ENC} strokeWidth="20" strokeLinecap="round" />
        <path d="M136 84 Q172 84 172 118 Q172 152 136 152" fill="none" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" />
        <path d="M40 56 H142 V158 Q142 178 122 178 H60 Q40 178 40 158 Z" fill="#FFFFFF" stroke={ENC} strokeWidth="5" strokeLinejoin="round" />
        <path d="M40 56 H142 V76 H40 Z" fill="#197DC7" stroke={ENC} strokeWidth="5" strokeLinejoin="round" />
      </>
    ),
    logo: { left: '31%', top: '45%', width: '28%' },
  },
  tapis: {
    svg: (
      <>
        <rect x="16" y="54" width="168" height="108" rx="16" fill="#0B2340" stroke={ENC} strokeWidth="5" />
        <circle cx="38" cy="76" r="5" fill="none" stroke="#9FD0F5" strokeWidth="3" />
        <circle cx="162" cy="140" r="5" fill="none" stroke="#9FD0F5" strokeWidth="3" />
        <circle cx="160" cy="76" r="5" fill="none" stroke="#FFC7CF" strokeWidth="3" />
        <circle cx="40" cy="140" r="5" fill="none" stroke="#FFC7CF" strokeWidth="3" />
      </>
    ),
    logo: { left: '35%', top: '38%', width: '30%' },
  },
  tote: {
    svg: (
      <>
        <path d="M74 74 V54 Q74 30 100 30 Q126 30 126 54 V74" fill="none" stroke={ENC} strokeWidth="8" strokeLinecap="round" />
        <path d="M42 70 H158 L166 182 H34 Z" fill="#FFFFFF" stroke={ENC} strokeWidth="5" strokeLinejoin="round" />
        <path d="M42 70 H158 L159 86 H41 Z" fill="#F23852" stroke={ENC} strokeWidth="4" strokeLinejoin="round" />
      </>
    ),
    logo: { left: '35%', top: '50%', width: '30%' },
  },
  stickers: {
    svg: (
      <>
        <circle cx="72" cy="78" r="46" fill="#FFFFFF" stroke={ENC} strokeWidth="5" />
        <g transform="rotate(10 142 128)">
          <rect x="104" y="90" width="76" height="76" rx="18" fill="#F23852" stroke={ENC} strokeWidth="5" />
          <text x="142" y="140" textAnchor="middle" fontFamily="var(--font-lilita), sans-serif" fontSize="34" fill="#FFFFFF">
            GG
          </text>
        </g>
        <g transform="rotate(-8 74 156)">
          <rect x="24" y="134" width="100" height="44" rx="22" fill="#197DC7" stroke={ENC} strokeWidth="5" />
          <text x="74" y="163" textAnchor="middle" fontFamily="var(--font-lilita), sans-serif" fontSize="18" fill="#FFFFFF">
            POUR MAX
          </text>
        </g>
      </>
    ),
    logo: { left: '21%', top: '24%', width: '30%' },
  },
  'porte-cles': {
    svg: (
      <>
        <circle cx="100" cy="40" r="15" fill="none" stroke={ENC} strokeWidth="6" />
        <path d="M100 55 V72" stroke={ENC} strokeWidth="6" strokeLinecap="round" />
        <circle cx="100" cy="124" r="54" fill="#197DC7" stroke={ENC} strokeWidth="5" />
        <circle cx="100" cy="124" r="42" fill="#FFFFFF" stroke={ENC} strokeWidth="3" />
      </>
    ),
    logo: { left: '35%', top: '47%', width: '30%' },
  },
}

export function IllustrationProduit({ type }: { type?: string | null }) {
  const d = DESSINS[type ?? ''] ?? DESSINS.tshirt
  return (
    <>
      <svg viewBox="0 0 200 200" aria-hidden="true" className="absolute inset-0 size-full">
        {d.svg}
      </svg>
      <div className="absolute" style={d.logo}>
        <LogoKraken className="h-auto w-full" taille={120} />
      </div>
    </>
  )
}
