'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Copy, Check, Loader2, Eye } from 'lucide-react'
import { useState } from 'react'

interface ResponseDisplayProps {
  response: unknown
  error: Error | null
  loading: boolean
  onFetchOrderDetails?: (orderId: string) => void
}

export const ResponseDisplay = ({ response, error, loading, onFetchOrderDetails }: ResponseDisplayProps) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const extractLinks = (obj: unknown): Array<{ key: string; url: string }> => {
    const links: Array<{ key: string; url: string }> = []
    
    if (typeof obj !== 'object' || obj === null) return links

    const traverse = (current: unknown, path = ''): void => {
      if (typeof current !== 'object' || current === null) return

      if (Array.isArray(current)) {
        current.forEach((item, index) => traverse(item, `${path}[${index}]`))
        return
      }

      for (const [key, value] of Object.entries(current)) {
        const fullPath = path ? `${path}.${key}` : key

        if (typeof value === 'string') {
          // Check if it's a URL
          try {
            const url = new URL(value)
            if (url.protocol === 'http:' || url.protocol === 'https:') {
              links.push({ key: fullPath, url: value })
            }
          } catch {
            // Not a URL, continue
          }

          // Check for common link field names
          if (
            key.toLowerCase().includes('link') ||
            key.toLowerCase().includes('url') ||
            key.toLowerCase().includes('href') ||
            key.toLowerCase().includes('paymentlink') ||
            key.toLowerCase().includes('checkout')
          ) {
            try {
              const url = new URL(value)
              if (url.protocol === 'http:' || url.protocol === 'https:') {
                links.push({ key: fullPath, url: value })
              }
            } catch {
              // Not a valid URL, but might still be a link
              if (value.startsWith('http://') || value.startsWith('https://')) {
                links.push({ key: fullPath, url: value })
              }
            }
          }
        } else if (typeof value === 'object') {
          traverse(value, fullPath)
        }
      }
    }

    traverse(obj)
    return links
  }

  const formatJSON = (obj: unknown): string => {
    try {
      return JSON.stringify(obj, null, 2)
    } catch {
      return String(obj)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='space-y-4'>
        <div className='rounded-lg bg-destructive/10 border border-destructive/20 p-4'>
          <h3 className='text-sm font-semibold text-destructive mb-2'>Error</h3>
          <p className='text-sm text-destructive'>{error.message}</p>
        </div>
        <div className='rounded-lg bg-muted/50 border border-border p-4'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-sm font-semibold'>Error Details</h3>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => copyToClipboard(formatJSON(error))}
            >
              {copied ? (
                <Check className='h-4 w-4 text-green-500' />
              ) : (
                <Copy className='h-4 w-4' />
              )}
            </Button>
          </div>
          <pre className='text-xs overflow-x-auto'>
            <code>{formatJSON(error)}</code>
          </pre>
        </div>
      </div>
    )
  }

  if (!response) {
    return (
      <div className='flex items-center justify-center py-12 text-muted-foreground'>
        <p className='text-sm'>No response yet. Select an endpoint and execute it.</p>
      </div>
    )
  }

  const links = extractLinks(response)
  const responseStr = formatJSON(response)

  // Extract supported currencies from order details
  const extractSupportedCurrencies = (obj: unknown): Array<{ symbol: string; name: string; blockchain?: string }> => {
    const currencies: Array<{ symbol: string; name: string; blockchain?: string }> = []
    
    if (typeof obj !== 'object' || obj === null) return currencies

    const traverse = (current: unknown): void => {
      if (typeof current !== 'object' || current === null) return

      if (Array.isArray(current)) {
        current.forEach((item) => traverse(item))
        return
      }

      for (const [key, value] of Object.entries(current)) {
        if (key === 'supportedCurrencies' && Array.isArray(value)) {
          value.forEach((currency) => {
            if (
              typeof currency === 'object' &&
              currency !== null &&
              'symbol' in currency &&
              'name' in currency
            ) {
              currencies.push({
                symbol: String(currency.symbol),
                name: String(currency.name),
                blockchain: 'blockchain' in currency && currency.blockchain && typeof currency.blockchain === 'object' && currency.blockchain !== null && 'name' in currency.blockchain
                  ? String(currency.blockchain.name)
                  : undefined,
              })
            }
          })
        } else if (key === 'depositAddress' && typeof value === 'object' && value !== null) {
          traverse(value)
        } else if (typeof value === 'object') {
          traverse(value)
        }
      }
    }

    traverse(obj)
    return currencies
  }

  const supportedCurrencies = extractSupportedCurrencies(response)
  const hasOrderDetails = response && typeof response === 'object' && 'orderDetails' in response

  return (
    <div className='space-y-4'>
      {/* Supported Currencies Section */}
      {supportedCurrencies.length > 0 && (
        <Card className='bg-primary/5 border-primary/20'>
          <div className='p-4 space-y-3'>
            <h3 className='text-sm font-semibold flex items-center gap-2'>
              <ExternalLink className='h-4 w-4' />
              Available Payment Methods
            </h3>
            <p className='text-xs text-muted-foreground'>
              These are the payment currencies available on the payment link. Users can select from these when making a payment.
            </p>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
              {supportedCurrencies.map((currency, index) => (
                <div
                  key={index}
                  className='p-2 rounded-md bg-background border border-border'
                >
                  <div className='font-semibold text-sm'>{currency.symbol}</div>
                  <div className='text-xs text-muted-foreground'>{currency.name}</div>
                  {currency.blockchain && (
                    <div className='text-xs text-muted-foreground mt-1'>
                      {currency.blockchain}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Payment Link Section with Order Details Button */}
      {links.length > 0 && (
        <Card className='bg-primary/5 border-primary/20'>
          <div className='p-4 space-y-3'>
            <h3 className='text-sm font-semibold flex items-center gap-2'>
              <ExternalLink className='h-4 w-4' />
              Payment Link
            </h3>
            <div className='space-y-2'>
              {links.map((link, index) => {
                // Extract orderId from response if available
                let orderId: string | null = null
                if (response && typeof response === 'object') {
                  if ('data' in response && response.data && typeof response.data === 'object' && 'orderId' in response.data) {
                    orderId = String(response.data.orderId)
                  } else if ('orderId' in response) {
                    orderId = String(response.orderId)
                  } else if ('orderDetails' in response && response.orderDetails && typeof response.orderDetails === 'object' && 'id' in response.orderDetails) {
                    orderId = String(response.orderDetails.id)
                  }
                }

                return (
                  <div
                    key={index}
                    className='flex items-center justify-between gap-2 p-2 rounded-md bg-background border border-border'
                  >
                    <div className='flex-1 min-w-0'>
                      <p className='text-xs text-muted-foreground truncate'>{link.key}</p>
                      <a
                        href={link.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-sm text-primary hover:underline break-all'
                      >
                        {link.url}
                      </a>
                      <p className='text-xs text-muted-foreground mt-1'>
                        Click to open payment page where users can select payment methods
                      </p>
                    </div>
                    <div className='flex flex-col gap-2 shrink-0'>
                      <Button
                        variant='ghost'
                        size='sm'
                        asChild
                      >
                        <a href={link.url} target='_blank' rel='noopener noreferrer'>
                          <ExternalLink className='h-4 w-4' />
                        </a>
                      </Button>
                      {orderId && onFetchOrderDetails && (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => onFetchOrderDetails(orderId!)}
                          title='Fetch order details to see supported currencies'
                        >
                          <Eye className='h-3 w-3' />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Response JSON */}
      <div className='rounded-lg bg-muted/50 border border-border p-4'>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='text-sm font-semibold'>Response Data</h3>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => copyToClipboard(responseStr)}
          >
            {copied ? (
              <>
                <Check className='h-4 w-4 text-green-500 mr-2' />
                Copied
              </>
            ) : (
              <>
                <Copy className='h-4 w-4 mr-2' />
                Copy
              </>
            )}
          </Button>
        </div>
        <div className='overflow-x-auto'>
          <pre className='text-xs font-mono whitespace-pre-wrap break-words'>
            <code>{responseStr}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
