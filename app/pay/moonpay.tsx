'use client'

import { Navbar } from '@/components/ui/navbar'
import { useConverterParams } from '@/ctx/converter-params'
import { Icon } from '@/lib/icons'
import { HelioCheckout, HelioEmbedConfig } from '@heliofi/checkout-react'
import { useMemo } from 'react'

export const MoonpayCheckout = () => {
  const { amount, toAmountUsdc, fromCurrency } = useConverterParams().params

  const config = useMemo(
    () =>
      ({
        amount: toAmountUsdc,
        paylinkId: '69564a2cee6bb7cd1f2840c1',
        theme: { themeMode: 'light' },
        primaryColor: '#4f39f6',
        neutralColor: '#19241c',
        stretchFullWidth: true
      }) as HelioEmbedConfig,
    [toAmountUsdc]
  )

  return (
    <main className='min-h-screen'>
      <div className='max-w-xl mx-auto'>
        <Navbar>
          <div className='mr-6'>
            {!amount ? (
              <Icon name='spinner-dots' className='size-8 text-indigo-500 mr-8' />
            ) : (
              <span className='font-brk'>{`${fromCurrency} ${Number(amount).toFixed(2)}`}</span>
            )}
          </div>
        </Navbar>
      </div>
      <div className='px-4'>
        <div className='max-w-xl mx-auto md:py-12 flex items-center justify-center border border-[#4f39f6] py-0 rounded-3xl'>
          <HelioCheckout config={config} />
        </div>
      </div>
    </main>
  )
}
