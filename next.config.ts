import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,

  /**
   * Enable hostname configuration for subdomain support
   * This allows the dev server to respond to subdomain requests
   */
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]
  },

  /**
   * Rewrites for production subdomain handling (if not using middleware)
   * Middleware is preferred, but these serve as fallback
   */
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    }
  },
}

export default nextConfig
