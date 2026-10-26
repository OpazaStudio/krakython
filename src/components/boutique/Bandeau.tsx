import type { ReactNode } from 'react'
import { Anneaux } from '@/components/decor'
import { Coche } from '@/components/icones'
import { PastilleNoire } from '@/components/ui'

// En-tête des pages du tunnel d'achat (panier, commande, retours de paiement).

const FONDS = { bleu: 'bg-bleu', rose: 'bg-rose', nuit: 'bg-nuit' } as const
const ETAPES = ['Panier', 'Coordonnées', 'Paiement'] as const

/** `courante` = 4 : toutes les étapes sont faites. */
export function Etapes({ courante }: { courante: 1 | 2 | 3 | 4 }) {
  return (
    <ol aria-label="Étapes de la commande" className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
      {ETAPES.map((e, i) => {
        const n = i + 1
        const fait = n < courante
        const ici = n === courante
        return (
          <li
            key={e}
            aria-current={ici ? 'step' : undefined}
            className={`kk-pixel inline-flex min-h-10 items-center gap-2 rounded-xl border-[3px] border-encre px-3 text-[12px] tracking-normal ${
              ici ? 'bg-white text-encre shadow-dur-4' : fait ? 'bg-encre text-white' : 'bg-bleu-clair text-encre'
            }`}
          >
            {fait ? <Coche size={14} /> : <span aria-hidden="true">{n}</span>}
            {e}
            {fait && <span className="sr-only">(fait)</span>}
          </li>
        )
      })}
    </ol>
  )
}

export function Bandeau({
  surtitre,
  titre,
  texte,
  couleur = 'bleu',
  etape,
  chevauchement = false,
  children,
}: {
  surtitre?: string
  titre: string
  texte?: string | null
  couleur?: keyof typeof FONDS
  etape?: 1 | 2 | 3 | 4
  /** Laisse de la place pour qu'une carte vienne mordre sur le bandeau. */
  chevauchement?: boolean
  children?: ReactNode
}) {
  return (
    <section aria-labelledby="page-titre" className={`relative overflow-hidden border-b-[3px] border-encre ${FONDS[couleur]}`}>
      <Anneaux opacite={couleur === 'nuit' ? 0.08 : 0.14} />
      <div
        className={`kk-container relative flex flex-wrap items-end justify-between gap-6 pt-[clamp(36px,5vw,64px)] ${chevauchement ? 'pb-[clamp(96px,10vw,128px)]' : 'pb-[clamp(36px,5vw,64px)]'}`}
      >
        <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-4">
          <PastilleNoire>{surtitre}</PastilleNoire>
          <h1 id="page-titre" className="kk-h1 !text-[clamp(42px,5.5vw,76px)]">
            {titre}
          </h1>
          {texte && <p className="m-0 max-w-[620px] text-[clamp(17px,1.5vw,20px)] leading-[1.5] font-extrabold text-white">{texte}</p>}
          {children}
        </div>
        {etape && <Etapes courante={etape} />}
      </div>
    </section>
  )
}
