import type { Commande, PageBoutique } from '@/payload-types'
import { Icone } from '@/components/icones'
import { prix } from '@/lib/boutique/argent'
import { MODE_LABELS, STATUT_LABELS } from '@/lib/boutique/statuts'

// Reçu affiché au retour du paiement (page serveur).

const Ligne = ({ label, valeur, className = '' }: { label: string; valeur: string; className?: string }) => (
  <div className={`flex items-baseline justify-between gap-3 ${className}`}>
    <dt>{label}</dt>
    <dd className="m-0 text-right font-black">{valeur}</dd>
  </div>
)

export function Recu({ commande, reglages }: { commande: Commande; reglages: Pick<PageBoutique, 'colissimo' | 'retrait'> }) {
  const { livraison } = commande
  const enAttente = commande.statut === 'en_attente'
  return (
    <article aria-labelledby="recu-titre" className="overflow-hidden rounded-[28px] border-[3px] border-encre bg-white shadow-dur-8">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 bg-encre px-[clamp(20px,3vw,32px)] py-4 text-white">
        <h2 id="recu-titre" className="kk-display m-0 text-[28px] leading-none font-normal">
          Ton reçu
        </h2>
        <span className="kk-pixel text-[13px] text-ciel">
          <span className="sr-only">Commande numéro </span>
          {commande.numero}
        </span>
      </div>

      <div className="flex flex-col gap-5 p-[clamp(20px,3vw,32px)]">
        <span
          className={`inline-flex items-center gap-2 self-start rounded-full border-2 border-encre px-3 py-1.5 text-[14px] font-extrabold ${enAttente ? 'bg-dragee' : 'bg-bleu-clair'}`}
        >
          <Icone nom={enAttente ? 'recherche' : 'trophee'} size={16} trait={2.6} />
          {STATUT_LABELS[commande.statut]}
        </span>

        <ul className="m-0 flex list-none flex-col p-0">
          {(commande.lignes ?? []).map((l, i) => (
            <li key={l.id ?? i} className="flex items-baseline justify-between gap-4 border-b-2 border-dashed border-brume py-3 first:pt-0">
              <span className="flex min-w-0 flex-col">
                <span className="text-[17px] font-black">{l.nom}</span>
                <span className="text-[14px] font-bold text-gris">
                  {l.taille ? `Taille ${l.taille} · ` : ''}
                  {l.quantite} × {prix(l.prixUnitaire)}
                </span>
              </span>
              <span className="text-[17px] font-black whitespace-nowrap tabular-nums">{prix(l.prixUnitaire * l.quantite)}</span>
            </li>
          ))}
        </ul>

        <dl className="m-0 flex flex-col gap-2 text-[16px] font-bold">
          <Ligne label="Sous-total" valeur={prix(commande.sousTotal)} />
          <Ligne label="Livraison" valeur={commande.fraisLivraison ? prix(commande.fraisLivraison) : 'Gratuit'} />
          {!!commande.donSolidaire && <Ligne label="Don solidaire" valeur={prix(commande.donSolidaire)} className="text-rose-fonce" />}
          <div className="mt-1 flex items-baseline justify-between gap-3 border-t-[3px] border-encre pt-3">
            <dt className="text-[18px] font-black">Total{enAttente ? '' : ' payé'}</dt>
            <dd className="kk-display m-0 text-[34px] leading-none">{prix(commande.total)}</dd>
          </div>
        </dl>

        <div className="flex items-start gap-3.5 rounded-[18px] border-[3px] border-encre bg-papier p-4">
          <span className={`grid size-12 shrink-0 place-items-center rounded-[14px] border-[3px] border-encre text-white ${livraison.mode === 'colissimo' ? 'bg-bleu' : 'bg-rose'}`}>
            <Icone nom={livraison.mode === 'colissimo' ? 'camion' : 'maison'} size={22} />
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[17px] font-black">{MODE_LABELS[livraison.mode]}</span>
            <span className="text-[15px] leading-snug font-semibold text-texte">
              {livraison.mode === 'colissimo'
                ? `Expédition vers ${[livraison.codePostal, livraison.ville].filter(Boolean).join(' ')}${reglages.colissimo?.delai ? `, ${reglages.colissimo.delai}` : ''}. Tu recevras le numéro de suivi par e-mail.`
                : reglages.retrait?.texte || 'On t’écrit pour convenir du moment du retrait.'}
            </span>
          </span>
        </div>
      </div>
    </article>
  )
}
