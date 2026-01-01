'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Play, Square, Trash2 } from 'lucide-react'
import type { WidgetConfig } from './use-widget-tester'

interface ConfigInputsProps {
  config: WidgetConfig
  isMounted: boolean
  onConfigChange: (key: keyof WidgetConfig, value: string) => void
  onMount: () => void
  onUnmount: () => void
  onDestroy: () => void
}

const CRYPTO_CURRENCIES = [
  'BTC',
  'ETH',
  'USDT',
  'USDC',
  'BNB',
  'SOL',
  'XRP',
  'ADA',
  'DOGE',
  'MATIC',
  'DOT',
  'AVAX',
  'LINK',
  'LTC',
  'BCH'
]

const FIAT_CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'CAD',
  'AUD',
  'CHF',
  'CNY',
  'INR',
  'BRL',
  'KRW',
  'MXN',
  'SGD',
  'HKD',
  'NZD',
  'SEK',
  'NOK',
  'DKK',
  'PLN',
  'ZAR'
]

const LANGUAGES = ['en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'pl', 'ru', 'ja', 'ko', 'zh', 'ar', 'tr', 'vi']

const PAYMENT_METHODS = ['creditcard', 'bank', 'applepay', 'googlepay', 'sepa', 'fasterpayments']

const KYC_LEVELS = [
  { value: '0', label: '0 - No KYC' },
  { value: '1', label: '1 - Proof of ID + Liveness' },
  { value: '2', label: '2 - Proof of ID + Liveness + Address' }
]

export const ConfigInputs = ({
  config,
  isMounted,
  onConfigChange,
  onMount,
  onUnmount,
  onDestroy
}: ConfigInputsProps) => {
  return (
    <Card className='text-dark'>
      <CardHeader>
        <CardTitle>iFrame Widget Configuration</CardTitle>
        <CardDescription className='font-sans'>Configure all iframe parameters</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4 max-h-[80vh] overflow-y-auto'>
        {/* Environment */}
        <div className='space-y-2'>
          <Label htmlFor='environment'>Environment *</Label>
          <Select
            value={config.environment || 'sandbox'}
            onValueChange={(value) => onConfigChange('environment', value)}>
            <SelectTrigger className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='sandbox'>Sandbox</SelectItem>
              <SelectItem value='production'>Production</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Required Parameters */}
        <div className='pt-2 border-t'>
          <h3 className='text-sm font-semibold mb-3 text-red-600 dark:text-red-400'>Required Parameters</h3>

          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='apiKey'>API Key (Public Key) *</Label>
              <Input
                id='apiKey'
                value={config.apiKey || ''}
                onChange={(e) => onConfigChange('apiKey', e.target.value)}
                placeholder='pk_live_... or pk_test_... (uses NEXT_PUBLIC_SANDBOX_PK if set)'
                className='w-full'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='secretKey'>
                Secret Key <span className='text-muted-foreground text-xs'>(optional if SWAPPED_API_SK is set)</span>
              </Label>
              <Input
                id='secretKey'
                type='password'
                autoComplete='off'
                value={config.secretKey || ''}
                onChange={(e) => onConfigChange('secretKey', e.target.value)}
                placeholder='Enter secret key or set SANDBOX_SK in .env'
                className='w-full'
              />
              <p className='text-xs text-muted-foreground'>
                Used server-side to generate HMAC-SHA256 signature. If{' '}
                <code className='text-xs bg-background px-1 py-0.5 rounded'>SANDBOX_SK</code> is set in environment,
                this field is optional.
              </p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='currencyCode'>Currency Code *</Label>
              <Select
                value={config.currencyCode || '__none__'}
                onValueChange={(value) => onConfigChange('currencyCode', value === '__none__' ? '' : value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select cryptocurrency' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='__none__'>Select currency</SelectItem>
                  {CRYPTO_CURRENCIES.map((crypto) => (
                    <SelectItem key={crypto} value={crypto}>
                      {crypto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='walletAddress'>Wallet Address *</Label>
              <Input
                id='walletAddress'
                value={config.walletAddress || ''}
                onChange={(e) => onConfigChange('walletAddress', e.target.value)}
                placeholder='Single: ltc1q2k0xaafhgt3s8qw03wmajjmlc8gcepdy0un0ah'
                className='w-full'
              />
              <p className='text-xs text-muted-foreground'>
                Single address or multiple: BTC:address1,LTC:address2,DOGE:address3
              </p>
            </div>
          </div>
        </div>

        {/* Optional Parameters */}
        <div className='pt-4 border-t'>
          <h3 className='text-sm font-semibold mb-3'>Optional Parameters</h3>

          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='language'>Language</Label>
                <Select
                  value={config.language || '__none__'}
                  onValueChange={(value) => onConfigChange('language', value === '__none__' ? '' : value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select language' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='__none__'>None</SelectItem>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='method'>Payment Method</Label>
                <Select
                  value={config.method || '__none__'}
                  onValueChange={(value) => onConfigChange('method', value === '__none__' ? '' : value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select method' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='__none__'>None</SelectItem>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='baseCurrencyCode'>Base Currency (Fiat)</Label>
                <Select
                  value={config.baseCurrencyCode || '__none__'}
                  onValueChange={(value) => onConfigChange('baseCurrencyCode', value === '__none__' ? '' : value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select fiat' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='__none__'>None</SelectItem>
                    {FIAT_CURRENCIES.map((fiat) => (
                      <SelectItem key={fiat} value={fiat}>
                        {fiat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='lockBaseCurrency'>Lock Base Currency</Label>
                <Select
                  value={config.lockBaseCurrency || '__none__'}
                  onValueChange={(value) => onConfigChange('lockBaseCurrency', value === '__none__' ? '' : value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='__none__'>None</SelectItem>
                    <SelectItem value='True'>True</SelectItem>
                    <SelectItem value='False'>False</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='baseCurrencyAmount'>Base Currency Amount</Label>
                <Input
                  id='baseCurrencyAmount'
                  type='number'
                  value={config.baseCurrencyAmount || ''}
                  onChange={(e) => onConfigChange('baseCurrencyAmount', e.target.value)}
                  placeholder='e.g., 100'
                  className='w-full'
                />
                <p className='text-xs text-muted-foreground'>Integer, max 2 decimals</p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='quoteCurrencyAmount'>Quote Currency Amount</Label>
                <Input
                  id='quoteCurrencyAmount'
                  type='number'
                  step='0.000001'
                  value={config.quoteCurrencyAmount || ''}
                  onChange={(e) => onConfigChange('quoteCurrencyAmount', e.target.value)}
                  placeholder='e.g., 0.001'
                  className='w-full'
                />
                <p className='text-xs text-muted-foreground'>Integer, max 6 decimals</p>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  value={config.email || ''}
                  onChange={(e) => onConfigChange('email', e.target.value)}
                  placeholder='customer@example.com'
                  className='w-full'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='externalCustomerId'>External Customer ID</Label>
                <Input
                  id='externalCustomerId'
                  value={config.externalCustomerId || ''}
                  onChange={(e) => onConfigChange('externalCustomerId', e.target.value)}
                  placeholder='Your unique customer ID'
                  className='w-full'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='redirectUrl'>Redirect URL</Label>
              <Input
                id='redirectUrl'
                value={config.redirectUrl || ''}
                onChange={(e) => onConfigChange('redirectUrl', e.target.value)}
                placeholder='https://example.com/success?orderId={orderId}&orderStatus={orderStatus}'
                className='w-full'
              />
              <p className='text-xs text-muted-foreground'>
                Supports variables: {'{orderId}'}, {'{orderStatus}'}
              </p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='responseUrl'>Response URL (Webhook)</Label>
              <Input
                id='responseUrl'
                value={config.responseUrl || ''}
                onChange={(e) => onConfigChange('responseUrl', e.target.value)}
                placeholder='https://example.com/webhook'
                className='w-full'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='customerKYC'>Customer KYC Level</Label>
                <Select
                  value={config.customerKYC || '__none__'}
                  onValueChange={(value) => onConfigChange('customerKYC', value === '__none__' ? '' : value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select KYC level' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='__none__'>None</SelectItem>
                    {KYC_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='style'>Style ID</Label>
                <Input
                  id='style'
                  value={config.style || ''}
                  onChange={(e) => onConfigChange('style', e.target.value)}
                  placeholder='Style ID from dashboard'
                  className='w-full'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='destinationTag'>Destination Tag / Memo</Label>
              <Input
                id='destinationTag'
                value={config.destinationTag || ''}
                onChange={(e) => onConfigChange('destinationTag', e.target.value)}
                placeholder='XRP tag or TON memo'
                className='w-full'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='coverFees'>Cover Fees</Label>
                <Select
                  value={config.coverFees || '__none__'}
                  onValueChange={(value) => onConfigChange('coverFees', value === '__none__' ? '' : value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='__none__'>None</SelectItem>
                    <SelectItem value='True'>True</SelectItem>
                    <SelectItem value='False'>False</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='lockAmount'>Lock Amount</Label>
                <Select
                  value={config.lockAmount || '__none__'}
                  onValueChange={(value) => onConfigChange('lockAmount', value === '__none__' ? '' : value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='__none__'>None</SelectItem>
                    <SelectItem value='True'>True</SelectItem>
                    <SelectItem value='False'>False</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='minAmount'>Min Amount (EUR)</Label>
                <Input
                  id='minAmount'
                  type='number'
                  value={config.minAmount || ''}
                  onChange={(e) => onConfigChange('minAmount', e.target.value)}
                  placeholder='7'
                  className='w-full'
                />
                <p className='text-xs text-muted-foreground'>Minimum 7 EUR</p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='baseCountry'>Base Country (ISO)</Label>
                <Input
                  id='baseCountry'
                  value={config.baseCountry || ''}
                  onChange={(e) => onConfigChange('baseCountry', e.target.value)}
                  placeholder='US, GB, DE, etc.'
                  className='w-full'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='markup'>Markup (0-5)</Label>
              <Input
                id='markup'
                type='number'
                step='0.01'
                min='0'
                max='5'
                value={config.markup || ''}
                onChange={(e) => onConfigChange('markup', e.target.value)}
                placeholder='0.5'
                className='w-full'
              />
            </div>
          </div>
        </div>

        <div className='flex gap-2 pt-4 border-t'>
          {!isMounted ? (
            <Button onClick={onMount} className='flex-1'>
              <Play className='mr-2 h-4 w-4' />
              Mount Widget
            </Button>
          ) : (
            <>
              <Button onClick={onUnmount} variant='outline' className='flex-1'>
                <Square className='mr-2 h-4 w-4' />
                Unmount
              </Button>
              <Button onClick={onDestroy} variant='destructive' className='flex-1'>
                <Trash2 className='mr-2 h-4 w-4' />
                Destroy
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
