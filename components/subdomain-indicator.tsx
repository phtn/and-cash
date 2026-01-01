'use client'

import { useSubdomain } from '@/hooks/use-subdomain'

/**
 * A debug component that shows the current subdomain
 * Useful during development to verify subdomain routing
 */
export function SubdomainIndicator() {
  const { subdomain, domain, isSubdomain } = useSubdomain()

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className='fixed bottom-4 right-4 z-50 rounded-lg bg-zinc-900 px-3 py-2 text-xs text-white shadow-lg'>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center gap-2'>
          <span className='text-zinc-400'>Domain:</span>
          <span className='font-mono'>{domain}</span>
        </div>
        {isSubdomain && (
          <div className='flex items-center gap-2'>
            <span className='text-zinc-400'>Subdomain:</span>
            <span className='font-mono text-emerald-400'>{subdomain}</span>
          </div>
        )}
        {!isSubdomain && (
          <div className='text-zinc-500'>No active subdomain</div>
        )}
      </div>
    </div>
  )
}
