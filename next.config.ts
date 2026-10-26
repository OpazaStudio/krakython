import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import { redirects } from './redirects'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  redirects,
  images: {
    formats: ['image/avif', 'image/webp'],
    localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/media/**' }, { pathname: '/**' }],
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
