import type { Media } from '@/payload-types'

export type MediaRef = Media | number | string | null | undefined

export const isMedia = (m: MediaRef): m is Media => typeof m === 'object' && m !== null && 'url' in m

export const mediaUrl = (m: MediaRef, size?: 'miniature' | 'carte' | 'large' | 'og'): string | null => {
  if (!isMedia(m)) return null
  if (size && m.sizes?.[size]?.url) return m.sizes[size]!.url as string
  return m.url ?? null
}

export const mediaAlt = (m: MediaRef, fallback = ''): string => (isMedia(m) && m.alt ? m.alt : fallback)

export const mediaDims = (m: MediaRef): { width: number; height: number } => ({
  width: isMedia(m) && m.width ? m.width : 1600,
  height: isMedia(m) && m.height ? m.height : 1000,
})
