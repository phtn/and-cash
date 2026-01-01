'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface WidgetConfig {
  // Required parameters
  apiKey: string
  secretKey?: string // Optional - will use SWAPPED_API_SK env var if not provided
  currencyCode: string
  walletAddress: string

  // Optional parameters
  language?: string
  method?: string
  baseCurrencyCode?: string
  lockBaseCurrency?: string
  baseCurrencyAmount?: string
  quoteCurrencyAmount?: string
  email?: string
  externalCustomerId?: string
  redirectUrl?: string
  responseUrl?: string
  customerKYC?: string
  style?: string
  destinationTag?: string
  coverFees?: string
  minAmount?: string
  lockAmount?: string
  baseCountry?: string
  markup?: string

  // Environment
  environment: 'sandbox' | 'production'
}

interface WidgetEvent {
  type: string
  timestamp: number
  data?: unknown
  [key: string]: unknown
}

export const useWidgetTester = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [events, setEvents] = useState<Array<WidgetEvent & { id: string }>>([])
  const [error, setError] = useState<Error | null>(null)
  const [iframeUrl, setIframeUrl] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const addEvent = useCallback((event: WidgetEvent) => {
    setEvents((prev) => [
      ...prev,
      {
        ...event,
        id: `${event.type}-${Date.now()}-${Math.random()}`
      }
    ])
  }, [])

  const generateSignature = useCallback(async (url: string, secretKey?: string): Promise<string> => {
    try {
      const response = await fetch('/api/swapped-onramp/signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, secretKey })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to generate signature' }))
        throw new Error(errorData.message || 'Failed to generate signature')
      }

      const result = await response.json()
      if (result.success) {
        return result.signature
      } else {
        throw new Error(result.message || 'Failed to generate signature')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate signature'
      throw new Error(errorMessage)
    }
  }, [])

  const buildWidgetUrl = useCallback(
    async (config: WidgetConfig): Promise<string> => {
      const baseUrl = config.environment === 'production' ? 'https://widget.swapped.com' : 'https://sandbox.swapped.com'

      const params = new URLSearchParams()

      // Required parameters
      params.append('apiKey', config.apiKey)
      params.append('currencyCode', config.currencyCode)
      params.append('walletAddress', config.walletAddress)

      // Optional parameters
      if (config.language) params.append('language', config.language)
      if (config.method) params.append('method', config.method)
      if (config.baseCurrencyCode) params.append('baseCurrencyCode', config.baseCurrencyCode)
      if (config.lockBaseCurrency) params.append('lockBaseCurrency', config.lockBaseCurrency)
      if (config.baseCurrencyAmount) params.append('baseCurrencyAmount', config.baseCurrencyAmount)
      if (config.quoteCurrencyAmount) params.append('quoteCurrencyAmount', config.quoteCurrencyAmount)
      if (config.email) params.append('email', config.email)
      if (config.externalCustomerId) params.append('externalCustomerId', config.externalCustomerId)
      if (config.redirectUrl) params.append('redirectUrl', encodeURIComponent(config.redirectUrl))
      if (config.responseUrl) params.append('responseUrl', encodeURIComponent(config.responseUrl))
      if (config.customerKYC) params.append('customerKYC', config.customerKYC)
      if (config.style) params.append('style', config.style)
      if (config.destinationTag) params.append('destinationTag', config.destinationTag)
      if (config.coverFees) params.append('coverFees', config.coverFees)
      if (config.minAmount) params.append('minAmount', config.minAmount)
      if (config.lockAmount) params.append('lockAmount', config.lockAmount)
      if (config.baseCountry) params.append('baseCountry', config.baseCountry)
      if (config.markup) params.append('markup', config.markup)

      const urlWithoutSignature = `${baseUrl}?${params.toString()}`

      // Generate signature (secret key from env var SWAPPED_API_SK or from config)
      const signature = await generateSignature(urlWithoutSignature, config.secretKey)

      // Append signature (must be last parameter)
      return `${urlWithoutSignature}&signature=${signature}`
    },
    [generateSignature]
  )

  const mountWidget = useCallback(
    async (config: WidgetConfig) => {
      if (!containerRef.current) {
        setError(new Error('Container element not found'))
        return
      }

      // Clear existing iframe
      if (iframeRef.current) {
        containerRef.current.removeChild(iframeRef.current)
        iframeRef.current = null
      }

      setError(null)
      setEvents([])

      try {
        // Validate required fields
        if (!config.apiKey) throw new Error('API Key is required')
        if (!config.currencyCode) throw new Error('Currency Code is required')
        if (!config.walletAddress) throw new Error('Wallet Address is required')
        // Secret key can be in env var (SWAPPED_API_SK) or provided in config

        // Build widget URL with signature
        // Secret key will be used from env var (SWAPPED_API_SK) if not provided in config
        const url = await buildWidgetUrl(config)
        setIframeUrl(url)

        // Create iframe
        const iframe = document.createElement('iframe')
        iframe.src = url
        iframe.title = 'Buy crypto with Swapped'
        iframe.allow =
          'accelerometer; autoplay; camera; encrypted-media; gyroscope; payment; clipboard-read; clipboard-write'
        iframe.style.width = '100%'
        iframe.style.height = '585px'
        iframe.style.border = 'none'
        iframe.style.borderRadius = '0.75rem'
        iframe.style.display = 'block'
        iframe.style.visibility = 'visible'

        // Log for debugging
        console.log('Mounting widget with URL:', url)
        // Note: You may see console errors/warnings from the widget iframe:
        // - "Intercom Messenger JWT error" - harmless Intercom integration warning
        // - CORS errors from "advancedjs.swapped.com" - widget internal script loading issue
        // These are non-critical and do not affect widget payment functionality.

        // Listen for postMessage events from iframe
        const messageHandler = (event: MessageEvent) => {
          // Only accept messages from widget domain
          const allowedOrigins = ['https://widget.swapped.com', 'https://sandbox.swapped.com']

          if (allowedOrigins.includes(event.origin)) {
            addEvent({
              type: 'widget:message',
              timestamp: Date.now(),
              data: event.data
            })
          }
        }

        // Suppress non-critical errors from widget iframe
        // Note: This filters console errors that bubble up from the iframe
        // These are harmless warnings from Swapped's widget and do not affect functionality
        const originalConsoleError = console.error
        const errorFilter = (...args: unknown[]) => {
          const errorMessage = args.join(' ')
          // Filter out non-critical widget errors:
          // - Intercom JWT errors (harmless authentication warnings)
          // - CORS errors from advancedjs.swapped.com (widget internal script loading issue)
          if (
            errorMessage.includes('Intercom Messenger JWT error') ||
            errorMessage.includes('Invalid intercom_user_jwt') ||
            errorMessage.includes('advancedjs.swapped.com') ||
            errorMessage.includes('Access-Control-Allow-Origin') ||
            errorMessage.includes('blocked by CORS policy')
          ) {
            return // Suppress these non-critical errors
          }
          originalConsoleError.apply(console, args)
        }

        window.addEventListener('message', messageHandler)
        
        // Store original console.error and override to filter Intercom errors
        ;(iframe as unknown as { _originalConsoleError?: typeof console.error })._originalConsoleError = originalConsoleError
        console.error = errorFilter

        // Store message handler for cleanup
        ;(iframe as unknown as { _messageHandler: (event: MessageEvent) => void })._messageHandler = messageHandler

        containerRef.current.appendChild(iframe)
        iframeRef.current = iframe
        setIsMounted(true)

        // Add ready event
        addEvent({
          type: 'ready',
          timestamp: Date.now()
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create widget'
        setError(new Error(errorMessage))
        console.error('Widget creation error:', err)
      }
    },
    [addEvent, buildWidgetUrl]
  )

  const unmountWidget = useCallback(() => {
    if (iframeRef.current && containerRef.current) {
      // Remove message handler
      const messageHandler = (iframeRef.current as unknown as { _messageHandler?: (event: MessageEvent) => void })
        ._messageHandler
      if (messageHandler) {
        window.removeEventListener('message', messageHandler)
      }

      // Restore original console.error if it was overridden
      const iframe = iframeRef.current as unknown as { _originalConsoleError?: typeof console.error }
      if (iframe._originalConsoleError) {
        console.error = iframe._originalConsoleError
      }

      containerRef.current.removeChild(iframeRef.current)
      iframeRef.current = null
      setIsMounted(false)
      setIframeUrl(null)
    }
  }, [])

  const destroyWidget = useCallback(() => {
    unmountWidget()
    setEvents([])
    setError(null)
  }, [unmountWidget])

  const clearEvents = useCallback(() => {
    setEvents([])
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    const ref = containerRef.current
    return () => {
      if (iframeRef.current && ref) {
        try {
          const messageHandler = (iframeRef.current as unknown as { _messageHandler?: (event: MessageEvent) => void })
            ._messageHandler
          if (messageHandler) {
            window.removeEventListener('message', messageHandler)
          }
          ref.removeChild(iframeRef.current)
        } catch {
          // Ignore errors during cleanup
        }
      }
    }
  }, [])

  return {
    containerRef,
    isMounted,
    events,
    error,
    iframeUrl,
    mountWidget,
    unmountWidget,
    destroyWidget,
    clearEvents
  }
}
