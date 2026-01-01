'use client'

import { useCallback, useRef, useState } from 'react'

// Flag mapping for fiat currencies
const FIAT_FLAGS: Record<string, string> = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  PHP: '🇵🇭',
  JPY: '🇯🇵',
  AUD: '🇦🇺',
  CAD: '🇨🇦',
  SGD: '🇸🇬',
  CHF: '🇨🇭',
  CNY: '🇨🇳',
  HKD: '🇭🇰',
  KRW: '🇰🇷',
  INR: '🇮🇳',
  MXN: '🇲🇽',
  BRL: '🇧🇷'
}

// Color mapping for crypto currencies
const CRYPTO_COLORS: Record<string, string> = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  SOL: '#00FFA3',
  USDC: '#2775CA',
  USDT: '#26A17B',
  BNB: '#F3BA2F',
  ADA: '#0033AD',
  DOT: '#E6007A',
  AVAX: '#E84142',
  MATIC: '#8247E5',
  LINK: '#2A5ADA',
  UNI: '#FF007A',
  XRP: '#7919ff',
  LTC: '#89CAF5',
  DOGE: '#C2A633',
  TRX: '#FF0605',
  ATOM: '#2F3148',
  ARB: '#28A0F0',
  TON: '#0098EB',
  BCH: '#0CC18F',
  DAI: '#22AF9F',
  OSMO: '#462ADF',
  SHIB: '#F18F3C',
  SAND: '#0084FF',
  APE: '#1057C1'
}

// Color mapping for blockchains
const BLOCKCHAIN_COLORS: Record<string, string> = {
  ethereum: '#627EEA',
  bitcoin: '#F7931A',
  litecoin: '#89CAF5',
  solana: '#00FFA3',
  polygon: '#8247E5',
  avalanche: '#E84142',
  binance: '#F3BA2F',
  arbitrum: '#28A0F0',
  optimism: '#FF0420',
  base: '#0052FF',
  tron: '#FF0605',
  xrp: '#23292F',
  ton: '#0098eb',
  osmosis: '#201b43',

  'bitcoin-cash': '#0CC18F'
}

export interface Currency {
  id: string
  symbol: string
  name: string
  type: 'FIAT' | 'CRYPTO'
  flag?: string
  color?: string
  blockchain?: string
}

export interface BlockchainCurrency {
  id?: string
  symbol: string
  name?: string
}

export interface Blockchain {
  id: string
  name: string
  symbol?: string
  color?: string
  currencies?: Array<BlockchainCurrency | string>
}

export interface Quote {
  fromAmount: string
  fromCurrency: string
  toAmount: string
  toCurrency: string
  toBlockchain: string
  rate: string
  toAmountUsdc?: string
  rateUsdc?: string
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

export const useConverter = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [blockchains, setBlockchains] = useState<Blockchain[]>([])
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchCurrencies = useCallback(async () => {
    try {
      const response = await fetch('/api/swapped', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'currencies',
          method: 'list',
          params: {}
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch currencies')
      }

      const result: ApiResponse<{ currencies: Currency[] }> = await response.json()

      if (result.success && result.data?.currencies) {
        // Enrich currencies with flags/colors
        const enriched = result.data.currencies.map((c) => ({
          ...c,
          flag: c.type === 'FIAT' ? (FIAT_FLAGS[c.symbol] ?? '🏳️') : undefined,
          color: c.type === 'CRYPTO' ? (CRYPTO_COLORS[c.symbol] ?? '#888888') : undefined
        }))
        setCurrencies(enriched)
        return enriched
      }

      throw new Error(result.message ?? 'Failed to fetch currencies')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch currencies'
      setError(message)
      return []
    }
  }, [])

  const fetchBlockchains = useCallback(async () => {
    try {
      const response = await fetch('/api/swapped', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'blockchains',
          method: 'list',
          params: {}
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch blockchains')
      }

      const result: ApiResponse<{ blockchains: Blockchain[] }> = await response.json()

      if (result.success && result.data?.blockchains) {
        // Enrich blockchains with colors
        const enriched = result.data.blockchains.map((b) => ({
          ...b,
          color: BLOCKCHAIN_COLORS[b.name.toLowerCase()] ?? '#888888'
        }))
        setBlockchains(enriched)
        return enriched
      }

      throw new Error(result.message ?? 'Failed to fetch blockchains')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch blockchains'
      setError(message)
      return []
    }
  }, [])

  const initialize = useCallback(async () => {
    if (initialized) return { currencies: [], blockchains: [] }

    setLoading(true)
    setError(null)

    try {
      const [fetchedCurrencies, fetchedBlockchains] = await Promise.all([fetchCurrencies(), fetchBlockchains()])
      setInitialized(true)
      return { currencies: fetchedCurrencies, blockchains: fetchedBlockchains }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to initialize'
      setError(message)
      return { currencies: [], blockchains: [] }
    } finally {
      setLoading(false)
    }
  }, [initialized, fetchCurrencies, fetchBlockchains])

  const getQuote = useCallback(
    async (params: { fromAmount: string; fromFiatCurrency: string; toCurrency: string; toBlockchain: string }) => {
      // Clear previous debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      // Validate inputs
      const amount = parseFloat(params.fromAmount)
      if (isNaN(amount) || amount <= 0) {
        setQuote(null)
        return
      }

      if (!params.fromFiatCurrency || !params.toCurrency || !params.toBlockchain) {
        return
      }

      // Debounce the API call
      debounceRef.current = setTimeout(async () => {
        setLoadingQuote(true)
        setError(null)

        try {
          // Fetch main quote and USDC quote in parallel
          const [mainResponse, usdcResponse] = await Promise.all([
            fetch('/api/swapped', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                category: 'quotes',
                method: 'get',
                params
              })
            }),
            // Fetch USDC quote (skip if already USDC)
            params.toCurrency.toUpperCase() !== 'USDC'
              ? (() => {
                  // Try to find a blockchain that supports USDC, default to Ethereum
                  const usdcBlockchain =
                    blockchains.find((b) =>
                      b.currencies?.some(
                        (c) =>
                          (typeof c === 'string' && c.toUpperCase() === 'USDC') ||
                          (typeof c === 'object' && c.symbol?.toUpperCase() === 'USDC')
                      )
                    )?.name || 'Ethereum'

                  return fetch('/api/swapped', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      category: 'quotes',
                      method: 'get',
                      params: {
                        ...params,
                        toCurrency: 'USDC',
                        toBlockchain: usdcBlockchain
                      }
                    })
                  })
                })()
              : Promise.resolve(null)
          ])

          const mainResult = await mainResponse.json()

          if (!mainResponse.ok) {
            throw new Error(mainResult.message ?? 'Failed to get quote')
          }

          if (mainResult.success && mainResult.data) {
            const data = mainResult.data as {
              fromAmount?: { amount?: string }
              toAmount?: { afterFees?: string; beforeFees?: string }
            }

            // Extract nested amounts
            const fromAmt = parseFloat(data.fromAmount?.amount ?? params.fromAmount)
            const toAmt = parseFloat(data.toAmount?.afterFees ?? data.toAmount?.beforeFees ?? '0')

            // Calculate rate (how much crypto per 1 fiat)
            const rate = fromAmt > 0 ? toAmt / fromAmt : 0

            // Process USDC quote if available
            let toAmountUsdc: string | undefined
            let rateUsdc: string | undefined

            if (usdcResponse) {
              try {
                const usdcResult = await usdcResponse.json()
                if (usdcResult.success && usdcResult.data) {
                  const usdcData = usdcResult.data as {
                    fromAmount?: { amount?: string }
                    toAmount?: { afterFees?: string; beforeFees?: string }
                  }
                  const usdcFromAmt = parseFloat(usdcData.fromAmount?.amount ?? params.fromAmount)
                  const usdcToAmt = parseFloat(usdcData.toAmount?.afterFees ?? usdcData.toAmount?.beforeFees ?? '0')
                  const usdcRate = usdcFromAmt > 0 ? usdcToAmt / usdcFromAmt : 0
                  toAmountUsdc = usdcToAmt.toString()
                  rateUsdc = usdcRate.toString()
                }
              } catch (usdcErr) {
                // Silently fail USDC quote - it's optional
                console.warn('Failed to fetch USDC quote:', usdcErr)
              }
            } else if (params.toCurrency.toUpperCase() === 'USDC') {
              // If already USDC, use the same values
              toAmountUsdc = toAmt.toString()
              rateUsdc = rate.toString()
            }

            setQuote({
              fromAmount: params.fromAmount,
              fromCurrency: params.fromFiatCurrency,
              toAmount: toAmt.toString(),
              toCurrency: params.toCurrency,
              toBlockchain: params.toBlockchain,
              rate: rate.toString(),
              toAmountUsdc,
              rateUsdc
            })
          } else {
            throw new Error(mainResult.message ?? 'Failed to get quote')
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to get quote'
          setError(message)
          setQuote(null)
        } finally {
          setLoadingQuote(false)
        }
      }, 300)
    },
    [blockchains]
  )

  const clearQuote = useCallback(() => {
    setQuote(null)
    setError(null)
  }, [])

  // Get fiat and crypto currencies separately
  const fiatCurrencies = currencies.filter((c) => c.type === 'FIAT')
  const cryptoCurrencies = currencies.filter((c) => c.type === 'CRYPTO')

  return {
    currencies,
    fiatCurrencies,
    cryptoCurrencies,
    blockchains,
    quote,
    loading,
    loadingQuote,
    error,
    initialized,
    initialize,
    getQuote,
    clearQuote
  }
}
