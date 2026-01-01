import { HelioSDK } from '@heliofi/sdk'
export type { CreatePaylinkWithApiDto } from '@heliofi/common'
export type { MoonpayRequest, RequestType } from './types'

let mp: HelioSDK | null = null

export const createClient = () => {
  if (!mp) {
    mp = new HelioSDK({
      apiKey: process.env.NEXT_PUBLIC_MOONPAY_PK!,
      secretKey: process.env.MOONPAY_SK!,
      network: 'mainnet'
    })
  }
  return mp
}
