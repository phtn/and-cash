'use client'

import { useMemo } from 'react'
import { extractSubdomain, type SubdomainInfo } from '@/lib/subdomains'

/**
 * Hook to get subdomain information on the client side
 * Note: On initial render (SSR), this will return null subdomain
 * It will update on the client after hydration
 */
export function useSubdomain(): SubdomainInfo {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      // SSR fallback - will be updated on client
      return { subdomain: null, domain: 'localhost', isSubdomain: false }
    }

    return extractSubdomain(window.location.hostname)
  }, [])
}

/**
 * Hook to check if we're on a specific subdomain
 */
export function useIsSubdomain(targetSubdomain: string): boolean {
  const { subdomain } = useSubdomain()
  return subdomain === targetSubdomain
}
