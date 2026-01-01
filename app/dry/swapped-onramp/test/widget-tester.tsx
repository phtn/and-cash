'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { useCallback, useState } from 'react'
import { ConfigInputs } from './config-inputs'
import { EventDisplay } from './event-display'
import { useWidgetTester, type WidgetConfig } from './use-widget-tester'

export const WidgetTester = () => {
  const [config, setConfig] = useState<WidgetConfig>({
    // Required
    apiKey: process.env.NEXT_PUBLIC_SANDBOX_PK || process.env.NEXT_PUBLIC_SWAPPED_API_PK || '',
    secretKey: '', // Will use SWAPPED_API_SK from server if not provided
    currencyCode: 'BTC',
    walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    environment: 'sandbox',

    // Optional with defaults
    language: 'en',
    method: 'creditcard',
    baseCurrencyCode: 'USD',
    baseCurrencyAmount: '100',
    email: 'test@example.com',
    externalCustomerId: 'CUST-001',
    baseCountry: 'US',
    minAmount: '10'
  })

  const { containerRef, isMounted, events, error, iframeUrl, mountWidget, unmountWidget, destroyWidget, clearEvents } =
    useWidgetTester()

  const handleConfigChange = useCallback((key: keyof WidgetConfig, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value || undefined
    }))
  }, [])

  const handleMount = useCallback(() => {
    mountWidget(config)
  }, [config, mountWidget])

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      {/* Configuration Panel */}
      <div className='space-y-6'>
        <ConfigInputs
          config={config}
          isMounted={isMounted}
          onConfigChange={handleConfigChange}
          onMount={handleMount}
          onUnmount={unmountWidget}
          onDestroy={destroyWidget}
        />

        {/* Widget Container */}
        <Card>
          <CardHeader>
            <CardTitle>Widget Preview</CardTitle>
            <CardDescription>iFrame widget will appear here when mounted</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className='mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-4'>
                <div className='flex items-start gap-3'>
                  <AlertCircle className='h-5 w-5 text-destructive shrink-0 mt-0.5' />
                  <div className='flex-1'>
                    <h3 className='font-semibold text-destructive mb-1'>Error</h3>
                    <p className='text-sm text-destructive'>{error.message}</p>
                  </div>
                </div>
              </div>
            )}
            {iframeUrl && isMounted && (
              <div className='mb-4 rounded-lg bg-muted/50 border border-border p-3'>
                <p className='text-xs text-muted-foreground mb-1'>Widget URL:</p>
                <p className='text-xs font-mono break-all'>{iframeUrl}</p>
              </div>
            )}
            <div
              ref={containerRef}
              className={`w-full border-2 border-dashed border-border rounded-lg bg-muted/20 ${
                isMounted ? '' : 'flex items-center justify-center min-h-50'
              }`}
              style={{
                minHeight: isMounted ? '585px' : '200px'
              }}>
              {!isMounted && (
                <p className='text-sm text-muted-foreground text-center px-4'>
                  Fill in required parameters and click &quot;Mount Widget&quot; to see the iframe here
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Panel */}
      <div className='lg:sticky lg:top-4 lg:h-fit'>
        <EventDisplay events={events} onClear={clearEvents} />
      </div>
    </div>
  )
}
