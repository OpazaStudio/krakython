import type { Payload } from 'payload'
import type { Commande } from '@/payload-types'
import { echapper, envoyer, gabarit } from '@/lib/email'
import { getServerSideURL } from '@/utilities/getURL'
import { prix } from './argent'
import { MODE_LABELS, type ModeLivraison } from './statuts'

// E-mails envoyés quand une commande est payée : confirmation à l'acheteur, notification à l'asso.

const ligneTexte = (l: NonNullable<Commande['lignes']>[number]) => `${l.quantite} × ${l.nom}${l.taille ? ` (${l.taille})` : ''} · ${prix((l.prixUnitaire ?? 0) * (l.quantite ?? 0))}`

function recapitulatif(c: Commande) {
  const lignes = c.lignes ?? []
  const totaux = [
    ['Articles', prix(c.sousTotal)],
    ...(c.fraisLivraison ? [['Livraison', prix(c.fraisLivraison)]] : []),
    ...(c.donSolidaire ? [['Don solidaire', prix(c.donSolidaire)]] : []),
    ['Total payé', prix(c.total)],
  ]
  const html =
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:12px 0">` +
    lignes
      .map(
        (l) =>
          `<tr><td style="padding:6px 0;border-bottom:1px dashed #C9D3DE">${l.quantite} × ${echapper(l.nom)}${l.taille ? ` <span style="color:#4A5568">(${echapper(l.taille)})</span>` : ''}</td><td align="right" style="padding:6px 0;border-bottom:1px dashed #C9D3DE;white-space:nowrap">${prix((l.prixUnitaire ?? 0) * (l.quantite ?? 0))}</td></tr>`,
      )
      .join('') +
    totaux.map(([k, v], i) => `<tr><td style="padding:6px 0;${i === totaux.length - 1 ? 'font-weight:bold' : ''}">${k}</td><td align="right" style="padding:6px 0;${i === totaux.length - 1 ? 'font-weight:bold' : ''}">${v}</td></tr>`).join('') +
    `</table>`
  const texte = [...lignes.map(ligneTexte), '', ...totaux.map(([k, v]) => `${k} : ${v}`)].join('\n')
  return { html, texte }
}

function livraison(c: Commande, texteRetrait?: string | null) {
  const mode = (c.livraison?.mode ?? 'colissimo') as ModeLivraison
  if (mode === 'retrait') return { html: `<p><strong>${MODE_LABELS.retrait}</strong><br>${echapper(texteRetrait ?? 'On t’écrit pour convenir du moment.')}</p>`, texte: `${MODE_LABELS.retrait} : ${texteRetrait ?? ''}` }
  const adresse = [c.livraison?.adresse, [c.livraison?.codePostal, c.livraison?.ville].filter(Boolean).join(' ')].filter(Boolean).join(', ')
  return { html: `<p><strong>${MODE_LABELS.colissimo}</strong><br>${echapper(c.clientNom)}, ${echapper(adresse)}</p>`, texte: `${MODE_LABELS.colissimo} : ${c.clientNom}, ${adresse}` }
}

/** Renvoie false si un envoi a échoué (à retenter). */
export async function notifierCommandePayee(payload: Payload, commande: Commande): Promise<boolean> {
  const [site, boutique] = await Promise.all([payload.findGlobal({ slug: 'site', depth: 0 }), payload.findGlobal({ slug: 'page-boutique', depth: 0 })])
  const recap = recapitulatif(commande)
  const liv = livraison(commande, boutique.retrait?.texte)
  const asso = process.env.EMAIL_ASSO?.trim() || site.email || undefined

  const acheteur = await envoyer({
    to: commande.clientEmail,
    replyTo: asso,
    subject: `Ta commande ${commande.numero} est confirmée · Krakython`,
    html: gabarit(
      'Merci pour ta commande !',
      `<p>Salut ${echapper(commande.clientNom.split(' ')[0] ?? '')},</p><p>Ton paiement est bien reçu : chaque achat soutient le Krakython et le combat contre la leucémie. Voici ton récapitulatif (commande <strong>${commande.numero}</strong>) :</p>${recap.html}${liv.html}<p>Une question ? Réponds simplement à cet e-mail.</p><p>L’équipe du Krakython</p>`,
    ),
    text: `Merci pour ta commande ${commande.numero} !\n\n${recap.texte}\n\n${liv.texte}\n\nUne question ? Réponds à cet e-mail.\nL’équipe du Krakython`,
  })

  let notification: Awaited<ReturnType<typeof envoyer>> = 'simule'
  if (asso) {
    const lienAdmin = `${getServerSideURL()}/admin/collections/commandes/${commande.id}`
    notification = await envoyer({
      to: asso,
      replyTo: commande.clientEmail,
      subject: `Nouvelle commande ${commande.numero} · ${prix(commande.total)}`,
      html: gabarit(
        `Nouvelle commande ${commande.numero}`,
        `<p><strong>${echapper(commande.clientNom)}</strong> · ${echapper(commande.clientEmail)}${commande.clientTelephone ? ` · ${echapper(commande.clientTelephone)}` : ''}</p>${recap.html}${liv.html}<p><a href="${lienAdmin}" style="color:#1366A8;font-weight:bold">Voir la commande dans l’admin</a></p>`,
      ),
      text: `Nouvelle commande ${commande.numero}\n${commande.clientNom} · ${commande.clientEmail}\n\n${recap.texte}\n\n${liv.texte}\n\n${lienAdmin}`,
    })
  }
  return acheteur !== 'echec' && notification !== 'echec'
}
