import Image from 'next/image'
import { isMedia, mediaAlt, mediaDims, mediaUrl, type MediaRef } from '@/lib/media'

type Props = {
  media: MediaRef
  alt?: string
  className?: string
  sizes?: string
  priority?: boolean
  fill?: boolean
  size?: 'miniature' | 'carte' | 'large'
  style?: React.CSSProperties
  /** Avec `fill` : logo entier, calé à gauche (au lieu d'un recadrage). */
  contain?: boolean
}

export function Img({ media, alt, className = '', sizes = '100vw', priority = false, fill = false, size, style, contain = false }: Props) {
  const src = mediaUrl(media, size) ?? mediaUrl(media)
  if (!src || !isMedia(media)) return null
  const { width, height } = mediaDims(media)
  const a = alt ?? mediaAlt(media)
  const pos = media.focalX != null && media.focalY != null ? `${media.focalX}% ${media.focalY}%` : undefined
  if (fill) return <Image src={src} alt={a} fill sizes={sizes} priority={priority} className={className} style={{ objectFit: contain ? 'contain' : 'cover', objectPosition: contain ? 'left center' : pos, ...style }} />
  return <Image src={src} alt={a} width={width} height={height} sizes={sizes} priority={priority} className={className} style={style} />
}
