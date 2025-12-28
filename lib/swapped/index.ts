import { createClient } from 'swapped-commerce-sdk'

/**
 * Swapped Commerce SDK Client
 *
 * NOTE: This client is used in client components. If SWAPPED_API_PK is a public key
 * (safe to expose), use NEXT_PUBLIC_SWAPPED_API_PK instead. If it's a private key,
 * consider moving API calls to Next.js API routes for security.
 */
export const swapped = createClient({
  apiKey: process.env.NEXT_PUBLIC_SWAPPED_API_PK ?? '',
  environment: 'sandbox'
})
