'use client'

import { Suspense } from 'react'
import { ConverterParamsProvider } from '@/ctx/converter-params'

export function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className='min-h-screen flex items-center justify-center'>Loading...</div>}>
      <ConverterParamsProvider>{children}</ConverterParamsProvider>
    </Suspense>
  )
}
