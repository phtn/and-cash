export type EndpointCategory =
  | 'orders'
  | 'paymentLinks'
  | 'paymentRoutes'
  | 'payments'
  | 'balances'
  | 'quotes'
  | 'currencies'
  | 'blockchains'
  | 'payouts'
  | 'kyc'

export type EndpointAction = {
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

export const ENDPOINTS: EndpointAction[] = [
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

  // Currencies
  {
    category: 'currencies',
    method: 'list',
    label: 'List Currencies',
    description: 'Get all available currencies',
    requiresParams: false
  },

  // Blockchains
  {
    category: 'blockchains',
    method: 'list',
    label: 'List Blockchains',
    description: 'Get all available blockchains',
    requiresParams: false
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

export const DEFAULT_VALUES = {
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

export const getDefaultParams = (endpoint: EndpointAction): Record<string, string> => {
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
      // New SDK params: fromAmount, fromFiatCurrency, toCurrency, toBlockchain
      return {
        fromAmount: getRandomValue(DEFAULT_VALUES.amounts),
        fromFiatCurrency: getRandomValue(DEFAULT_VALUES.fromCurrencies),
        toCurrency: getRandomValue(DEFAULT_VALUES.toCurrencies),
        toBlockchain: getRandomValue(DEFAULT_VALUES.cryptoBlockchains)
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
