'use client'

import { buildSubdomainUrl, extractSubdomain, type SubdomainKey } from '@/lib/subdomains'
import { useMemo } from 'react'

/**
 * Hook to generate subdomain URLs based on the current domain
 */
export function useSubdomainHref(subdomain: SubdomainKey, path = '/'): string {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      // SSR fallback - use localhost
      return buildSubdomainUrl(subdomain, 'localhost', path)
    }

    const { domain } = extractSubdomain(window.location.hostname)
    return buildSubdomainUrl(subdomain, domain, path)
  }, [subdomain, path])
}

/**
 * Hook to get a function that builds subdomain URLs
 * Useful when you need to generate multiple subdomain links
 */
export function useSubdomainUrlBuilder() {
  return useMemo(() => {
    const domain = typeof window === 'undefined' ? 'localhost' : extractSubdomain(window.location.hostname).domain
    return (subdomain: SubdomainKey, path = '/') => buildSubdomainUrl(subdomain, domain, path)
  }, [])
}
