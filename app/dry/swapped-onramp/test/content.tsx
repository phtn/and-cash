'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { WidgetTester } from './widget-tester'

export const Content = () => {
  const apiKey = process.env.NEXT_PUBLIC_SANDBOX_PK || process.env.NEXT_PUBLIC_SWAPPED_API_PK
  const isApiKeyConfigured = apiKey && apiKey.trim() !== ''

  return (
    <div className='min-h-screen'>
      <div className='container mx-auto py-2'>
        <div className=''>
          <div className='flex items-center gap-2'>
            <Link href='/swapped-onramp'>
              <Button variant='ghost'>
                <span className='font-brk text-base'>{`&`}</span>
              </Button>
            </Link>
            <h1 className='font-bold font-brk tracking-tight'>Pay with card</h1>
          </div>
        </div>

        {!isApiKeyConfigured && (
          <Card className='mb-6 border-destructive/50 bg-destructive/5'>
            <CardContent className='pt-6'>
              <div className='flex items-start gap-3'>
                <AlertCircle className='h-5 w-5 text-destructive shrink-0 mt-0.5' />
                <div className='flex-1'>
                  <h3 className='font-semibold text-destructive mb-1'>API Key Not Configured</h3>
                  <p className='text-sm text-muted-foreground'>
                    Please set{' '}
                    <code className='text-xs bg-background px-1.5 py-0.5 rounded'>NEXT_PUBLIC_SANDBOX_PK</code> in your{' '}
                    <code className='text-xs bg-background px-1.5 py-0.5 rounded'>.env.local</code> or{' '}
                    <code className='text-xs bg-background px-1.5 py-0.5 rounded'>.env</code> file.
                  </p>
                  <p className='text-xs text-muted-foreground mt-2'>
                    Example:{' '}
                    <code className='text-xs bg-background px-1.5 py-0.5 rounded'>
                      NEXT_PUBLIC_SANDBOX_PK=your_api_key_here
                    </code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className='hidden mb-6 border-yellow-500/50 bg-yellow-500/5'>
          <CardContent className='pt-6'>
            <div className='flex items-start gap-3'>
              <AlertCircle className='h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5' />
              <div className='flex-1'>
                <h3 className='font-semibold text-yellow-600 dark:text-yellow-400 mb-1'>Development Mode Notice</h3>
                <p className='text-sm text-muted-foreground'>
                  When running on <code className='text-xs bg-background px-1.5 py-0.5 rounded'>localhost</code>, you
                  may see postMessage origin validation errors. This is expected behavior - the widget validates message
                  origins for security. These errors will not occur in production when deployed to a proper domain.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <WidgetTester />
      </div>
    </div>
  )
}
