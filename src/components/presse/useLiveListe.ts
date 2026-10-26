'use client'
import { useEffect, useRef, useState } from 'react'
import { isLivePreviewEvent, mergeData, ready } from '@payloadcms/live-preview'
import { getClientSideURL } from '@/utilities/getURL'

/**
 * Aperçu en direct d'une liste issue d'une collection : seul l'élément
 * en cours d'édition dans l'admin est remplacé (repéré par son id).
 */
export function useLiveListe<T extends { id: number | string }>(initial: T[], collectionSlug: string, depth = 1): T[] {
  const [items, setItems] = useState(initial)
  const courant = useRef(initial)

  useEffect(() => {
    const serverURL = getClientSideURL()
    const onMessage = async (event: MessageEvent) => {
      if (!isLivePreviewEvent(event, serverURL)) return
      const { collectionSlug: slug, data: incoming, locale } = event.data as { collectionSlug?: string; data?: Partial<T>; locale?: string }
      if (slug !== collectionSlug || incoming?.id === undefined) return
      const index = courant.current.findIndex((i) => i.id === incoming.id)
      if (index < 0) return
      try {
        const merged = await mergeData<T>({ collectionSlug, depth, incomingData: incoming, initialData: courant.current[index], locale, serverURL })
        if (!merged || typeof merged !== 'object' || 'errors' in merged) return
        courant.current = courant.current.map((item, i) => (i === index ? merged : item))
        setItems(courant.current)
      } catch {}
    }
    window.addEventListener('message', onMessage)
    ready({ serverURL })
    return () => window.removeEventListener('message', onMessage)
  }, [collectionSlug, depth])

  return items
}
