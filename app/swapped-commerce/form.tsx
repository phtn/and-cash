'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSwapped } from '@/hooks/use-swapped'
import { Info } from 'lucide-react'
import { useEffect, useState } from 'react'

const ASSETS = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: '₿', price: 64230.5, blockchain: 'bitcoin' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', price: 3450.25, blockchain: 'ethereum' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', icon: 'S', price: 145.8, blockchain: 'solana' },
  { id: 'usdc', name: 'USD Coin', symbol: 'USDC', icon: '$', price: 1.0, blockchain: 'ethereum' }
] as const

export const CryptoPurchaseForm = () => {
  const [amount, setAmount] = useState<string>('1000')
  const [asset, setAsset] = useState<string>('btc')

  const selectedAsset = ASSETS.find((a) => a.id === asset)
  const cryptoAmount = selectedAsset ? (Number(amount) / selectedAsset.price).toFixed(6) : '0'
  const { createPaymentLink, loading, error, data } = useSwapped()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedAsset || !amount || Number(amount) <= 0) {
      return
    }

    await createPaymentLink({
      purchase: {
        name: `${selectedAsset.name} Purchase`,
        price: amount,
        currency: 'PHP'
      },
      metadata: {
        customerEmail: 'customer@example.com'
      },
      preferredPayCurrency: {
        symbol: selectedAsset.symbol,
        blockchain: selectedAsset.blockchain
      },
      testMode: true
    }).catch(console.error)
  }

  useEffect(() => {
    if (error) {
      console.error('[ERROR]', error)
    }
    if (data) {
      console.log('[DATA]', data)
    }
  }, [error, data])

  return (
    <Card className='rounded-none w-full md:max-w-md bg-depths border-0 shadow-2xl overflow-hidden'>
      <form onSubmit={handleSubmit}>
        <CardHeader className='space-y-1'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-2xl font-bold tracking-tight'>Create Payment</CardTitle>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='amount' className='text-sm font-medium text-muted-foreground'>
              You pay
            </Label>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium font-space'>
                ₱
              </span>
              <Input
                id='amount'
                type='number'
                placeholder='0.00'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className='rounded-none font-space pl-7 pr-20 h-14 text-2xl font-semibold bg-secondary/50 border-border focus:ring-primary'
              />
              <div className='absolute right-3 top-1/2 -translate-y-1/2 px-1 text-base font-bold'>PHP</div>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='asset' className='text-sm font-medium text-muted-foreground'>
              You receive
            </Label>
            <div className='grid grid-cols-1 gap-4'>
              <Select value={asset} onValueChange={setAsset}>
                <SelectTrigger id='asset' className='h-14 bg-secondary/50 border-border text-lg font-medium'>
                  <SelectValue placeholder='Select asset' />
                </SelectTrigger>
                <SelectContent className='bg-card border-border'>
                  {ASSETS.map((a) => (
                    <SelectItem key={a.id} value={a.id} className='focus:bg-primary focus:text-primary-foreground'>
                      <div className='flex items-center gap-3'>
                        <span className='flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold'>
                          {a.icon}
                        </span>
                        <span className='font-semibold'>{a.name}</span>
                        <span className='text-muted-foreground text-xs'>{a.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='rounded-xl bg-secondary/30 p-4 space-y-3 border border-border/50'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Est. {selectedAsset?.symbol} Amount</span>
              <span className='font-mono font-bold text-primary'>
                {cryptoAmount} {selectedAsset?.symbol}
              </span>
            </div>
            <div className='flex justify-between text-sm border-t border-border/20 pt-3'>
              <span className='text-muted-foreground flex items-center gap-1'>
                Exchange Rate <Info className='h-3 w-3' />
              </span>
              <span className='text-xs text-muted-foreground'>
                1 {selectedAsset?.symbol} = ${selectedAsset?.price.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex flex-col gap-3 py-8'>
          <Button
            type='submit'
            disabled={loading}
            className='w-full h-12 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-all active:scale-[0.98]'>
            Review Purchase
          </Button>
          <p className='text-[10px] text-center font-geist-sans text-muted-foreground font-normal px-4'>
            By continuing, you agree to our Terms of Service and Privacy Policy. Transaction fees may apply.
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
