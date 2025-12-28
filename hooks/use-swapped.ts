import { swapped } from '@/lib/swapped'
import { useCallback, useState } from 'react'
import type { PaymentLinkResponse, CreateLinkParams } from 'swapped-commerce-sdk'

export const useSwapped = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<PaymentLinkResponse>()

  const createPaymentLink = useCallback(async (params: CreateLinkParams) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await swapped.paymentLinks.create(params)

      if (response.success) {
        setData(response.data)
        console.log('Payment link:', response.data.paymentLink)
        console.log('Order ID:', response.data.orderId)
      } else {
        const errorMessage = response.message || 'Failed to create payment link'
        setError(new Error(errorMessage))
        console.error('Error creating payment link:', errorMessage)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(new Error(errorMessage))
      console.error('Error creating payment link:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, data, createPaymentLink }
}
