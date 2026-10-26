'use client'
import { useActionState, useId } from 'react'
import { inscrireAlerte, type EtatFormulaire } from '@/app/(frontend)/actions'

/** Inscription à l'alerte du prochain live. Variante sombre (pied de page) ou claire. */
export function FormAlerte({ titre, bouton = 'M’alerter', sombre = false, placeholder = 'ton@email.fr' }: { titre: string; bouton?: string; sombre?: boolean; placeholder?: string }) {
  const [etat, action, envoi] = useActionState<EtatFormulaire, FormData>(inscrireAlerte, undefined)
  const id = useId()
  return (
    <form action={action} className="flex max-w-[440px] flex-col gap-2.5">
      <label htmlFor={id} className="text-[17px] font-black">
        {titre}
      </label>
      <div className="flex flex-wrap gap-2.5">
        <input
          id={id}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={placeholder}
          className={`kk-input min-w-0 flex-[1_1_220px] ${sombre ? '!border-white !bg-encre-2 !text-white placeholder:text-brume' : ''}`}
        />
        <input type="text" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] size-px opacity-0" />
        <button
          type="submit"
          disabled={envoi}
          className={`kk-btn kk-btn--don kk-btn--sm !min-h-[50px] ${sombre ? '!border-white !shadow-[4px_4px_0_var(--color-bleu)]' : ''}`}
        >
          {envoi ? '…' : bouton}
        </button>
      </div>
      <p role="status" aria-live="polite" className={`m-0 min-h-[1.5em] text-[15px] font-bold ${etat?.ok ? (sombre ? 'text-ciel' : 'text-bleu-fonce') : sombre ? 'text-dragee' : 'text-rose-fonce'}`}>
        {etat?.message}
      </p>
    </form>
  )
}
