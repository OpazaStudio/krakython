import type { Produit } from '@/payload-types'
import { Img } from '@/components/Img'
import { IllustrationProduit } from '@/components/IllustrationProduit'
import { isMedia } from '@/lib/media'

type Props = {
  produit: Produit
  sizes?: string
  priority?: boolean
  index?: number
  /** Texte alternatif : remplace celui de la photo, et décrit l'illustration de secours. Sans lui, le visuel est décoratif. */
  alt?: string
}

/** Vignette carrée d'un produit : sa photo (la première par défaut), sinon l'illustration au trait. */
export function ProduitVisuel({ produit, sizes = '(min-width:1024px) 25vw, 100vw', priority = false, index = 0, alt }: Props) {
  const photos = (produit.photos ?? []).filter(isMedia)
  const photo = photos[index] ?? photos[0]
  const fond = produit.fond === 'rose' ? 'bg-rose-pale' : 'bg-bleu-clair'
  return (
    <div className={`absolute inset-0 ${fond}`} {...(!photo && alt ? { role: 'img', 'aria-label': alt } : {})}>
      {photo ? <Img media={photo} fill sizes={sizes} priority={priority} size="carte" alt={alt ?? (photo.alt || '')} /> : <IllustrationProduit type={produit.illustration} />}
    </div>
  )
}
