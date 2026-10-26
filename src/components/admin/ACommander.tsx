import Link from 'next/link'
import type { ServerProps } from 'payload'
import { prix } from '@/lib/boutique/argent'
import { MODE_LABELS, type ModeLivraison } from '@/lib/boutique/statuts'

// Encart du tableau de bord : ce qu'il reste à préparer et l'état de la cagnotte.
export async function ACommander({ payload }: ServerProps) {
  const [aPreparer, preparees, messages, evenement] = await Promise.all([
    payload.find({ collection: 'commandes', where: { statut: { equals: 'payee' } }, sort: 'createdAt', limit: 8, depth: 0 }),
    payload.count({ collection: 'commandes', where: { statut: { equals: 'preparee' } } }),
    payload.count({ collection: 'messages', where: { traite: { equals: false } } }),
    payload.findGlobal({ slug: 'evenement', depth: 0 }),
  ])
  const cagnotte = evenement.cagnotte
  const pct = cagnotte?.objectif ? Math.min(100, Math.round(((cagnotte.montant ?? 0) / cagnotte.objectif) * 100)) : 0

  return (
    <section className="a-commander">
      <h2 className="a-commander__titre">Bonjour !</h2>
      <p className="a-commander__note">Ce qui attend l’équipe aujourd’hui.</p>
      <div className="a-commander__tuiles">
        <Link className="a-commander__tuile" href="/admin/collections/commandes?where[statut][equals]=payee">
          <span className="a-commander__l">Commandes à préparer</span>
          <span className="a-commander__v">{aPreparer.totalDocs}</span>
          <span className="a-commander__s">payées, pas encore préparées</span>
        </Link>
        <Link className="a-commander__tuile" href="/admin/collections/commandes?where[statut][equals]=preparee">
          <span className="a-commander__l">Prêtes à partir</span>
          <span className="a-commander__v">{preparees.totalDocs}</span>
          <span className="a-commander__s">à expédier ou remettre</span>
        </Link>
        <Link className="a-commander__tuile" href="/admin/collections/messages?where[traite][equals]=false">
          <span className="a-commander__l">Messages non traités</span>
          <span className="a-commander__v">{messages.totalDocs}</span>
          <span className="a-commander__s">formulaire « Nous contacter »</span>
        </Link>
        <Link className="a-commander__tuile" href="/admin/globals/evenement">
          <span className="a-commander__l">Cagnotte {evenement.edition}</span>
          <span className="a-commander__v">{pct} %</span>
          <span className="a-commander__s">
            {prix(cagnotte?.montant ?? 0)} sur {prix(cagnotte?.objectif ?? 0)}
          </span>
        </Link>
      </div>
      {aPreparer.docs.length > 0 && (
        <ul className="a-commander__liste">
          {aPreparer.docs.map((c) => (
            <li key={c.id}>
              <Link href={`/admin/collections/commandes/${c.id}`}>
                <strong>{c.numero}</strong> · {c.clientNom}
              </Link>
              <span>
                {MODE_LABELS[(c.livraison?.mode ?? 'colissimo') as ModeLivraison]} · {prix(c.total)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
