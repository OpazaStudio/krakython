'use client'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { ajouter, changerQuantite, nettoyer, nombreArticles, retirer, sousTotalCentimes, type AjoutPanier, type LignePanier } from './panier'

const CLE = 'krakython.panier.v1'

type Panier = {
  lignes: LignePanier[]
  nombre: number
  sousTotal: number
  /** false tant que le panier n'a pas été relu depuis le navigateur. */
  pret: boolean
  ajouter: (item: AjoutPanier, quantite?: number) => void
  retirer: (cle: string) => void
  changerQuantite: (cle: string, quantite: number) => void
  vider: () => void
  /** Arrondi solidaire coché au panier (reporté sur le formulaire de commande). */
  arrondi: boolean
  setArrondi: (v: boolean) => void
}

const Ctx = createContext<Panier | null>(null)

export function PanierProvider({ children }: { children: ReactNode }) {
  const [etat, setEtat] = useState<{ lignes: LignePanier[]; pret: boolean }>({ lignes: [], pret: false })
  const [arrondi, setArrondiEtat] = useState(false)

  useEffect(() => {
    let lu: LignePanier[] = []
    try {
      const brut = window.localStorage.getItem(CLE)
      lu = brut ? nettoyer(JSON.parse(brut)) : []
    } catch {
      lu = []
    }
    // Hydratation unique depuis le navigateur : le rendu serveur affiche un panier vide.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEtat({ lignes: lu, pret: true })
    try {
      setArrondiEtat(window.localStorage.getItem(`${CLE}.arrondi`) === '1')
    } catch {}
  }, [])

  const setArrondi = useCallback((v: boolean) => {
    setArrondiEtat(v)
    try {
      window.localStorage.setItem(`${CLE}.arrondi`, v ? '1' : '0')
    } catch {}
  }, [])

  useEffect(() => {
    if (!etat.pret) return
    try {
      window.localStorage.setItem(CLE, JSON.stringify(etat.lignes))
    } catch {
      // Navigation privée ou stockage plein : le panier reste en mémoire.
    }
  }, [etat])

  const maj = useCallback((f: (l: LignePanier[]) => LignePanier[]) => setEtat((e) => ({ ...e, lignes: f(e.lignes) })), [])

  const value: Panier = {
    lignes: etat.lignes,
    nombre: nombreArticles(etat.lignes),
    sousTotal: sousTotalCentimes(etat.lignes),
    pret: etat.pret,
    ajouter: (item, q = 1) => maj((l) => ajouter(l, item, q)),
    retirer: (cle) => maj((l) => retirer(l, cle)),
    changerQuantite: (cle, q) => maj((l) => changerQuantite(l, cle, q)),
    vider: () => maj(() => []),
    arrondi,
    setArrondi,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function usePanier(): Panier {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('usePanier doit être utilisé sous <PanierProvider>.')
  return ctx
}
