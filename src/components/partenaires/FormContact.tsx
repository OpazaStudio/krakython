'use client'
import { useActionState, useId, useState, useSyncExternalStore } from 'react'
import { envoyerMessage, type EtatFormulaire } from '@/app/(frontend)/actions'
import { Coche, Fleche } from '@/components/icones'

// Valeurs du champ `sujet` de la collection Messages.
const SUJETS = [
  { value: 'partenariat', label: 'Partenariat', aide: 'Dis-nous comment tu aimerais nous aider pour la prochaine édition.' },
  { value: 'equipe', label: 'Rejoindre l’équipe', aide: 'Présente-toi et dis-nous comment tu aimerais participer au prochain live.' },
  { value: 'presse', label: 'Presse', aide: 'Ton média, ton sujet, tes délais : on revient vers toi très vite.' },
  { value: 'autre', label: 'Autre', aide: 'Une question, une idée ? Dis-nous tout.' },
] as const

const SOUTIENS = ['Prêt de matériel', 'Nourriture pour le live', 'Un lieu pour l’événement', 'Lots à gagner', 'Autre idée']

const CHAMPS = ['nom', 'email', 'structure', 'sujet', 'soutien', 'message'] as const
type Valeurs = Partial<Record<(typeof CHAMPS)[number], string>>
type Etat = (NonNullable<EtatFormulaire> & { valeurs?: Valeurs }) | undefined

/** Envoie le message ; en cas d'erreur, garde la saisie pour ne pas la perdre au reset du formulaire. */
async function soumettre(_prev: Etat, form: FormData): Promise<Etat> {
  const r = await envoyerMessage(undefined, form)
  if (!r || r.ok) return r
  return { ...r, valeurs: Object.fromEntries(CHAMPS.map((k) => [k, String(form.get(k) ?? '')])) }
}

// Sujet présélectionné par l'URL (?sujet=presse), lu sans casser l'hydratation.
const sansAbonnement = () => () => {}
const sujetDeLUrl = () => new URLSearchParams(window.location.search).get('sujet') ?? ''

const CHAMP =
  'min-h-[54px] w-full rounded-[14px] border-[3px] border-encre bg-white px-4 text-[17px] font-bold text-encre transition-shadow duration-150 focus:shadow-[4px_4px_0_var(--color-bleu)] focus:outline-none'
const LABEL = 'text-[16px] font-black'

export function FormContact({ surtitre, titre, delai }: { surtitre?: string | null; titre?: string | null; delai?: string | null }) {
  const [etat, action, envoi] = useActionState<Etat, FormData>(soumettre, undefined)
  const id = useId()
  const sujetUrl = useSyncExternalStore(sansAbonnement, sujetDeLUrl, () => '')
  const parDefaut = SUJETS.some((s) => s.value === sujetUrl) ? sujetUrl : 'partenariat'

  // Après un envoi réussi le formulaire est vidé : on revient au sujet par défaut.
  // Les boutons radio sont remontés (clé) pour suivre l'URL et le reset du formulaire.
  const [choix, setChoix] = useState<string | null>(null)
  const [etatVu, setEtatVu] = useState(etat)
  const [tour, setTour] = useState(0)
  if (etat !== etatVu) {
    setEtatVu(etat)
    setTour((t) => t + 1)
    if (etat?.ok) setChoix(null)
  }
  const sujet = choix ?? etat?.valeurs?.sujet ?? parDefaut
  const v = etat?.ok ? undefined : etat?.valeurs
  const aide = SUJETS.find((s) => s.value === sujet)?.aide

  return (
    <form
      action={action}
      aria-labelledby={`${id}-titre`}
      className="relative flex flex-col gap-[22px] rounded-[28px] border-[3px] border-encre bg-white p-[clamp(24px,4vw,44px)] shadow-dur-10"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-2">
          {surtitre && <span className="kk-pixel text-[13px] tracking-normal text-rose-bouton">{surtitre}</span>}
          <h2 id={`${id}-titre`} className="kk-display m-0 text-[clamp(34px,4vw,48px)] leading-none">
            {titre || 'Nous contacter'}
          </h2>
        </div>
        {delai && <span className="text-[15px] font-extrabold text-gris">{delai}</span>}
      </div>

      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className={`${LABEL} mb-2.5 p-0`}>C’est à propos de</legend>
        <div key={`${sujetUrl}|${tour}`} className="flex flex-wrap gap-2.5">
          {SUJETS.map((s) => (
            <label key={s.value} className="relative cursor-pointer">
              <input
                type="radio"
                name="sujet"
                value={s.value}
                defaultChecked={sujet === s.value}
                onChange={() => setChoix(s.value)}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-11 items-center rounded-full border-[3px] border-encre bg-white px-4 text-[15px] font-black transition-colors hover:bg-bleu-clair peer-checked:!bg-encre peer-checked:text-white peer-checked:shadow-[3px_3px_0_var(--color-rose)] peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rose">
                {s.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-[18px]">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-nom`} className={LABEL}>
            Nom et prénom
          </label>
          <input id={`${id}-nom`} name="nom" type="text" required minLength={2} maxLength={120} autoComplete="name" defaultValue={v?.nom} className={CHAMP} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-structure`} className={LABEL}>
            Structure
          </label>
          <input
            id={`${id}-structure`}
            name="structure"
            type="text"
            maxLength={160}
            autoComplete="organization"
            placeholder={sujet === 'presse' ? 'Ton média' : 'Entreprise, commerce, club…'}
            defaultValue={v?.structure}
            className={CHAMP}
          />
        </div>
        <div className={`flex flex-col gap-2 ${sujet === 'partenariat' ? '' : 'col-[1/-1]'}`}>
          <label htmlFor={`${id}-email`} className={LABEL}>
            E-mail
          </label>
          <input id={`${id}-email`} name="email" type="email" required autoComplete="email" defaultValue={v?.email} className={CHAMP} />
        </div>
        {sujet === 'partenariat' && (
          <div className="flex flex-col gap-2">
            <label htmlFor={`${id}-soutien`} className={LABEL}>
              Type de soutien
            </label>
            <select key={tour} id={`${id}-soutien`} name="soutien" defaultValue={v?.soutien || SOUTIENS[0]} className={`${CHAMP} cursor-pointer px-3.5`}>
              {SOUTIENS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-message`} className={LABEL}>
          Ton message
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          required
          minLength={10}
          maxLength={4000}
          placeholder={aide}
          defaultValue={v?.message}
          className={`${CHAMP} resize-y py-3.5`}
        />
      </div>

      {/* Pot de miel anti-robots */}
      <input type="text" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] size-px opacity-0" />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <button type="submit" disabled={envoi} className="kk-btn kk-btn--don kk-btn--lg !min-h-[58px] !px-7 !text-[19px]">
          {envoi ? 'Envoi en cours…' : 'Envoyer'}
          <Fleche size={20} />
        </button>
        <div role="status" aria-live="polite" className="min-w-0 flex-[1_1_240px]">
          {etat?.message && (
            <p
              className={`m-0 inline-flex items-center gap-2.5 rounded-[14px] border-[3px] border-encre px-4 py-2.5 text-[16px] leading-[1.35] font-extrabold ${etat.ok ? 'bg-bleu-clair' : 'bg-rose-clair text-rose-fonce'}`}
            >
              {etat.ok ? (
                <Coche size={20} className="shrink-0 text-bleu-fonce" />
              ) : (
                <span aria-hidden="true" className="kk-display text-[22px] leading-none">
                  !
                </span>
              )}
              {etat.message}
            </p>
          )}
        </div>
      </div>
    </form>
  )
}
