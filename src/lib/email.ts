import { Resend } from 'resend'

// Envoi des e-mails transactionnels (commandes, messages) via Resend.
// Sans RESEND_API_KEY : l'envoi est simulé dans la console (dev) ou signalé (prod).

let client: Resend | null = null

export type Mail = { to: string | string[]; subject: string; html: string; text: string; replyTo?: string }

export const expediteur = () => process.env.EMAIL_FROM?.trim() || 'Krakython <onboarding@resend.dev>'

export function expediteurDetail(): { nom: string; adresse: string } {
  const brut = expediteur()
  const m = brut.match(/^(.*?)\s*<\s*([^>]+?)\s*>$/)
  if (!m) return { nom: 'Krakython', adresse: brut }
  return { nom: m[1].trim().replace(/^"|"$/g, '') || 'Krakython', adresse: m[2] }
}

/** 'simule' : pas de clé Resend (dev) ; 'echec' : Resend a refusé ou le réseau a échoué. */
export async function envoyer(mail: Mail): Promise<'envoye' | 'simule' | 'echec'> {
  const cle = process.env.RESEND_API_KEY
  if (!cle) {
    const msg = `[e-mail] RESEND_API_KEY absente : « ${mail.subject} » → ${[mail.to].flat().join(', ')} non envoyé.`
    if (process.env.NODE_ENV === 'production') console.error(msg)
    else console.info(msg)
    return 'simule'
  }
  client ??= new Resend(cle)
  try {
    const res = await client.emails.send({ from: expediteur(), ...mail })
    if (res.error) {
      console.error('[e-mail] échec', res.error)
      return 'echec'
    }
    return 'envoye'
  } catch (err) {
    console.error('[e-mail] exception réseau', err)
    return 'echec'
  }
}

export const echapper = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

/** Gabarit HTML sobre aux couleurs du site (les clients mail ignorent la plupart du CSS). */
export function gabarit(titre: string, corps: string): string {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#F4F8FC;font-family:Arial,Helvetica,sans-serif;color:#1D1D1B">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F8FC;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:3px solid #1D1D1B;border-radius:18px">
<tr><td style="background:#197DC7;border-radius:15px 15px 0 0;padding:20px 24px;color:#FFFFFF;font-size:24px;font-weight:bold">${echapper(titre)}</td></tr>
<tr><td style="padding:22px 24px;font-size:16px;line-height:1.55">${corps}</td></tr>
<tr><td style="padding:14px 24px 20px;font-size:13px;color:#4A5568;border-top:2px dashed #C9D3DE">Krakython · 51 h de jeu contre la leucémie, au profit de la Fédération Leucémie Espoir.</td></tr>
</table></td></tr></table></body></html>`
}
