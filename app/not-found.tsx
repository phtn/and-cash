'use client'

import { Suspense } from 'react'

function NotFoundContent() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold mb-4'>404</h1>
        <p className='text-muted-foreground'>Page not found</p>
      </div>
    </div>
  )
}

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  )
}
