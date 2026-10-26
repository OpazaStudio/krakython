'use client'
import { useEffect, useRef, useState } from 'react'
import { Lien } from '@/components/icones'

const BTN = 'kk-btn kk-btn--blanc min-h-[46px] gap-2 rounded-xl px-[18px] text-[15px] shadow-dur-3 hover:shadow-dur-5'

/** Copie dans le presse-papiers, avec repli pour les navigateurs sans l’API Clipboard. */
async function copier(texte: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texte)
    return true
  } catch {
    const zone = document.createElement('textarea')
    zone.value = texte
    zone.setAttribute('readonly', '')
    zone.style.position = 'fixed'
    zone.style.opacity = '0'
    document.body.appendChild(zone)
    zone.select()
    const ok = document.execCommand('copy')
    zone.remove()
    return ok
  }
}

/** Boutons de partage d’un article : X, Facebook, copier le lien. */
export function Partage({ url, titre }: { url: string; titre: string }) {
  const [etat, setEtat] = useState<'' | 'ok' | 'erreur'>('')
  const minuteur = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(minuteur.current), [])

  const surCopie = async () => {
    const ok = await copier(url)
    setEtat(ok ? 'ok' : 'erreur')
    clearTimeout(minuteur.current)
    minuteur.current = setTimeout(() => setEtat(''), 2500)
  }

  const u = encodeURIComponent(url)
  return (
    <div className="mt-9 flex flex-wrap items-center gap-3 border-y-[3px] border-dashed border-brume py-[22px]">
      <span className="kk-pixel mr-1.5 text-[13px] tracking-normal text-gris">Partager</span>
      <a href={`https://x.com/intent/post?url=${u}&text=${encodeURIComponent(titre)}`} target="_blank" rel="noopener" className={BTN} aria-label="Partager sur X (nouvel onglet)">
        X
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener" className={BTN} aria-label="Partager sur Facebook (nouvel onglet)">
        Facebook
      </a>
      <button type="button" onClick={surCopie} className={BTN}>
        <Lien size={16} trait={2.6} />
        {etat === 'ok' ? 'Lien copié' : 'Copier le lien'}
      </button>
      <span role="status" aria-live="polite" className={etat === 'erreur' ? 'text-[15px] font-bold text-rose-fonce' : 'sr-only'}>
        {etat === 'ok' ? 'Lien de l’article copié dans le presse-papiers.' : etat === 'erreur' ? 'Copie impossible : copie l’adresse depuis la barre du navigateur.' : ''}
      </span>
    </div>
  )
}
