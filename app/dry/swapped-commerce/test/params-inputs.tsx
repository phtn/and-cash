'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, Loader2 } from 'lucide-react'
import type { EndpointAction } from './endpoint-config'
import { DEFAULT_VALUES } from './endpoint-config'

interface ParamsInputsProps {
  endpoint: EndpointAction
  params: Record<string, string>
  availableIds: Record<string, string[]>
  availableCurrencies: Array<{ id: string; symbol: string; name: string }>
  loadingIds: boolean
  onParamChange: (key: string, value: string) => void
  onFetchIds: (type: 'orderId' | 'paymentId' | 'payoutId' | 'currencyId') => void
  onFetchCurrencies: () => void
}

export const ParamsInputs = ({
  endpoint,
  params,
  availableIds,
  loadingIds,
  onParamChange,
  onFetchIds
}: ParamsInputsProps) => {
  if (!endpoint.requiresParams) return null

  switch (endpoint.paramsType) {
    case 'orderId':
      return (
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='orderId'>Order ID</Label>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => onFetchIds('orderId')}
              disabled={loadingIds}
              className='h-7 text-xs'>
              {loadingIds ? <Loader2 className='h-3 w-3 animate-spin mr-1' /> : <Download className='h-3 w-3 mr-1' />}
              Load IDs
            </Button>
          </div>
          {availableIds.orderId && availableIds.orderId.length > 0 ? (
            <Select value={params.orderId || ''} onValueChange={(value) => onParamChange('orderId', value)}>
              <SelectTrigger className='w-full bg-amber-100'>
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
              onChange={(e) => onParamChange('orderId', e.target.value)}
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
                onClick={() => onFetchIds('orderId')}
                disabled={loadingIds}
                className='h-7 text-xs'>
                {loadingIds ? <Loader2 className='h-3 w-3 animate-spin mr-1' /> : <Download className='h-3 w-3 mr-1' />}
                Load IDs
              </Button>
            </div>
            {availableIds.orderId && availableIds.orderId.length > 0 ? (
              <Select value={params.orderId || ''} onValueChange={(value) => onParamChange('orderId', value)}>
                <SelectTrigger className='w-full bg-amber-100'>
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
                onChange={(e) => onParamChange('orderId', e.target.value)}
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
              onChange={(e) => onParamChange('amount', e.target.value)}
              placeholder='Refund amount'
              className='w-full'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='reason'>Reason (optional)</Label>
            <Select value={params.reason || ''} onValueChange={(value) => onParamChange('reason', value)}>
              <SelectTrigger className='w-full bg-amber-100'>
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
            <Select value={params.name || ''} onValueChange={(value) => onParamChange('name', value)}>
              <SelectTrigger className='w-full bg-amber-100'>
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
              <Select value={params.price || ''} onValueChange={(value) => onParamChange('price', value)}>
                <SelectTrigger className='w-full bg-amber-100'>
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
              <Select value={params.currency || ''} onValueChange={(value) => onParamChange('currency', value)}>
                <SelectTrigger className='w-full bg-amber-100'>
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
            <Select value={params.customerEmail || ''} onValueChange={(value) => onParamChange('customerEmail', value)}>
              <SelectTrigger className='w-full bg-amber-100'>
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
              <Select value={params.symbol || ''} onValueChange={(value) => onParamChange('symbol', value)}>
                <SelectTrigger className='w-full bg-amber-100'>
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
              <Select value={params.blockchain || ''} onValueChange={(value) => onParamChange('blockchain', value)}>
                <SelectTrigger className='w-full bg-amber-100'>
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
            <Select value={params.testMode || 'true'} onValueChange={(value) => onParamChange('testMode', value)}>
              <SelectTrigger className='w-full bg-amber-100'>
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
                onValueChange={(value) => onParamChange('purchaseAmount', value)}>
                <SelectTrigger className='w-full bg-amber-100'>
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
                onValueChange={(value) => onParamChange('purchaseCurrency', value)}>
                <SelectTrigger className='w-full bg-amber-100'>
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
              onValueChange={(value) => onParamChange('preferredPayCurrency', value)}>
              <SelectTrigger className='w-full bg-amber-100'>
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
              <Select value={params.externalId || ''} onValueChange={(value) => onParamChange('externalId', value)}>
                <SelectTrigger className='w-full bg-amber-100'>
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
              <Select value={params.customerId || ''} onValueChange={(value) => onParamChange('customerId', value)}>
                <SelectTrigger className='w-full bg-amber-100'>
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
              onChange={(e) => onParamChange('metadata', e.target.value)}
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
              onClick={() => onFetchIds('paymentId')}
              disabled={loadingIds}
              className='h-7 text-xs'>
              {loadingIds ? <Loader2 className='h-3 w-3 animate-spin mr-1' /> : <Download className='h-3 w-3 mr-1' />}
              Load IDs
            </Button>
          </div>
          {availableIds.paymentId && availableIds.paymentId.length > 0 ? (
            <Select value={params.paymentId || ''} onValueChange={(value) => onParamChange('paymentId', value)}>
              <SelectTrigger className='w-full bg-amber-100'>
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
              onChange={(e) => onParamChange('paymentId', e.target.value)}
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
              onClick={() => onFetchIds('currencyId')}
              disabled={loadingIds}
              className='h-7 text-xs'>
              {loadingIds ? <Loader2 className='h-3 w-3 animate-spin mr-1' /> : <Download className='h-3 w-3 mr-1' />}
              Load IDs
            </Button>
          </div>
          {availableIds.currencyId && availableIds.currencyId.length > 0 ? (
            <Select value={params.currencyId || ''} onValueChange={(value) => onParamChange('currencyId', value)}>
              <SelectTrigger className='w-full bg-amber-100'>
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
              onChange={(e) => onParamChange('currencyId', e.target.value)}
              placeholder='e.g., BTC, ETH, USDC or click Load IDs'
              className='w-full'
            />
          )}
        </div>
      )

    case 'getQuote':
      return (
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='fromAmount'>From Amount *</Label>
            <Select value={params.fromAmount || ''} onValueChange={(value) => onParamChange('fromAmount', value)}>
              <SelectTrigger className='w-full bg-amber-100'>
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
            <Label htmlFor='fromFiatCurrency'>From Fiat Currency *</Label>
            <Select
              value={params.fromFiatCurrency || ''}
              onValueChange={(value) => onParamChange('fromFiatCurrency', value)}>
              <SelectTrigger className='w-full bg-amber-100'>
                <SelectValue placeholder='Select fiat currency' />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_VALUES.fromCurrencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className='text-xs text-muted-foreground'>Source fiat currency (e.g., EUR, USD, PHP)</p>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='toCurrency'>To Currency *</Label>
              <Select value={params.toCurrency || ''} onValueChange={(value) => onParamChange('toCurrency', value)}>
                <SelectTrigger className='w-full bg-amber-100'>
                  <SelectValue placeholder='Select crypto' />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_VALUES.toCurrencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className='text-xs text-muted-foreground'>Target crypto (e.g., BTC, ETH, USDT)</p>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='toBlockchain'>To Blockchain *</Label>
              <Select value={params.toBlockchain || ''} onValueChange={(value) => onParamChange('toBlockchain', value)}>
                <SelectTrigger className='w-full bg-amber-100'>
                  <SelectValue placeholder='Select blockchain' />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_VALUES.cryptoBlockchains.map((blockchain) => (
                    <SelectItem key={blockchain} value={blockchain}>
                      {blockchain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className='text-xs text-muted-foreground'>Target blockchain (e.g., tron, ethereum)</p>
            </div>
          </div>
        </div>
      )

    case 'createPayout':
      return (
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='amount'>Amount *</Label>
              <Select value={params.amount || ''} onValueChange={(value) => onParamChange('amount', value)}>
                <SelectTrigger className='w-full bg-amber-100'>
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
              <Select value={params.currency || ''} onValueChange={(value) => onParamChange('currency', value)}>
                <SelectTrigger className='w-full bg-amber-100'>
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
              onValueChange={(value) => onParamChange('destinationType', value)}>
              <SelectTrigger className='w-full bg-amber-100'>
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
              onChange={(e) => onParamChange('destination', e.target.value)}
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
            <Select value={params.reference || ''} onValueChange={(value) => onParamChange('reference', value)}>
              <SelectTrigger className='w-full bg-amber-100'>
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
              onClick={() => onFetchIds('payoutId')}
              disabled={loadingIds}
              className='h-7 text-xs'>
              {loadingIds ? <Loader2 className='h-3 w-3 animate-spin mr-1' /> : <Download className='h-3 w-3 mr-1' />}
              Load IDs
            </Button>
          </div>
          {availableIds.payoutId && availableIds.payoutId.length > 0 ? (
            <Select value={params.payoutId || ''} onValueChange={(value) => onParamChange('payoutId', value)}>
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
              onChange={(e) => onParamChange('payoutId', e.target.value)}
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
            onChange={(e) => onParamChange('customerId', e.target.value)}
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
              onChange={(e) => onParamChange('customerId', e.target.value)}
              placeholder='Enter customer ID'
              className='w-full'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='kycData'>KYC Data (JSON) *</Label>
            <Input
              id='kycData'
              value={params.kycData || ''}
              onChange={(e) => onParamChange('kycData', e.target.value)}
              placeholder='{"customerId": "...", "firstName": "...", "lastName": "...", ...}'
              className='w-full'
            />
            <p className='text-xs text-muted-foreground'>
              Required fields: `customerId`, `firstName`, `lastName`, `dateOfBirth`, `nationality`, `address`,
              `documents`
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
