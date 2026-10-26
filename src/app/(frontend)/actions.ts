'use server'
import * as z from 'zod'
import { getPayloadClient, getSite } from '@/lib/payload'
import { autorise } from '@/lib/limite'
import { echapper, envoyer, gabarit } from '@/lib/email'
import { SUJETS_MESSAGE } from '@/collections/Messages'

export type EtatFormulaire = { ok: true; message: string } | { ok: false; message: string } | undefined

const EmailSchema = z.email({ error: 'Adresse e-mail invalide.' })

/** Inscription à l'alerte du prochain live (pied de page, page Actualités). */
export async function inscrireAlerte(_prev: EtatFormulaire, form: FormData): Promise<EtatFormulaire> {
  if (String(form.get('site') ?? '')) return { ok: true, message: 'C’est noté, on te prévient !' } // pot de miel anti-robots
  const email = EmailSchema.safeParse(String(form.get('email') ?? '').trim().toLowerCase())
  if (!email.success) return { ok: false, message: 'Adresse e-mail invalide.' }
  if (!(await autorise('alerte'))) return { ok: false, message: 'Trop d’essais, réessaie dans un moment.' }
  try {
    const payload = await getPayloadClient()
    const deja = await payload.find({ collection: 'abonnes', where: { email: { equals: email.data } }, limit: 1, overrideAccess: true })
    if (!deja.totalDocs) await payload.create({ collection: 'abonnes', data: { email: email.data }, overrideAccess: true })
    return { ok: true, message: 'C’est noté, on te prévient du prochain live !' }
  } catch (err) {
    console.error('[alerte] inscription impossible', err)
    return { ok: false, message: 'Oups, ça n’a pas marché. Réessaie dans un instant.' }
  }
}

const MessageSchema = z.object({
  nom: z.string().trim().min(2, { error: 'Ton nom est requis.' }).max(120),
  email: EmailSchema,
  structure: z.string().trim().max(160).optional(),
  sujet: z.enum(SUJETS_MESSAGE.map((s) => s.value) as [string, ...string[]]).default('autre'),
  soutien: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, { error: 'Ton message est un peu court.' }).max(4000),
})

/** Formulaire « Nous contacter » : enregistré dans l'admin et envoyé par e-mail. */
export async function envoyerMessage(_prev: EtatFormulaire, form: FormData): Promise<EtatFormulaire> {
  if (String(form.get('site') ?? '')) return { ok: true, message: 'Message envoyé, merci !' }
  const brut = Object.fromEntries(['nom', 'email', 'structure', 'sujet', 'soutien', 'message'].map((k) => [k, String(form.get(k) ?? '') || undefined]))
  const parse = MessageSchema.safeParse(brut)
  if (!parse.success) return { ok: false, message: parse.error.issues[0]?.message ?? 'Saisie invalide.' }
  if (!(await autorise('message'))) return { ok: false, message: 'Trop de messages envoyés, réessaie plus tard.' }
  const m = parse.data
  try {
    const payload = await getPayloadClient()
    await payload.create({ collection: 'messages', data: m as never, overrideAccess: true })
    const site = await getSite()
    const dest = process.env.EMAIL_ASSO?.trim() || site.email
    if (dest) {
      const sujet = SUJETS_MESSAGE.find((s) => s.value === m.sujet)?.label ?? 'Message'
      const lignes = [
        `<p><strong>${echapper(m.nom)}</strong> (${echapper(m.email)})${m.structure ? ` · ${echapper(m.structure)}` : ''}</p>`,
        m.soutien ? `<p>Soutien proposé : ${echapper(m.soutien)}</p>` : '',
        `<p style="white-space:pre-wrap">${echapper(m.message)}</p>`,
      ].join('')
      await envoyer({
        to: dest,
        replyTo: m.email,
        subject: `[Site] ${sujet} · ${m.nom}`,
        html: gabarit(`Nouveau message · ${sujet}`, lignes),
        text: `${m.nom} (${m.email})${m.structure ? ` · ${m.structure}` : ''}\n${m.soutien ? `Soutien : ${m.soutien}\n` : ''}\n${m.message}`,
      })
    }
    return { ok: true, message: 'Message envoyé ! L’équipe te répond très vite.' }
  } catch (err) {
    console.error('[message] envoi impossible', err)
    return { ok: false, message: 'Oups, le message n’est pas parti. Réessaie dans un instant.' }
  }
}
