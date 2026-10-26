import type { Payload } from 'payload'
import type { PostgresAdapter } from '@payloadcms/db-postgres'

export const drizzleDe = (payload: Payload) => (payload.db as unknown as PostgresAdapter).drizzle
