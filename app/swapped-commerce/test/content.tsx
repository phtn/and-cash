'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { EndpointTester } from './endpoint-tester'
import { Card, CardContent } from '@/components/ui/card'

export const Content = () => {
  const apiKey = process.env.NEXT_PUBLIC_SWAPPED_API_PK
  const isApiKeyConfigured = apiKey && apiKey.trim() !== ''

  return (
    <div className='min-h-screen bg-dark'>
      <div className='container mx-auto py-8 md:py-12'>
        <div className='mb-8'>
          <div className='flex items-center gap-4 mb-4'>
            <Link href='/swapped-commerce'>
              <Button variant='ghost' size='sm'>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Back
              </Button>
            </Link>
          </div>
          <h1 className='text-3xl md:text-4xl font-bold tracking-tight mb-2'>Swapped Commerce API</h1>
          <p className='text-muted-foreground text-sm md:text-base'>Test all available endpoints and view responses</p>
        </div>

        {!isApiKeyConfigured && (
          <Card className='mb-6 border-destructive/50 bg-destructive/5'>
            <CardContent className='pt-6'>
              <div className='flex items-start gap-3'>
                <AlertCircle className='h-5 w-5 text-destructive shrink-0 mt-0.5' />
                <div className='flex-1'>
                  <h3 className='font-semibold text-destructive mb-1'>API Key Not Configured</h3>
                  <p className='text-sm text-muted-foreground'>
                    Please set <code className='text-xs bg-background px-1.5 py-0.5 rounded'>NEXT_PUBLIC_SWAPPED_API_PK</code> in your{' '}
                    <code className='text-xs bg-background px-1.5 py-0.5 rounded'>.env.local</code> or{' '}
                    <code className='text-xs bg-background px-1.5 py-0.5 rounded'>.env</code> file.
                  </p>
                  <p className='text-xs text-muted-foreground mt-2'>
                    Example: <code className='text-xs bg-background px-1.5 py-0.5 rounded'>NEXT_PUBLIC_SWAPPED_API_PK=your_api_key_here</code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <EndpointTester />
      </div>
    </div>
  )
}
