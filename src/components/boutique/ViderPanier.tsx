'use client'
import { useEffect, useRef } from 'react'
import { usePanier } from '@/lib/panier/PanierProvider'

const CLE = 'krakython.commande.videe'

/**
 * Vide le panier une fois la commande passée. Mémorise la session Stripe traitée
 * pour ne pas vider un nouveau panier si l'on rouvre plus tard la page de confirmation.
 */
export function ViderPanier({ session }: { session: string }) {
  const { pret, vider, setArrondi } = usePanier()
  const fait = useRef(false)

  useEffect(() => {
    if (!pret || fait.current) return
    fait.current = true
    try {
      if (window.localStorage.getItem(CLE) === session) return
      window.localStorage.setItem(CLE, session)
    } catch {
      // stockage indisponible : on vide quand même
    }
    vider()
    setArrondi(false)
  }, [pret, session, vider, setArrondi])

  return null
}
