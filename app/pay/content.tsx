'use client'

import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/ui/navbar'
import { useConverterParams } from '@/ctx/converter-params'
import { useConverter } from '@/hooks/use-converter'
import { Icon } from '@/lib/icons'
import { useCallback, useEffect, useMemo } from 'react'
import { useWidgetTester, WidgetConfig } from '../dry/swapped-onramp/test/use-widget-tester'

export const Content = () => {
  const { params } = useConverterParams()
  const { amount, fromCurrency, toCurrency, toBlockchain } = params
  const { containerRef, isMounted, mountWidget, unmountWidget, error: widgetError } = useWidgetTester()

  const { quote, loadingQuote, initialized, initialize, getQuote } = useConverter()

  const walletAddress = useMemo(() => {
    return walletAddresses[toBlockchain.toLowerCase()]
  }, [toBlockchain])

  // Derive config from params instead of using useState + useEffect
  const config = useMemo<WidgetConfig>(
    () => ({
      // Required
      apiKey: process.env.NEXT_PUBLIC_SANDBOX_PK || process.env.NEXT_PUBLIC_SWAPPED_API_PK || '',
      // Will use SWAPPED_API_SK from server if not provided
      currencyCode: 'USD',
      walletAddress: walletAddress || '',
      environment: 'sandbox',
      // Optional with defaults
      language: 'en',
      method: 'qrph',
      baseCurrencyCode: fromCurrency,
      baseCurrencyAmount: amount,
      email: 'snatch@gspot.com',
      externalCustomerId: 'CUST-001',
      baseCountry: 'US',
      minAmount: '600'
    }),
    [walletAddress, fromCurrency, amount]
  )

  // Validate config before mounting
  const isConfigValid = useMemo(() => {
    return !!(
      config.apiKey &&
      config.apiKey.trim() !== '' &&
      config.currencyCode &&
      config.currencyCode.trim() !== '' &&
      config.walletAddress &&
      config.walletAddress.trim() !== '' &&
      config.environment &&
      (config.environment === 'sandbox' || config.environment === 'production')
    )
  }, [config])

  // Initialize converter on mount
  useEffect(() => {
    initialize()
  }, [initialize])

  // Fetch quote when params change
  useEffect(() => {
    if (!initialized || !amount || !fromCurrency || !toCurrency || !toBlockchain) return

    getQuote({
      fromAmount: amount,
      fromFiatCurrency: fromCurrency,
      toCurrency: toCurrency,
      toBlockchain: toBlockchain
    })
  }, [amount, fromCurrency, toCurrency, toBlockchain, initialized, getQuote])

  const checkConfigs = () => {
    console.log('Config:', config)
    console.log('Config Valid:', isConfigValid)
    console.log('Mounting Conditions:', {
      isMounted,
      isConfigValid,
      walletAddress: !!walletAddress,
      quote: !!quote,
      fromCurrency: !!fromCurrency,
      loadingQuote,
      widgetError: widgetError?.message,
      allConditionsMet: !isMounted && isConfigValid && !!walletAddress && !!quote && !!fromCurrency && !loadingQuote
    })
    console.log('Validation Details:', {
      apiKey: !!config.apiKey && config.apiKey.trim() !== '',
      currencyCode: !!config.currencyCode && config.currencyCode.trim() !== '',
      walletAddress: !!config.walletAddress && config.walletAddress.trim() !== '',
      environment: config.environment === 'sandbox' || config.environment === 'production',
      walletAddressValue: walletAddress,
      quote: !!quote,
      fromCurrency: !!fromCurrency,
      loadingQuote
    })
  }
  const handleUnmount = () => {
    unmountWidget()
  }
  const handleMount = useCallback(async () => {
    try {
      await mountWidget(config)
    } catch (err) {
      console.error('Error mounting widget:', err)
    }
  }, [config, mountWidget])

  useEffect(() => {
    const shouldMount = !isMounted && isConfigValid && walletAddress && quote && fromCurrency && !loadingQuote
    if (shouldMount) {
      console.log('Mount conditions met, calling handleMount')
      handleMount()
    }
  }, [isMounted, isConfigValid, handleMount, walletAddress, quote, loadingQuote, fromCurrency])

  return (
    <main className='min-h-screen'>
      <div className='max-w-2xl mx-auto space-y-0'>
        <Navbar>{!isMounted && <Icon name='spinner-dots' className='size-8 text-indigo-500 mr-8' />}</Navbar>

        {/* Payment Summary Card */}
        <div className='relative rounded-4xl overflow-hidden'>
          <div className='relative p-0'>
            <div ref={containerRef} className='relative rounded-2xl bg-white min-h-175'></div>
          </div>
        </div>

        {/* Action Button */}
        <div className='hidden _flex gap-6 justify-center'>
          <Button
            onClick={handleUnmount}
            className='w-full py-4 rounded-2xl font-medium text-center hover:opacity-90 transition-opacity'>
            Destroy Form
          </Button>
          <Button
            onClick={checkConfigs}
            className='w-full py-4 rounded-2xl font-medium text-center hover:opacity-90 transition-opacity'>
            Verify Config
          </Button>
        </div>
      </div>
    </main>
  )
}

const walletAddresses: Record<string, string> = {
  bitcoin: 'bc1quz07mw5fvlcmmmr6hdsx5vqzq2k42qlj043x0d',
  solana: '3KiR8mnWS486HAFiiN3BDZNkn4dmTjx2FEgBJVFqGKcN',
  ethereum: '0x80C00a0893DD86ba49EA73A64a15B18B8cA5D805',
  polygon: '0x80C00a0893DD86ba49EA73A64a15B18B8cA5D805',
  tron: 'TPbqsJCCRcKeY3eT79XGkPJFyhZpZjKUwk',
  bitcoinCash: 'qz50peuv0cwxj9yg3gz3tvm3g29g2qzjas57cw54n4',
  xrp: 'rs5vATNE1ENuDMd4RqGftoVtRqeWiZqH8Q'
}
