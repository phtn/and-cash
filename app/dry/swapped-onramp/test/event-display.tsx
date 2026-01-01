'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check, Trash2, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface WidgetEvent {
  type: string
  timestamp: number
  data?: unknown
  [key: string]: unknown
}

interface EventDisplayProps {
  events: Array<WidgetEvent & { id: string }>
  onClear: () => void
}

const getEventColor = (type: string): string => {
  switch (type) {
    case 'ready':
      return 'bg-green-500/10 border-green-500/20 text-green-600'
    case 'widget:message':
      return 'bg-blue-500/10 border-blue-500/20 text-blue-600'
    case 'order:completed':
      return 'bg-green-500/10 border-green-500/20 text-green-600'
    case 'order:created':
      return 'bg-blue-500/10 border-blue-500/20 text-blue-600'
    case 'order:status_changed':
      return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600'
    case 'order:failed':
      return 'bg-red-500/10 border-red-500/20 text-red-600'
    case 'order:cancelled':
      return 'bg-orange-500/10 border-orange-500/20 text-orange-600'
    case 'error':
      return 'bg-red-500/10 border-red-500/20 text-red-600'
    default:
      return 'bg-muted border-border'
  }
}

const formatEventType = (type: string): string => {
  return type
    .split(':')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export const EventDisplay = ({ events, onClear }: EventDisplayProps) => {
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

  const formatJSON = (obj: unknown): string => {
    try {
      return JSON.stringify(obj, null, 2)
    } catch {
      return String(obj)
    }
  }

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Widget Events</CardTitle>
            <CardDescription>Real-time event monitoring from the widget</CardDescription>
          </div>
          {events.length > 0 && (
            <Button variant='ghost' size='sm' onClick={onClear}>
              <Trash2 className='h-4 w-4 mr-2' />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className='flex items-center justify-center py-12 text-muted-foreground'>
            <p className='text-sm'>No events yet. Mount the widget to see events.</p>
          </div>
        ) : (
          <div className='space-y-3 max-h-[600px] overflow-y-auto'>
            {events.map((event) => (
              <div
                key={event.id}
                className={`rounded-lg border p-4 ${getEventColor(event.type)}`}>
                <div className='flex items-start justify-between gap-4 mb-2'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='font-semibold text-sm'>{formatEventType(event.type)}</span>
                      <span className='text-xs opacity-70'>{formatTimestamp(event.timestamp)}</span>
                    </div>
                    {(() => {
                      const orderId = 'orderId' in event && typeof event.orderId === 'string' ? event.orderId : null
                      const error = 'error' in event && typeof event.error === 'string' ? event.error : null
                      const code = 'code' in event && typeof event.code === 'string' ? event.code : null
                      const hasData = 'data' in event && event.data !== undefined

                      return (
                        <>
                          {orderId && (
                            <p className='text-xs opacity-80'>Order ID: {orderId}</p>
                          )}
                          {error && (
                            <div className='text-xs opacity-80 mt-1'>
                              <p>Error: {error}</p>
                              {error.includes('Invalid message origin') && error.includes('localhost') && (
                                <p className='mt-2 text-yellow-600 dark:text-yellow-400 italic'>
                                  ℹ️ This is expected in development. The widget validates postMessage origins for security.
                                  This error won&apos;t occur in production when deployed to a proper domain.
                                </p>
                              )}
                            </div>
                          )}
                          {code && (
                            <p className='text-xs opacity-80 mt-1'>Code: {code}</p>
                          )}
                          {hasData && (
                            <p className='text-xs opacity-80 mt-1'>Data available (see details)</p>
                          )}
                        </>
                      )
                    })()}
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => copyToClipboard(formatJSON(event))}
                    className='shrink-0'>
                    {copied ? (
                      <Check className='h-4 w-4 text-green-500' />
                    ) : (
                      <Copy className='h-4 w-4' />
                    )}
                  </Button>
                </div>
                <details className='mt-2'>
                  <summary className='text-xs cursor-pointer opacity-70 hover:opacity-100'>
                    View Details
                  </summary>
                  <pre className='text-xs mt-2 p-2 bg-background/50 rounded overflow-x-auto'>
                    <code>{formatJSON(event)}</code>
                  </pre>
                </details>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
