'use client'

import { useConverterParams } from '@/ctx/converter-params'
import { useConverter } from '@/hooks/use-converter'
import { Icon } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import { startTransition, useCallback, useEffect, useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

interface ConverterProps {
  className?: string
}

export const Converter = ({ className }: ConverterProps) => {
  const {
    fiatCurrencies,
    cryptoCurrencies,
    blockchains,
    quote,
    loadingQuote,
    error,
    initialized,
    initialize,
    getQuote,
    clearQuote
  } = useConverter()

  // Form state synced to URL params via context
  const { params, setAmount, setFromCurrency, setToCurrency, setToBlockchain, setParams } = useConverterParams()
  const { amount, fromCurrency, toCurrency, toBlockchain } = params

  // Fallback mapping for cryptos that have their own dedicated blockchain
  const NATIVE_BLOCKCHAIN_MAP: Record<string, string> = useMemo(
    () => ({
      BTC: 'Bitcoin',
      ETH: 'Ethereum',
      SOL: 'Solana',
      ADA: 'Cardano',
      AVAX: 'Avalanche',
      ATOM: 'Cosmos',
      DOGE: 'Dogecoin',
      LTC: 'Litecoin',
      TRX: 'Tron',
      TON: 'TON',
      XRP: 'XRP',
      BCH: 'Bitcoin-Cash',
      MATIC: 'Polygon',
      OP: 'Optimism',
      ARB: 'Arbitrum',
      OSMO: 'Osmosis',
      UNI: 'Ethereum'
    }),
    []
  )

  // Initialize on mount
  useEffect(() => {
    initialize()
  }, [initialize])

  // Build a map of crypto symbol to supported blockchain IDs
  const cryptoBlockchainMap = useMemo(() => {
    const map = new Map<string, Set<string>>()
    for (const c of cryptoCurrencies) {
      if (c.blockchain && typeof c.blockchain === 'string') {
        if (!map.has(c.symbol)) {
          map.set(c.symbol, new Set())
        }
        map.get(c.symbol)!.add(c.blockchain)
      }
    }
    return map
  }, [cryptoCurrencies])

  // Helper to check if a blockchain explicitly supports a currency
  const supportsCurrencyOnChain = useCallback((chain: (typeof blockchains)[number], currencySymbol: string) => {
    if (!currencySymbol) return false
    if (!chain.currencies || chain.currencies.length === 0) return false

    const target = currencySymbol.toUpperCase()
    return chain.currencies.some((entry) => {
      if (typeof entry === 'string') {
        return entry.toUpperCase() === target
      }
      return typeof entry?.symbol === 'string' && entry.symbol.toUpperCase() === target
    })
  }, [])

  // Only expose blockchains that explicitly support the selected currency
  const supportedBlockchains = useMemo(() => {
    if (!toCurrency) return blockchains
    return blockchains.filter((b) => supportsCurrencyOnChain(b, toCurrency))
  }, [blockchains, supportsCurrencyOnChain, toCurrency])

  const getPreferredBlockchainForCurrency = useCallback(
    (currencySymbol: string): string => {
      if (!currencySymbol) return ''

      const eligibleBlockchains = blockchains.filter((b) => supportsCurrencyOnChain(b, currencySymbol))
      if (eligibleBlockchains.length === 0) return ''

      const nativeBlockchainName = NATIVE_BLOCKCHAIN_MAP[currencySymbol]
      if (nativeBlockchainName) {
        const native = eligibleBlockchains.find((b) => b.name.toLowerCase() === nativeBlockchainName.toLowerCase())
        if (native) return native.name
      }

      const supportedIds = cryptoBlockchainMap.get(currencySymbol)
      if (supportedIds && supportedIds.size > 0) {
        const matchedBlockchain = eligibleBlockchains.find((b) => {
          const bIdLower = b.id.toLowerCase()
          const bNameLower = b.name.toLowerCase()

          for (const id of supportedIds) {
            const idLower = id.toLowerCase()
            if (idLower === bIdLower || idLower === bNameLower) return true
            if (idLower.includes(bNameLower) || bNameLower.includes(idLower)) return true
            if (idLower.startsWith(bNameLower) || bNameLower.startsWith(idLower)) return true
          }

          return false
        })

        if (matchedBlockchain) {
          return matchedBlockchain.name
        }
      }

      return eligibleBlockchains[0]?.name ?? ''
    },
    [blockchains, cryptoBlockchainMap, supportsCurrencyOnChain, NATIVE_BLOCKCHAIN_MAP]
  )

  // Get available blockchains for selected crypto with robust matching, limited to explicit currency support
  const availableBlockchains = useMemo(() => {
    const baseList = toCurrency ? supportedBlockchains : blockchains
    if (!toCurrency || baseList.length === 0) return baseList

    // Check if this crypto has a native/dedicated blockchain
    const nativeBlockchainName = NATIVE_BLOCKCHAIN_MAP[toCurrency]
    if (nativeBlockchainName) {
      const native = baseList.filter((b) => b.name.toLowerCase() === nativeBlockchainName.toLowerCase())
      if (native.length > 0) return native
    }

    // Otherwise, try to match from the API data
    const supportedIds = cryptoBlockchainMap.get(toCurrency)
    if (!supportedIds || supportedIds.size === 0) return baseList

    const filtered = baseList.filter((b) => {
      for (const id of supportedIds) {
        const idLower = id.toLowerCase()
        const bIdLower = b.id.toLowerCase()
        const bNameLower = b.name.toLowerCase()

        if (idLower === bIdLower || idLower === bNameLower) return true
        if (idLower.includes(bNameLower) || bNameLower.includes(idLower)) return true
        if (idLower.startsWith(bNameLower) || bNameLower.startsWith(idLower)) return true
      }
      return false
    })

    return filtered.length > 0 ? filtered : baseList
  }, [blockchains, cryptoBlockchainMap, supportedBlockchains, toCurrency, NATIVE_BLOCKCHAIN_MAP])

  // Set default values when data is loaded or when supported networks change
  useEffect(() => {
    if (!initialized) return

    const nextFromCurrency =
      fromCurrency ||
      (fiatCurrencies.length > 0
        ? (fiatCurrencies.find((c) => c.symbol === 'USD')?.symbol ?? fiatCurrencies[0].symbol)
        : '')

    const nextToCurrency =
      toCurrency ||
      (cryptoCurrencies.length > 0
        ? (cryptoCurrencies.find((c) => c.symbol === 'ETH')?.symbol ?? cryptoCurrencies[0].symbol)
        : '')

    const hasSupportedSelection =
      !!toBlockchain && (nextToCurrency ? supportedBlockchains.some((b) => b.name === toBlockchain) : false)

    const nextBlockchain =
      hasSupportedSelection || !nextToCurrency ? toBlockchain : getPreferredBlockchainForCurrency(nextToCurrency)

    if (nextFromCurrency !== fromCurrency || nextToCurrency !== toCurrency || nextBlockchain !== toBlockchain) {
      startTransition(() => {
        const updates: Partial<typeof params> = {}
        if (nextFromCurrency && nextFromCurrency !== fromCurrency) {
          updates.fromCurrency = nextFromCurrency
        }
        if (nextToCurrency && nextToCurrency !== toCurrency) {
          updates.toCurrency = nextToCurrency
        }
        if (nextBlockchain !== undefined && nextBlockchain !== toBlockchain) {
          updates.toBlockchain = nextBlockchain
        }
        if (Object.keys(updates).length > 0) {
          setParams(updates)
        }
      })
    }
  }, [
    blockchains,
    cryptoCurrencies,
    fiatCurrencies,
    fromCurrency,
    getPreferredBlockchainForCurrency,
    initialized,
    supportedBlockchains,
    toBlockchain,
    toCurrency,
    setParams,
    params
  ])

  // Fetch quote when inputs change - use blockchain NAME, not id
  useEffect(() => {
    if (!amount || !fromCurrency || !toCurrency || !toBlockchain) return

    getQuote({
      fromAmount: amount,
      fromFiatCurrency: fromCurrency,
      toCurrency: toCurrency,
      toBlockchain: toBlockchain // This is already the blockchain name
    })
  }, [amount, fromCurrency, toCurrency, toBlockchain, getQuote])

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (/^\d*\.?\d*$/.test(value)) {
        setAmount(value)
      }
    },
    [setAmount]
  )

  const handleFromCurrencyChange = useCallback(
    (value: string) => {
      setFromCurrency(value)
      clearQuote()
    },
    [setFromCurrency, clearQuote]
  )

  const handleToCurrencyChange = useCallback(
    (value: string) => {
      startTransition(() => {
        setToCurrency(value)
        clearQuote()
        setToBlockchain(getPreferredBlockchainForCurrency(value))
      })
    },
    [setToCurrency, setToBlockchain, clearQuote, getPreferredBlockchainForCurrency]
  )

  const handleBlockchainChange = useCallback(
    (value: string) => {
      startTransition(() => {
        setToBlockchain(value)
        clearQuote()
      })
    },
    [setToBlockchain, clearQuote]
  )

  const formatCryptoAmount = (amt: string) => {
    const num = parseFloat(amt)
    if (isNaN(num)) return '0'
    if (num < 0.000001) return num.toExponential(4)
    if (num < 1) return num.toFixed(8)
    if (num < 100) return num.toFixed(6)
    return num.toFixed(4)
  }

  const selectedCrypto = cryptoCurrencies.find((c) => c.symbol === toCurrency)
  // const selectedFiat = fiatCurrencies.find((c) => c.symbol === fromCurrency)
  const selectedBlockchain = blockchains.find((b) => b.name === toBlockchain)

  // Sort fiat currencies with priority ones first
  const sortedFiatCurrencies = useMemo(() => {
    const PRIORITY_FIAT = ['USD', 'EUR', 'GBP', 'PHP', 'JPY']
    const priority = fiatCurrencies.filter((c) => PRIORITY_FIAT.includes(c.symbol))
    const rest = fiatCurrencies.filter((c) => !PRIORITY_FIAT.includes(c.symbol))
    // Sort priority by their order in PRIORITY_FIAT
    priority.sort((a, b) => PRIORITY_FIAT.indexOf(a.symbol) - PRIORITY_FIAT.indexOf(b.symbol))
    return [...priority, ...rest]
  }, [fiatCurrencies])

  // Sort crypto currencies with priority ones first and deduplicate by symbol
  const sortedCryptoCurrencies = useMemo(() => {
    // Deduplicate by symbol (keep first occurrence)
    const seen = new Set<string>()
    const unique = cryptoCurrencies.filter((c) => {
      if (seen.has(c.symbol)) return false
      seen.add(c.symbol)
      return true
    })

    const PRIORITY_CRYPTO = ['BTC', 'ETH', 'SOL', 'USDC', 'USDT']
    const priority = unique.filter((c) => PRIORITY_CRYPTO.includes(c.symbol))
    const rest = unique.filter((c) => !PRIORITY_CRYPTO.includes(c.symbol))
    // Sort priority by their order in PRIORITY_CRYPTO
    priority.sort((a, b) => PRIORITY_CRYPTO.indexOf(a.symbol) - PRIORITY_CRYPTO.indexOf(b.symbol))
    return [...priority, ...rest]
  }, [cryptoCurrencies])

  // Loading state
  // if (loading) {
  //   return (
  //     <div className={cn('w-full max-w-lg relative', 'font-sans', className)}>
  //       <div className='absolute -inset-1 bg-linear-to-r from-cyan-500 via-violet-500 to-fuchsia-500 rounded-[28px] blur-xl opacity-30 animate-pulse' />
  //       <div className='font-brk relative bg-zinc-950 rounded-4xl border border-zinc-800/50 overflow-hidden shadow-2xl p-8'>
  //         <div className='flex flex-col items-center gap-4'>
  //           <div className='w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin' />
  //           <span className='text-sm text-zinc-500'>Loading currencies...</span>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className={cn('w-full max-w-lg relative', 'font-sans', className)}>
      {/* Glow effect */}
      <div className='absolute -inset-1 bg-linear-to-r from-cyan-500 via-violet-400 to-fuchsia-300 rounded-[28px] blur-xl opacity-30 animate-pulse' />

      {/* Main container */}
      <div className='font-brk relative bg-zinc-950 rounded-4xl border border-zinc-800/50 overflow-hidden shadow-2xl'>
        {/* Noise texture overlay */}

        <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
        {/*<div className='absolute inset-0 opacity-[0.015] pointer-events-none bg-[url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E")]' />*/}

        {/* Header */}
        <div className='relative px-6 pt-5 pb-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-base font-medium text-white tracking-tight'>convert</h2>
            <div className='flex items-center gap-1.5'>
              <div className='w-2 h-2 rounded-full bg-emerald-400 animate-caret-blink' />
              <span className='text-xs text-zinc-500'>Live rates</span>
            </div>
          </div>
        </div>

        {/* From Section */}
        <div className='px-4 pb-0'>
          <div className='relative bg-zinc-900/80 rounded-2xl p-4 border border-zinc-800/50'>
            <div className="absolute inset-0 opacity-[0.050] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
            <div className='flex items-center justify-between mb-2'>
              <span className='text-xs font-medium text-zinc-500 uppercase tracking-widest'>You send</span>
            </div>
            <div className='flex items-center gap-3'>
              <input
                type='text'
                value={amount}
                onChange={handleAmountChange}
                placeholder='0'
                className='flex-1 bg-transparent text-3xl font-brk font-light text-white placeholder:text-zinc-700 outline-none min-w-0 tracking-tight'
              />
              <Select value={fromCurrency} onValueChange={handleFromCurrencyChange}>
                <SelectTrigger className='w-auto gap-2 border-0 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl px-3 h-11 transition-colors'>
                  <SelectValue placeholder='Select' />
                </SelectTrigger>
                <SelectContent className='bg-zinc-900 border-zinc-800 max-h-40 overflow-y-auto'>
                  {sortedFiatCurrencies.map((c) => (
                    <SelectItem
                      key={c.id}
                      value={c.symbol}
                      className='text-white hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer'>
                      <div className='flex items-center gap-2'>
                        <span className='text-lg'>{c.flag ?? '🏳️'}</span>
                        <span className='font-medium text-white'>{c.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Swap Indicator */}
        <div className='hidden relative _flex justify-center -my-2 z-10'>
          <div className='w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-lg'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-zinc-400'>
              <path d='M12 5v14' />
              <path d='m19 12-7 7-7-7' />
            </svg>
          </div>
        </div>

        {/* To Section */}
        <div className='px-4 pt-4 pb-4 h-51.5'>
          <div
            className='relative rounded-2xl p-4 border border-zinc-700 overflow-hidden'
            style={{
              backgroundColor: `${selectedCrypto?.color ?? '#888'}10`,
              borderColor: `${selectedCrypto?.color ?? '#888'}30`
            }}>
            {/* Crypto gradient accent */}
            <div
              className='absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20'
              style={{ backgroundColor: selectedCrypto?.color ?? '#888' }}
            />

            <div className='relative'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-xs font-medium text-zinc-500 uppercase tracking-widest'>You receive</span>
                {loadingQuote && (
                  <motion.div
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: 1, x: -8 }}
                    exit={{ opacity: 0, x: 15 }}
                    className='flex items-center gap-1.5'>
                    <div className='w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce' />
                    <span className='text-xs text-zinc-500'>
                      Fetching<span className='opacity-50'>...</span>
                    </span>
                  </motion.div>
                )}
              </div>

              <div className='flex items-center gap-3'>
                <div className='flex-1 min-w-0'>
                  <AnimatePresence mode='wait'>
                    <motion.span
                      key={quote?.toAmount ?? 'empty'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        'text-2xl font-brk font-light block truncate',
                        quote ? 'text-white' : 'text-zinc-600'
                      )}>
                      {quote ? formatCryptoAmount(quote.toAmount) : '0'}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <Select value={toCurrency} onValueChange={handleToCurrencyChange}>
                  <SelectTrigger
                    className='w-auto gap-2 border-0 text-white rounded-xl px-3 h-11 transition-colors'
                    style={{
                      backgroundColor: `${selectedCrypto?.color ?? '#888'}30`,
                      color: 'white'
                    }}>
                    <SelectValue placeholder='Select' />
                  </SelectTrigger>
                  <SelectContent className='bg-zinc-900 border-zinc-800 max-h-40 overflow-y-auto'>
                    {sortedCryptoCurrencies.map((c) => (
                      <SelectItem
                        key={c.id}
                        value={c.symbol}
                        className='hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer'>
                        <div className='flex items-center gap-2'>
                          <div className='w-5 h-5 rounded-full' style={{ backgroundColor: c.color ?? '#888' }} />
                          <span className='font-medium text-white'>{c.symbol}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Network selector */}
              {availableBlockchains.length > 0 && (
                <div className='flex items-center justify-between mt-4 pt-3 border-t border-zinc-700/30'>
                  <span className='text-xs text-zinc-500'>Network</span>
                  <Select value={toBlockchain} onValueChange={handleBlockchainChange}>
                    <SelectTrigger className='w-auto gap-1.5 border-0 bg-transparent hover:bg-zinc-800/50 text-zinc-300 rounded-lg px-2 h-7 text-xs transition-colors'>
                      <div className='flex items-center gap-1.5'>
                        <div
                          className='w-2.5 h-2.5 rounded-full'
                          style={{ backgroundColor: selectedBlockchain?.color ?? '#888' }}
                        />
                        <SelectValue placeholder='Select' />
                      </div>
                    </SelectTrigger>
                    <SelectContent className='bg-zinc-900 border-zinc-800 max-h-40 overflow-y-auto'>
                      {availableBlockchains.map((b) => (
                        <SelectItem
                          key={b.id}
                          value={b.name}
                          className='hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer text-sm'>
                          <div className='flex items-center gap-2'>
                            <div className='w-3 h-3 rounded-full' style={{ backgroundColor: b.color ?? '#888' }} />
                            <span className='text-white'>{b.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rate display */}
        <div className='px-4 pb-2'>
          <div className='flex items-center justify-between py-3 px-4 bg-linear-to-b from-zinc-900/50 via-zinc-900/10 to-transparent rounded-xl'>
            <span className='text-sm text-zinc-500'>Rate</span>
            <AnimatePresence mode='wait'>
              <motion.span
                key={quote?.rate ?? 'empty'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className={cn('text-sm font-medium', quote && !error ? 'text-white' : 'text-zinc-600')}>
                {quote && !error ? (
                  `1 ${fromCurrency} = ${formatCryptoAmount(quote.rate)} ${toCurrency}`
                ) : (
                  <Icon name='spinner-dots' className='size-4' />
                )}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Error display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='px-4 pb-5'>
              <div className='flex items-center gap-2 py-3 px-4 bg-red-950/30 border border-red-900/50 rounded-xl'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='text-red-400 shrink-0'>
                  <circle cx='12' cy='12' r='10' />
                  <line x1='12' x2='12' y1='8' y2='12' />
                  <line x1='12' x2='12.01' y1='16' y2='16' />
                </svg>
                <span className='text-sm text-red-300'>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className='px-6 py-3 border-t border-zinc-800/50 bg-zinc-900/30'>
          <p className='text-xs text-zinc-600 text-center'>
            Powered by <span className='text-zinc-400'>Swapped Commerce</span>
          </p>
        </div>
      </div>
    </div>
  )
}
