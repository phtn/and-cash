'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { swapped } from '@/lib/swapped'
import { Download, Loader2, Play, RefreshCw } from 'lucide-react'
import { useCallback, useState } from 'react'
import { ResponseDisplay } from './response-display'

type EndpointCategory =
  | 'orders'
  | 'paymentLinks'
  | 'paymentRoutes'
  | 'payments'
  | 'balances'
  | 'quotes'
  | 'payouts'
  | 'kyc'

type EndpointAction = {
  category: EndpointCategory
  method: string
  label: string
  description: string
  requiresParams: boolean
  paramsType?:
    | 'orderId'
    | 'paymentId'
    | 'currencyId'
    | 'payoutId'
    | 'customerId'
    | 'createLink'
    | 'createRoute'
    | 'getQuote'
    | 'listOrders'
    | 'refundOrder'
    | 'createPayout'
    | 'listPayouts'
    | 'submitKYC'
    | 'listBalances'
}

const ENDPOINTS: EndpointAction[] = [
  // Orders
  {
    category: 'orders',
    method: 'list',
    label: 'List Orders',
    description: 'Get a list of all orders',
    requiresParams: false,
    paramsType: 'listOrders'
  },
  {
    category: 'orders',
    method: 'get',
    label: 'Get Order',
    description: 'Get order by ID',
    requiresParams: true,
    paramsType: 'orderId'
  },
  {
    category: 'orders',
    method: 'refund',
    label: 'Refund Order',
    description: 'Refund an order',
    requiresParams: true,
    paramsType: 'refundOrder'
  },

  // Payment Links
  {
    category: 'paymentLinks',
    method: 'create',
    label: 'Create Payment Link',
    description: 'Create a new payment link',
    requiresParams: true,
    paramsType: 'createLink'
  },

  // Payment Routes
  {
    category: 'paymentRoutes',
    method: 'create',
    label: 'Create Payment Route',
    description: 'Create a payment route',
    requiresParams: true,
    paramsType: 'createRoute'
  },

  // Payments
  {
    category: 'payments',
    method: 'get',
    label: 'Get Payment',
    description: 'Get payment by ID',
    requiresParams: true,
    paramsType: 'paymentId'
  },

  // Balances
  {
    category: 'balances',
    method: 'list',
    label: 'List Balances',
    description: 'Get all balances',
    requiresParams: false,
    paramsType: 'listBalances'
  },
  {
    category: 'balances',
    method: 'get',
    label: 'Get Balance',
    description: 'Get balance by currency ID',
    requiresParams: true,
    paramsType: 'currencyId'
  },

  // Quotes
  {
    category: 'quotes',
    method: 'get',
    label: 'Get Quote',
    description: 'Get currency conversion quote',
    requiresParams: true,
    paramsType: 'getQuote'
  },

  // Payouts
  {
    category: 'payouts',
    method: 'create',
    label: 'Create Payout',
    description: 'Create a new payout',
    requiresParams: true,
    paramsType: 'createPayout'
  },
  {
    category: 'payouts',
    method: 'list',
    label: 'List Payouts',
    description: 'Get all payouts',
    requiresParams: false,
    paramsType: 'listPayouts'
  },
  {
    category: 'payouts',
    method: 'get',
    label: 'Get Payout',
    description: 'Get payout by ID',
    requiresParams: true,
    paramsType: 'payoutId'
  },

  // KYC
  {
    category: 'kyc',
    method: 'getStatus',
    label: 'Get KYC Status',
    description: 'Get KYC status for customer',
    requiresParams: true,
    paramsType: 'customerId'
  },
  {
    category: 'kyc',
    method: 'submit',
    label: 'Submit KYC',
    description: 'Submit KYC information',
    requiresParams: true,
    paramsType: 'submitKYC'
  }
]

// Default value pools for create methods
const DEFAULT_VALUES = {
  purchaseNames: [
    'Premium Subscription',
    'Digital Product Bundle',
    'Service Package',
    'Course Access',
    'Software License',
    'Consulting Hours',
    'Membership Plan',
    'Event Ticket'
  ],
  prices: ['500', '1000', '1500', '2500', '5000', '7500', '10000', '15000'],
  currencies: ['PHP', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'SGD'],
  customerEmails: [
    'customer1@example.com',
    'customer2@example.com',
    'customer3@example.com',
    'customer4@example.com',
    'customer5@example.com',
    'test@example.com',
    'user@example.com',
    'buyer@example.com'
  ],
  symbols: ['BTC', 'ETH', 'SOL', 'USDC', 'USDT', 'BNB', 'ADA', 'DOT'],
  blockchains: ['bitcoin', 'ethereum', 'solana', 'polygon', 'avalanche', 'binance', 'cardano', 'polkadot'],
  preferredPayCurrencies: ['BTC', 'ETH', 'SOL', 'USDC', 'USDT'],
  externalIds: ['EXT-001', 'EXT-002', 'EXT-003', 'EXT-004', 'EXT-005', 'EXT-006', 'EXT-007', 'EXT-008'],
  customerIds: ['CUST-001', 'CUST-002', 'CUST-003', 'CUST-004', 'CUST-005', 'CUST-006', 'CUST-007', 'CUST-008'],
  fromCurrencies: ['PHP', 'USD', 'EUR', 'GBP', 'JPY'],
  toCurrencies: ['BTC', 'ETH', 'SOL', 'USDC', 'USDT'],
  amounts: ['100', '500', '1000', '2500', '5000', '10000', '25000', '50000'],
  payoutCurrencies: ['BTC', 'ETH', 'USDC', 'USDT', 'SOL'],
  cryptoAddresses: [
    '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    'So11111111111111111111111111111111111111112',
    '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  ],
  cryptoBlockchains: ['ethereum', 'bitcoin', 'solana', 'polygon', 'avalanche'],
  bankAccounts: [
    { accountNumber: '1234567890', accountHolderName: 'John Doe' },
    { accountNumber: '0987654321', accountHolderName: 'Jane Smith' },
    { accountNumber: '1122334455', accountHolderName: 'Bob Johnson' },
    { accountNumber: '5566778899', accountHolderName: 'Alice Williams' },
    { accountNumber: '9988776655', accountHolderName: 'Charlie Brown' }
  ],
  refundReasons: ['Customer request', 'Product defect', 'Service not delivered', 'Duplicate payment', 'Cancelled order']
}

const getRandomValue = <T,>(array: readonly T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

const getDefaultParams = (endpoint: EndpointAction): Record<string, string> => {
  switch (endpoint.paramsType) {
    case 'createLink':
      return {
        name: getRandomValue(DEFAULT_VALUES.purchaseNames),
        price: getRandomValue(DEFAULT_VALUES.prices),
        currency: getRandomValue(DEFAULT_VALUES.currencies),
        customerEmail: getRandomValue(DEFAULT_VALUES.customerEmails),
        symbol: getRandomValue(DEFAULT_VALUES.symbols),
        blockchain: getRandomValue(DEFAULT_VALUES.blockchains),
        testMode: 'true'
      }

    case 'createRoute':
      return {
        purchaseAmount: getRandomValue(DEFAULT_VALUES.prices),
        purchaseCurrency: getRandomValue(DEFAULT_VALUES.currencies),
        preferredPayCurrency: getRandomValue(DEFAULT_VALUES.preferredPayCurrencies),
        externalId: getRandomValue(DEFAULT_VALUES.externalIds),
        customerId: getRandomValue(DEFAULT_VALUES.customerIds)
      }

    case 'getQuote':
      // Set default currency symbols (like payment links use)
      return {
        fromCurrency: getRandomValue(DEFAULT_VALUES.fromCurrencies),
        toCurrency: getRandomValue(DEFAULT_VALUES.toCurrencies),
        amount: getRandomValue(DEFAULT_VALUES.amounts),
        amountType: 'FROM'
      }

    case 'createPayout':
      const isCrypto = Math.random() > 0.5
      return {
        amount: getRandomValue(DEFAULT_VALUES.amounts),
        currency: getRandomValue(DEFAULT_VALUES.payoutCurrencies),
        destinationType: isCrypto ? 'CRYPTO' : 'BANK',
        destination: isCrypto
          ? JSON.stringify({
              address: getRandomValue(DEFAULT_VALUES.cryptoAddresses),
              blockchain: getRandomValue(DEFAULT_VALUES.cryptoBlockchains)
            })
          : JSON.stringify(getRandomValue(DEFAULT_VALUES.bankAccounts)),
        reference: getRandomValue(DEFAULT_VALUES.externalIds)
      }

    case 'submitKYC':
      return {
        customerId: getRandomValue(DEFAULT_VALUES.customerIds),
        kycData: JSON.stringify({
          customerId: getRandomValue(DEFAULT_VALUES.customerIds),
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          nationality: 'US',
          address: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'US'
          },
          documents: [
            {
              type: 'PASSPORT',
              frontImage: 'base64encodedimage...'
            }
          ]
        })
      }

    case 'refundOrder':
      return {
        reason: getRandomValue(DEFAULT_VALUES.refundReasons)
      }

    default:
      return {}
  }
}

export const EndpointTester = () => {
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

  const fetchAvailableIds = useCallback(async (type: 'orderId' | 'paymentId' | 'payoutId' | 'currencyId') => {
    setLoadingIds(true)
    setError(null)

    try {
      let ids: string[] = []

      switch (type) {
        case 'orderId': {
          const result = await swapped.orders.list()
          if (result.success && result.data?.orders) {
            ids = result.data.orders.map((order) => order.id)
          }
          break
        }
        case 'paymentId': {
          // Payments don't have a list endpoint, but we can get them from orders
          const result = await swapped.orders.list()
          if (result.success && result.data?.orders) {
            const paymentIds = result.data.orders.flatMap((order) => order.payments || []).map((payment) => payment.id)
            ids = [...new Set(paymentIds)]
          }
          break
        }
        case 'payoutId': {
          const result = await swapped.payouts.list()
          if (result.success && result.data?.payouts) {
            ids = result.data.payouts.map((payout) => payout.id)
          }
          break
        }
        case 'currencyId': {
          const result = await swapped.balances.list()
          if (result.success && result.data?.balances) {
            ids = result.data.balances.map((balance) => balance.currency.id)
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

  const handleParamChange = useCallback((key: string, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }, [])

  const executeEndpoint = useCallback(async () => {
    if (!selectedEndpoint) return

    // Check if API key is configured
    const apiKey = process.env.NEXT_PUBLIC_SWAPPED_API_PK
    if (!apiKey || apiKey.trim() === '') {
      setError(
        new Error(
          'API key not configured. Please set NEXT_PUBLIC_SWAPPED_API_PK in your .env file or environment variables.'
        )
      )
      return
    }

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      let result: unknown

      switch (selectedEndpoint.category) {
        case 'orders':
          if (selectedEndpoint.method === 'list') {
            result = await swapped.orders.list()
          } else if (selectedEndpoint.method === 'get') {
            if (!params.orderId) throw new Error('Order ID is required')
            result = await swapped.orders.get(params.orderId)
          } else if (selectedEndpoint.method === 'refund') {
            if (!params.orderId) throw new Error('Order ID is required')
            result = await swapped.orders.refund(params.orderId, {
              amount: params.amount || undefined,
              reason: params.reason || undefined
            })
          }
          break

        case 'paymentLinks':
          if (selectedEndpoint.method === 'create') {
            const purchasePrice = params.price || '1000'
            const purchaseCurrency = params.currency || 'PHP'
            result = await swapped.paymentLinks.create({
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
            })
          }
          break

        case 'paymentRoutes':
          if (selectedEndpoint.method === 'create') {
            if (!params.purchaseAmount || !params.purchaseCurrency) {
              throw new Error('Purchase amount and currency are required')
            }
            result = await swapped.paymentRoutes.create({
              purchaseAmount: params.purchaseAmount,
              purchaseCurrency: params.purchaseCurrency,
              preferredPayCurrency: params.preferredPayCurrency || undefined,
              externalId: params.externalId || undefined,
              customerId: params.customerId || undefined,
              metadata: params.metadata ? JSON.parse(params.metadata) : undefined
            })
          }
          break

        case 'payments':
          if (selectedEndpoint.method === 'get') {
            if (!params.paymentId) throw new Error('Payment ID is required')
            result = await swapped.payments.get(params.paymentId)
          }
          break

        case 'balances':
          if (selectedEndpoint.method === 'list') {
            result = await swapped.balances.list()
          } else if (selectedEndpoint.method === 'get') {
            if (!params.currencyId) throw new Error('Currency ID is required')
            result = await swapped.balances.get(params.currencyId)
          }
          break

        case 'quotes':
          if (selectedEndpoint.method === 'get') {
            if (!params.fromCurrency || !params.toCurrency || !params.amount) {
              throw new Error('From currency, to currency, and amount are required.')
            }
            result = await swapped.quotes.get({
              fromCurrency: params.fromCurrency,
              toCurrency: params.toCurrency,
              amount: params.amount,
              amountType: (params.amountType as 'FROM' | 'TO') || 'FROM'
            })
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
            result = await swapped.payouts.create({
              amount: params.amount,
              currency: params.currency,
              destinationType: params.destinationType as 'BANK' | 'CRYPTO',
              destination: destination as
                | { address: string; blockchain: string }
                | { accountNumber: string; accountHolderName: string },
              reference: params.reference || undefined
            })
          } else if (selectedEndpoint.method === 'list') {
            result = await swapped.payouts.list()
          } else if (selectedEndpoint.method === 'get') {
            if (!params.payoutId) throw new Error('Payout ID is required')
            result = await swapped.payouts.get(params.payoutId)
          }
          break

        case 'kyc':
          if (selectedEndpoint.method === 'getStatus') {
            if (!params.customerId) throw new Error('Customer ID is required')
            result = await swapped.kyc.getStatus(params.customerId)
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
            result = await swapped.kyc.submit(
              kycData as {
                customerId: string
                firstName: string
                lastName: string
                dateOfBirth: string
                nationality: string
                address: {
                  street: string
                  city: string
                  state?: string
                  postalCode: string
                  country: string
                }
                documents: Array<{
                  type: 'PASSPORT' | 'DRIVERS_LICENSE' | 'ID_CARD' | 'PROOF_OF_ADDRESS'
                  frontImage: string
                  backImage?: string
                }>
              }
            )
          }
          break
      }

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
              const orderResult = await swapped.orders.get(result.data.orderId as string)
              if (orderResult.success && orderResult.data) {
                // Merge order details into response
                setResponse({
                  ...result,
                  orderDetails: orderResult.data
                })
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
      const result = await swapped.orders.get(orderId)
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

  const fetchAvailableCurrencies = useCallback(async () => {
    setLoadingIds(true)
    setError(null)

    // Check if API key is configured
    const apiKey = process.env.NEXT_PUBLIC_SWAPPED_API_PK
    if (!apiKey || apiKey.trim() === '') {
      setError(
        new Error(
          'API key not configured. Please set NEXT_PUBLIC_SWAPPED_API_PK in your .env file or environment variables.'
        )
      )
      setLoadingIds(false)
      return
    }

    try {
      const result = await swapped.balances.list()
      if (result.success && result.data?.balances) {
        const currencies = result.data.balances.map((balance) => ({
          id: balance.currency.id,
          symbol: balance.currency.symbol,
          name: balance.currency.name
        }))
        setAvailableCurrencies(currencies)

        // Auto-select first currency for fromCurrency if not set
        if (currencies.length > 0 && !params.fromCurrency) {
          setParams((prev) => ({ ...prev, fromCurrency: currencies[0].id }))
        }
      } else {
        const errorMsg = result.message || 'Failed to fetch currencies'
        setError(
          new Error(
            `${errorMsg}. ${result.message?.toLowerCase().includes('auth') ? 'Please check your API key configuration.' : ''}`
          )
        )
      }
    } catch (err) {
      let errorMessage = 'Failed to fetch currencies'
      if (err instanceof Error) {
        errorMessage = err.message
        // Check if it's an authentication error
        if (
          errorMessage.toLowerCase().includes('auth') ||
          errorMessage.toLowerCase().includes('401') ||
          errorMessage.toLowerCase().includes('unauthorized') ||
          errorMessage.toLowerCase().includes('api key')
        ) {
          errorMessage = `Authentication failed: ${errorMessage}. Please verify that NEXT_PUBLIC_SWAPPED_API_PK is set correctly in your environment variables.`
        }
      }
      setError(new Error(errorMessage))
    } finally {
      setLoadingIds(false)
    }
  }, [params.fromCurrency])

  const renderParamsInputs = () => {
    if (!selectedEndpoint?.requiresParams) return null

    switch (selectedEndpoint.paramsType) {
      case 'orderId':
        return (
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='orderId'>Order ID</Label>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => fetchAvailableIds('orderId')}
                disabled={loadingIds}
                className='h-7 text-xs'>
                {loadingIds ? <Loader2 className='h-3 w-3 animate-spin mr-1' /> : <Download className='h-3 w-3 mr-1' />}
                Load IDs
              </Button>
            </div>
            {availableIds.orderId && availableIds.orderId.length > 0 ? (
              <Select value={params.orderId || ''} onValueChange={(value) => handleParamChange('orderId', value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select order ID' />
                </SelectTrigger>
                <SelectContent>
                  {availableIds.orderId.map((id) => (
                    <SelectItem key={id} value={id}>
                      {id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id='orderId'
                value={params.orderId || ''}
                onChange={(e) => handleParamChange('orderId', e.target.value)}
                placeholder='Enter order ID or click Load IDs'
                className='w-full'
              />
            )}
          </div>
        )

      case 'refundOrder':
        return (
          <div className='space-y-4'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='orderId'>Order ID *</Label>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => fetchAvailableIds('orderId')}
                  disabled={loadingIds}
                  className='h-7 text-xs'>
                  {loadingIds ? (
                    <Loader2 className='h-3 w-3 animate-spin mr-1' />
                  ) : (
                    <Download className='h-3 w-3 mr-1' />
                  )}
                  Load IDs
                </Button>
              </div>
              {availableIds.orderId && availableIds.orderId.length > 0 ? (
                <Select value={params.orderId || ''} onValueChange={(value) => handleParamChange('orderId', value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select order ID' />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIds.orderId.map((id) => (
                      <SelectItem key={id} value={id}>
                        {id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id='orderId'
                  value={params.orderId || ''}
                  onChange={(e) => handleParamChange('orderId', e.target.value)}
                  placeholder='Enter order ID or click Load IDs'
                  className='w-full'
                />
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='amount'>Amount (optional)</Label>
              <Input
                id='amount'
                type='number'
                value={params.amount || ''}
                onChange={(e) => handleParamChange('amount', e.target.value)}
                placeholder='Refund amount'
                className='w-full'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='reason'>Reason (optional)</Label>
              <Select value={params.reason || ''} onValueChange={(value) => handleParamChange('reason', value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select reason' />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_VALUES.refundReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'createLink':
        return (
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Purchase Name</Label>
              <Select value={params.name || ''} onValueChange={(value) => handleParamChange('name', value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select purchase name' />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_VALUES.purchaseNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='price'>Price</Label>
                <Select value={params.price || ''} onValueChange={(value) => handleParamChange('price', value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select price' />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_VALUES.prices.map((price) => (
                      <SelectItem key={price} value={price}>
                        {price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='currency'>Currency</Label>
                <Select value={params.currency || ''} onValueChange={(value) => handleParamChange('currency', value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select currency' />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_VALUES.currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='customerEmail'>Customer Email (optional)</Label>
              <Select
                value={params.customerEmail || ''}
                onValueChange={(value) => handleParamChange('customerEmail', value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select email' />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_VALUES.customerEmails.map((email) => (
                    <SelectItem key={email} value={email}>
                      {email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='symbol'>Preferred Symbol (optional)</Label>
                <Select value={params.symbol || ''} onValueChange={(value) => handleParamChange('symbol', value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select symbol' />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_VALUES.symbols.map((symbol) => (
                      <SelectItem key={symbol} value={symbol}>
                        {symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='blockchain'>Blockchain (optional)</Label>
                <Select
                  value={params.blockchain || ''}
                  onValueChange={(value) => handleParamChange('blockchain', value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select blockchain' />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_VALUES.blockchains.map((blockchain) => (
                      <SelectItem key={blockchain} value={blockchain}>
                        {blockchain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='testMode'>Test Mode</Label>
              <Select value={params.testMode || 'true'} onValueChange={(value) => handleParamChange('testMode', value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='true'>True</SelectItem>
                  <SelectItem value='false'>False</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'createRoute':
        return (
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='purchaseAmount'>Purchase Amount *</Label>
                <Select
                  value={params.purchaseAmount || ''}
                  onValueChange={(value) => handleParamChange('purchaseAmount', value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select amount' />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_VALUES.prices.map((price) => (
                      <SelectItem key={price} value={price}>
                        {price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='purchaseCurrency'>Purchase Currency *</Label>
                <Select
                  value={params.purchaseCurrency || ''}
                  onValueChange={(value) => handleParamChange('purchaseCurrency', value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select currency' />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_VALUES.currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='preferredPayCurrency'>Preferred Pay Currency (optional)</Label>
              <Select
                value={params.preferredPayCurrency || ''}
                onValueChange={(value) => handleParamChange('preferredPayCurrency', value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select currency' />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_VALUES.preferredPayCurrencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='externalId'>External ID (optional)</Label>
                <Select
                  value={params.externalId || ''}
                  onValueChange={(value) => handleParamChange('externalId', value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select external ID' />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_VALUES.externalIds.map((id) => (
                      <SelectItem key={id} value={id}>
                        {id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='customerId'>Customer ID (optional)</Label>
                <Select
                  value={params.customerId || ''}
                  onValueChange={(value) => handleParamChange('customerId', value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select customer ID' />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_VALUES.customerIds.map((id) => (
                      <SelectItem key={id} value={id}>
                        {id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='metadata'>Metadata (JSON, optional)</Label>
              <Input
                id='metadata'
                value={params.metadata || ''}
                onChange={(e) => handleParamChange('metadata', e.target.value)}
                placeholder='{"key": "value"}'
                className='w-full'
              />
            </div>
          </div>
        )

      case 'paymentId':
        return (
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='paymentId'>Payment ID</Label>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => fetchAvailableIds('paymentId')}
                disabled={loadingIds}
                className='h-7 text-xs'>
                {loadingIds ? <Loader2 className='h-3 w-3 animate-spin mr-1' /> : <Download className='h-3 w-3 mr-1' />}
                Load IDs
              </Button>
            </div>
            {availableIds.paymentId && availableIds.paymentId.length > 0 ? (
              <Select value={params.paymentId || ''} onValueChange={(value) => handleParamChange('paymentId', value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select payment ID' />
                </SelectTrigger>
                <SelectContent>
                  {availableIds.paymentId.map((id) => (
                    <SelectItem key={id} value={id}>
                      {id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id='paymentId'
                value={params.paymentId || ''}
                onChange={(e) => handleParamChange('paymentId', e.target.value)}
                placeholder='Enter payment ID or click Load IDs'
                className='w-full'
              />
            )}
          </div>
        )

      case 'currencyId':
        return (
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='currencyId'>Currency ID</Label>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => fetchAvailableIds('currencyId')}
                disabled={loadingIds}
                className='h-7 text-xs'>
                {loadingIds ? <Loader2 className='h-3 w-3 animate-spin mr-1' /> : <Download className='h-3 w-3 mr-1' />}
                Load IDs
              </Button>
            </div>
            {availableIds.currencyId && availableIds.currencyId.length > 0 ? (
              <Select value={params.currencyId || ''} onValueChange={(value) => handleParamChange('currencyId', value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select currency ID' />
                </SelectTrigger>
                <SelectContent>
                  {availableIds.currencyId.map((id) => (
                    <SelectItem key={id} value={id}>
                      {id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id='currencyId'
                value={params.currencyId || ''}
                onChange={(e) => handleParamChange('currencyId', e.target.value)}
                placeholder='e.g., BTC, ETH, USDC or click Load IDs'
                className='w-full'
              />
            )}
          </div>
        )

      case 'getQuote':
        return (
          <div className='space-y-4'>
            <div className='flex items-center justify-between mb-2'>
              <Label>Currencies</Label>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={fetchAvailableCurrencies}
                disabled={loadingIds}
                className='h-7 text-xs'>
                {loadingIds ? <Loader2 className='h-3 w-3 animate-spin mr-1' /> : <Download className='h-3 w-3 mr-1' />}
                Load Currencies
              </Button>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='fromCurrency'>From Currency *</Label>
                {availableCurrencies.length > 0 ? (
                  <Select
                    value={params.fromCurrency || ''}
                    onValueChange={(value) => handleParamChange('fromCurrency', value)}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select currency' />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCurrencies.map((currency) => (
                        <SelectItem key={currency.id} value={currency.id}>
                          {currency.symbol} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Select
                    value={params.fromCurrency || ''}
                    onValueChange={(value) => handleParamChange('fromCurrency', value)}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select or type currency' />
                    </SelectTrigger>
                    <SelectContent>
                      {DEFAULT_VALUES.fromCurrencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {availableCurrencies.length === 0 && (
                  <p className='text-xs text-muted-foreground'>
                    Try common symbols like PHP, USD, EUR, or click "Load Currencies" for IDs
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='toCurrency'>To Currency *</Label>
                {availableCurrencies.length > 0 ? (
                  <Select
                    value={params.toCurrency || ''}
                    onValueChange={(value) => handleParamChange('toCurrency', value)}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select currency' />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCurrencies.map((currency) => (
                        <SelectItem key={currency.id} value={currency.id}>
                          {currency.symbol} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Select
                    value={params.toCurrency || ''}
                    onValueChange={(value) => handleParamChange('toCurrency', value)}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select or type currency' />
                    </SelectTrigger>
                    <SelectContent>
                      {DEFAULT_VALUES.toCurrencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {availableCurrencies.length === 0 && (
                  <p className='text-xs text-muted-foreground'>
                    Try common symbols like BTC, ETH, SOL, USDC, or click "Load Currencies" for IDs
                  </p>
                )}
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='amount'>Amount *</Label>
              <Select value={params.amount || ''} onValueChange={(value) => handleParamChange('amount', value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select amount' />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_VALUES.amounts.map((amount) => (
                    <SelectItem key={amount} value={amount}>
                      {amount}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='amountType'>Amount Type</Label>
              <Select
                value={params.amountType || 'FROM'}
                onValueChange={(value) => handleParamChange('amountType', value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='FROM'>FROM</SelectItem>
                  <SelectItem value='TO'>TO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'createPayout':
        return (
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='amount'>Amount *</Label>
                <Select value={params.amount || ''} onValueChange={(value) => handleParamChange('amount', value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select amount' />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_VALUES.amounts.map((amount) => (
                      <SelectItem key={amount} value={amount}>
                        {amount}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='currency'>Currency *</Label>
                <Select value={params.currency || ''} onValueChange={(value) => handleParamChange('currency', value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select currency' />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_VALUES.payoutCurrencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='destinationType'>Destination Type *</Label>
              <Select
                value={params.destinationType || ''}
                onValueChange={(value) => handleParamChange('destinationType', value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='BANK'>BANK</SelectItem>
                  <SelectItem value='CRYPTO'>CRYPTO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='destination'>Destination (JSON) *</Label>
              <Input
                id='destination'
                value={params.destination || ''}
                onChange={(e) => handleParamChange('destination', e.target.value)}
                placeholder='{"address": "...", "blockchain": "..."} or {"accountNumber": "...", "accountHolderName": "..."}'
                className='w-full'
              />
              <p className='text-xs text-muted-foreground'>
                For CRYPTO: {`{"address": "0x...", "blockchain": "ethereum"}`}
                <br />
                For BANK: {`{"accountNumber": "...", "accountHolderName": "..."}`}
              </p>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='reference'>Reference (optional)</Label>
              <Select value={params.reference || ''} onValueChange={(value) => handleParamChange('reference', value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select reference' />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_VALUES.externalIds.map((id) => (
                    <SelectItem key={id} value={id}>
                      {id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'payoutId':
        return (
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='payoutId'>Payout ID</Label>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => fetchAvailableIds('payoutId')}
                disabled={loadingIds}
                className='h-7 text-xs'>
                {loadingIds ? <Loader2 className='h-3 w-3 animate-spin mr-1' /> : <Download className='h-3 w-3 mr-1' />}
                Load IDs
              </Button>
            </div>
            {availableIds.payoutId && availableIds.payoutId.length > 0 ? (
              <Select value={params.payoutId || ''} onValueChange={(value) => handleParamChange('payoutId', value)}>
                <SelectTrigger className='w-full dark:text-white'>
                  <SelectValue placeholder='Select payout ID' />
                </SelectTrigger>
                <SelectContent>
                  {availableIds.payoutId.map((id) => (
                    <SelectItem key={id} value={id}>
                      {id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id='payoutId'
                value={params.payoutId || ''}
                onChange={(e) => handleParamChange('payoutId', e.target.value)}
                placeholder='Enter payout ID or click Load IDs'
                className='w-full'
              />
            )}
          </div>
        )

      case 'customerId':
        return (
          <div className='space-y-2'>
            <Label htmlFor='customerId'>Customer ID</Label>
            <Input
              id='customerId'
              value={params.customerId || ''}
              onChange={(e) => handleParamChange('customerId', e.target.value)}
              placeholder='Enter customer ID'
              className='w-full'
            />
          </div>
        )

      case 'submitKYC':
        return (
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='customerId'>Customer ID *</Label>
              <Input
                id='customerId'
                value={params.customerId || ''}
                onChange={(e) => handleParamChange('customerId', e.target.value)}
                placeholder='Enter customer ID'
                className='w-full'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='kycData'>KYC Data (JSON) *</Label>
              <Input
                id='kycData'
                value={params.kycData || ''}
                onChange={(e) => handleParamChange('kycData', e.target.value)}
                placeholder='{"customerId": "...", "firstName": "...", "lastName": "...", ...}'
                className='w-full'
              />
              <p className='text-xs text-muted-foreground'>
                Required fields: customerId, firstName, lastName, dateOfBirth, nationality, address, documents
              </p>
            </div>
          </div>
        )

      case 'listOrders':
      case 'listPayouts':
      case 'listBalances':
        return null

      default:
        return null
    }
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      {/* Endpoint Selection */}
      <Card className='lg:sticky lg:top-4 lg:h-fit bg-serene text-dark'>
        <CardHeader>
          <CardTitle>Select Endpoint</CardTitle>
          <CardDescription className='font-sans'>Choose an endpoint to test</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Select
            value={selectedEndpoint ? `${selectedEndpoint.category}.${selectedEndpoint.method}` : ''}
            onValueChange={(value) => {
              const endpoint = ENDPOINTS.find((e) => `${e.category}.${e.method}` === value)
              if (endpoint) handleEndpointSelect(endpoint)
            }}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select an endpoint...' />
            </SelectTrigger>
            <SelectContent>
              {ENDPOINTS.map((endpoint) => (
                <SelectItem
                  key={`${endpoint.category}.${endpoint.method}`}
                  value={`${endpoint.category}.${endpoint.method}`}>
                  <div className='flex flex-col'>
                    <span className='font-medium'>{endpoint.label}</span>
                    <span className='text-xs text-muted-foreground'>{endpoint.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedEndpoint && (
            <>
              <div className='pt-4 border-t space-y-4'>
                <div>
                  <h3 className='text-sm font-semibold mb-2'>{selectedEndpoint.label}</h3>
                  <p className='text-sm text-muted-foreground'>{selectedEndpoint.description}</p>
                </div>
                {renderParamsInputs()}
              </div>
              <Button onClick={executeEndpoint} disabled={loading} className='w-full'>
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className='mr-2 h-4 w-4' />
                    Execute
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Response Display */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Response</CardTitle>
              <CardDescription>API response will appear here</CardDescription>
            </div>
            {response !== null && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  setResponse(null)
                  setError(null)
                }}>
                <RefreshCw className='h-4 w-4' />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ResponseDisplay
            response={response}
            error={error}
            loading={loading}
            onFetchOrderDetails={fetchOrderDetails}
          />
        </CardContent>
      </Card>
    </div>
  )
}
