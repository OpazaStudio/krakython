export const getServerSideURL = (): string =>
  (
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3200')
  ).replace(/\/$/, '')

export const getClientSideURL = (): string => {
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`
  }
  return getServerSideURL()
}
