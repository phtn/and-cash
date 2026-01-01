import { useCallback, useState } from 'react'
import type { EndpointAction } from './endpoint-config'
import { getDefaultParams } from './endpoint-config'

export const useEndpointTester = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointAction | null>(null)
  const [params, setParams] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [loadingIds, setLoadingIds] = useState(false)
  const [response, setResponse] = useState<unknown>(null)
  const [error, setError] = useState<Error | null>(null)
  const [availableIds, setAvailableIds] = useState<Record<string, string[]>>({})
  const [availableCurrencies, setAvailableCurrencies] = useState<Array<{ id: string; symbol: string; name: string }>>(
    []
  )

  const handleEndpointSelect = useCallback((endpoint: EndpointAction) => {
    setSelectedEndpoint(endpoint)
    const defaults = getDefaultParams(endpoint)
    setParams(defaults)
    setResponse(null)
    setError(null)
  }, [])

  const handleParamChange = useCallback((key: string, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }, [])

  const fetchAvailableIds = useCallback(async (type: 'orderId' | 'paymentId' | 'payoutId' | 'currencyId') => {
    setLoadingIds(true)
    setError(null)

    try {
      let ids: string[] = []
      let category = ''
      let method = ''

      switch (type) {
        case 'orderId':
          category = 'orders'
          method = 'list'
          break
        case 'paymentId':
          category = 'orders'
          method = 'list'
          break
        case 'payoutId':
          category = 'payouts'
          method = 'list'
          break
        case 'currencyId':
          category = 'balances'
          method = 'list'
          break
      }

      const response = await fetch('/api/swapped', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category,
          method,
          params: {}
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch ${type}`)
      }

      const result = await response.json()

      switch (type) {
        case 'orderId': {
          if (result.success && result.data?.orders) {
            ids = result.data.orders.map((order: { id: string }) => order.id)
          }
          break
        }
        case 'paymentId': {
          // Payments don't have a list endpoint, but we can get them from orders
          if (result.success && result.data?.orders) {
            const paymentIds: string[] = result.data.orders
              .flatMap((order: { payments?: Array<{ id: string }> }) => order.payments || [])
              .map((payment: { id: string }) => payment.id)
            ids = [...new Set(paymentIds)]
          }
          break
        }
        case 'payoutId': {
          if (result.success && result.data?.payouts) {
            ids = result.data.payouts.map((payout: { id: string }) => payout.id)
          }
          break
        }
        case 'currencyId': {
          if (result.success && result.data?.balances) {
            ids = result.data.balances.map((balance: { currency: { id: string } }) => balance.currency.id)
          }
          break
        }
      }

      if (ids.length > 0) {
        setAvailableIds((prev) => ({ ...prev, [type]: ids }))
        // Auto-select first ID
        const firstId = ids[0]
        if (type === 'orderId') {
          setParams((prev) => ({ ...prev, orderId: firstId }))
        } else if (type === 'paymentId') {
          setParams((prev) => ({ ...prev, paymentId: firstId }))
        } else if (type === 'payoutId') {
          setParams((prev) => ({ ...prev, payoutId: firstId }))
        } else if (type === 'currencyId') {
          setParams((prev) => ({ ...prev, currencyId: firstId }))
        }
      } else {
        setError(new Error(`No ${type} found. Try creating one first.`))
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch IDs'
      setError(new Error(errorMessage))
    } finally {
      setLoadingIds(false)
    }
  }, [])

  const fetchAvailableCurrencies = useCallback(async () => {
    setLoadingIds(true)
    setError(null)

    try {
      const response = await fetch('/api/swapped', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: 'balances',
          method: 'list',
          params: {}
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch currencies' }))
        throw new Error(errorData.message || 'Failed to fetch currencies')
      }

      const result = await response.json()
      if (result.success && result.data?.balances) {
        const currencies = result.data.balances.map(
          (balance: { currency: { id: string; symbol: string; name: string } }) => ({
            id: balance.currency.id,
            symbol: balance.currency.symbol,
            name: balance.currency.name
          })
        )
        setAvailableCurrencies(currencies)

        // Auto-select first currency for fromCurrency if not set
        if (currencies.length > 0 && !params.fromCurrency) {
          setParams((prev) => ({ ...prev, fromCurrency: currencies[0].id }))
        }
      } else {
        const errorMsg = result.message || 'Failed to fetch currencies'
        setError(new Error(errorMsg))
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch currencies'
      setError(new Error(errorMessage))
    } finally {
      setLoadingIds(false)
    }
  }, [params.fromCurrency])

  const executeEndpoint = useCallback(async () => {
    if (!selectedEndpoint) return

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      // Prepare params based on endpoint type
      let requestParams: Record<string, unknown> = {}

      switch (selectedEndpoint.category) {
        case 'orders':
          if (selectedEndpoint.method === 'list') {
            console.log('Fetching orders...[ORDERS]')
            requestParams = {}
          } else if (selectedEndpoint.method === 'get') {
            if (!params.orderId) throw new Error('Order ID is required')
            requestParams = { orderId: params.orderId }
          } else if (selectedEndpoint.method === 'refund') {
            if (!params.orderId) throw new Error('Order ID is required')
            requestParams = {
              orderId: params.orderId,
              amount: params.amount || undefined,
              reason: params.reason || undefined
            }
          }
          break

        case 'paymentLinks':
          if (selectedEndpoint.method === 'create') {
            const purchasePrice = params.price || '1000'
            const purchaseCurrency = params.currency || 'PHP'
            requestParams = {
              purchase: {
                name: params.name || 'Test Purchase',
                price: purchasePrice,
                currency: purchaseCurrency
              },
              metadata: params.customerEmail ? { customerEmail: params.customerEmail } : undefined,
              preferredPayCurrency:
                params.symbol && params.blockchain
                  ? {
                      symbol: params.symbol,
                      blockchain: params.blockchain
                    }
                  : undefined,
              testMode: params.testMode === 'true'
            }
          }
          break

        case 'paymentRoutes':
          if (selectedEndpoint.method === 'create') {
            if (!params.purchaseAmount || !params.purchaseCurrency) {
              throw new Error('Purchase amount and currency are required')
            }
            requestParams = {
              purchaseAmount: params.purchaseAmount,
              purchaseCurrency: params.purchaseCurrency,
              preferredPayCurrency: params.preferredPayCurrency || undefined,
              externalId: params.externalId || undefined,
              customerId: params.customerId || undefined,
              metadata: params.metadata ? JSON.parse(params.metadata) : undefined
            }
          }
          break

        case 'payments':
          if (selectedEndpoint.method === 'get') {
            if (!params.paymentId) throw new Error('Payment ID is required')
            requestParams = { paymentId: params.paymentId }
          }
          break

        case 'balances':
          if (selectedEndpoint.method === 'list') {
            requestParams = {}
          } else if (selectedEndpoint.method === 'get') {
            if (!params.currencyId) throw new Error('Currency ID is required')
            requestParams = { currencyId: params.currencyId }
          }
          break

        case 'quotes':
          if (selectedEndpoint.method === 'get') {
            if (!params.fromAmount || !params.fromFiatCurrency || !params.toCurrency || !params.toBlockchain) {
              throw new Error('From amount, from fiat currency, to currency, and to blockchain are required.')
            }
            requestParams = {
              fromAmount: params.fromAmount,
              fromFiatCurrency: params.fromFiatCurrency,
              toCurrency: params.toCurrency,
              toBlockchain: params.toBlockchain
            }
          }
          break

        case 'currencies':
          if (selectedEndpoint.method === 'list') {
            requestParams = {}
          }
          break

        case 'blockchains':
          if (selectedEndpoint.method === 'list') {
            requestParams = {}
          }
          break

        case 'payouts':
          if (selectedEndpoint.method === 'create') {
            if (!params.amount || !params.currency || !params.destinationType || !params.destination) {
              throw new Error('Amount, currency, destination type, and destination are required')
            }
            let destination: unknown
            try {
              destination = JSON.parse(params.destination)
            } catch {
              throw new Error('Destination must be valid JSON')
            }
            requestParams = {
              amount: params.amount,
              currency: params.currency,
              destinationType: params.destinationType as 'BANK' | 'CRYPTO',
              destination: destination as
                | { address: string; blockchain: string }
                | { accountNumber: string; accountHolderName: string },
              reference: params.reference || undefined
            }
          } else if (selectedEndpoint.method === 'list') {
            requestParams = {}
          } else if (selectedEndpoint.method === 'get') {
            if (!params.payoutId) throw new Error('Payout ID is required')
            requestParams = { payoutId: params.payoutId }
          }
          break

        case 'kyc':
          if (selectedEndpoint.method === 'getStatus') {
            if (!params.customerId) throw new Error('Customer ID is required')
            requestParams = { customerId: params.customerId }
          } else if (selectedEndpoint.method === 'submit') {
            if (!params.customerId || !params.kycData) {
              throw new Error('Customer ID and KYC data are required')
            }
            let kycData: unknown
            try {
              kycData = JSON.parse(params.kycData)
            } catch {
              throw new Error('KYC data must be valid JSON')
            }
            requestParams = kycData as Record<string, unknown>
          }
          break
      }

      // Call the API route instead of SDK directly (avoids CORS)
      const response = await fetch('/api/swapped', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: selectedEndpoint.category,
          method: selectedEndpoint.method,
          params: requestParams
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      // Check if result has success field and handle accordingly
      if (result && typeof result === 'object' && 'success' in result) {
        if (result.success) {
          setResponse(result)

          // If we created a payment link, automatically fetch order details to show supported currencies
          if (
            selectedEndpoint.category === 'paymentLinks' &&
            selectedEndpoint.method === 'create' &&
            'data' in result &&
            result.data &&
            typeof result.data === 'object' &&
            'orderId' in result.data
          ) {
            // Fetch order details to show supported currencies
            try {
              const orderResponse = await fetch('/api/swapped', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  category: 'orders',
                  method: 'get',
                  params: { orderId: result.data.orderId as string }
                })
              })
              if (orderResponse.ok) {
                const orderResult = await orderResponse.json()
                if (orderResult.success && orderResult.data) {
                  // Merge order details into response
                  setResponse({
                    ...result,
                    orderDetails: orderResult.data
                  })
                }
              }
            } catch {
              // Ignore errors when fetching order details
            }
          }
        } else {
          // API returned an error response
          const errorMsg = 'message' in result && typeof result.message === 'string' ? result.message : 'Request failed'
          setError(new Error(errorMsg))
          setResponse(result) // Still show the response for debugging
        }
      } else {
        setResponse(result)
      }
    } catch (err) {
      // Handle thrown errors (network, validation, etc.)
      let errorMessage = 'Unknown error occurred'
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = String(err.message)
      }
      setError(new Error(errorMessage))

      // Also try to extract error details if available
      if (err && typeof err === 'object' && 'response' in err) {
        setResponse(err)
      }
    } finally {
      setLoading(false)
    }
  }, [selectedEndpoint, params])

  const fetchOrderDetails = useCallback(async (orderId: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/swapped', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: 'orders',
          method: 'get',
          params: { orderId }
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch order' }))
        throw new Error(errorData.message || 'Failed to fetch order')
      }

      const result = await response.json()
      if (result.success) {
        setResponse(result.data)
      } else {
        setError(new Error(result.message || 'Failed to fetch order'))
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(new Error(errorMessage))
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    selectedEndpoint,
    params,
    loading,
    loadingIds,
    response,
    error,
    availableIds,
    availableCurrencies,
    handleEndpointSelect,
    handleParamChange,
    executeEndpoint,
    fetchAvailableIds,
    fetchAvailableCurrencies,
    fetchOrderDetails,
    setResponse,
    setError
  }
}
