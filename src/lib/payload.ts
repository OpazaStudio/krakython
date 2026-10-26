import { cache } from 'react'
import { getPayload } from 'payload'
import type { DataFromGlobalSlug, GlobalSlug } from 'payload'
import config from '@payload-config'

export const getPayloadClient = cache(async () => getPayload({ config }))

export const getGlobal = cache(async <T extends GlobalSlug>(slug: T, depth = 2): Promise<DataFromGlobalSlug<T>> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug, depth }) as Promise<DataFromGlobalSlug<T>>
})

export const getEvenement = () => getGlobal('evenement', 1)

export const getSite = () => getGlobal('site', 1)
