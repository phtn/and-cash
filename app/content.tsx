'use client'

import { BundleCard } from '@/components/ui/bundle-card'
import { Converter } from '@/components/ui/converter'
import { Navbar } from '@/components/ui/navbar'
import { useConverterParams } from '@/ctx/converter-params'
import { useMemo } from 'react'

export const Content = () => {
  const { params } = useConverterParams()

  // Build /pay URL with current query params
  const payUrl = useMemo(() => {
    const searchParams = new URLSearchParams({
      amount: params.amount,
      fromCurrency: params.fromCurrency,
      toCurrency: params.toCurrency,
      toBlockchain: params.toBlockchain,
      toAmount: params.toAmount,
      toAmountUsdc: params.toAmountUsdc
    })
    return `/pay?${searchParams.toString()}`
  }, [params])

  // const buildUrl = useSubdomainUrlBuilder()
  const data = [
    {
      id: '1',
      title: 'Proceed to payment',
      description: 'pay with card or e-wallet',
      actionHref: payUrl
      // actionHref: 'commerce' as SubdomainKey
    }
  ]
  return (
    <main className='min-h-screen md:p-0 max-w-xl mx-auto'>
      <Navbar>
        <div className='inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-depths/40 px-4 h-8 text-xs mr-4'>
          <span className='relative flex h-2 w-2'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-2 w-2 bg-indigo-400'></span>
          </span>
          <div onClick={() => console.log(payUrl)} className='text-foreground/80 font-brk'>
            50+ cryptocurrencies
          </div>
        </div>
      </Navbar>
      <div className='p-4 space-y-10 h-[calc(100lvh-64px)] overflow-visible'>
        <div className='flex flex-col items-center justify-center'>
          <Converter />
        </div>
        <div className='grid grind-cols-1 md:grid-cols-1 gap-4 px-1 md:px-4'>
          {data.map((item) => (
            <BundleCard
              key={item.id}
              title={item.title}
              description={item.description}
              actionHref={item.actionHref}
              className='bg-depths/50'
              footerStyle='bg-linear-to-l text-white from-zinc-950 via-zinc-800 to-zinc-600'
            />
          ))}
        </div>
      </div>
    </main>
  )
}
