'use client'
import { useEffect, useRef, useState } from 'react'
import { isLivePreviewEvent, mergeData, ready } from '@payloadcms/live-preview'
import { getClientSideURL } from '@/utilities/getURL'

type Target = { globalSlug?: string; collectionSlug?: string }

export function useLiveDoc<T extends Record<string, any>>(initial: T, target: Target, depth = 1): T {
  const [data, setData] = useState(initial)
  const current = useRef(initial)

  useEffect(() => {
    const serverURL = getClientSideURL()
    const onMessage = async (event: MessageEvent) => {
      if (!isLivePreviewEvent(event, serverURL)) return
      const { collectionSlug, data: incoming, globalSlug, locale } = event.data as {
        collectionSlug?: string; data: Partial<T> & { id?: unknown }; globalSlug?: string; locale?: string
      }
      if (target.globalSlug) {
        if (globalSlug !== target.globalSlug) return
      } else if (target.collectionSlug) {
        if (collectionSlug !== target.collectionSlug) return
        if (incoming?.id !== undefined && current.current.id !== undefined && incoming.id !== current.current.id) return
      }
      try {
        const merged = await mergeData<T>({ collectionSlug, depth, globalSlug, incomingData: incoming, initialData: current.current, locale, serverURL })
        if (!merged || typeof merged !== 'object' || 'errors' in merged) return
        current.current = merged
        setData(merged)
      } catch {}
    }
    window.addEventListener('message', onMessage)
    ready({ serverURL })
    return () => window.removeEventListener('message', onMessage)
  }, [target.globalSlug, target.collectionSlug, depth])

  return data
}
