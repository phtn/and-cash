'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { useSubdomainHref } from '@/hooks/use-subdomain-href'
import type { SubdomainKey } from '@/lib/subdomains'

interface SubdomainLinkProps extends Omit<ComponentProps<typeof Link>, 'href'> {
  subdomain: SubdomainKey
  path?: string
}

/**
 * A link component that navigates to a subdomain URL
 *
 * @example
 * <SubdomainLink subdomain="commerce">Go to Commerce</SubdomainLink>
 * <SubdomainLink subdomain="onramp" path="/test">Onramp Tester</SubdomainLink>
 */
export function SubdomainLink({ subdomain, path = '/', children, ...props }: SubdomainLinkProps) {
  const href = useSubdomainHref(subdomain, path)

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}
