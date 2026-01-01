export type { HelioEmbedConfig } from '@heliofi/checkout-react'
export type RequestType = 'paylink' | 'charge' | 'transaction' | 'subscription' | 'deposit' | 'currency' | 'webhooks'

export interface MoonpayRequest<T> {
  type: RequestType
  method: string
  data: T
}
