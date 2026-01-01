import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, secretKey: clientSecretKey } = body

    if (!url) {
      return NextResponse.json(
        { success: false, message: 'URL is required' },
        { status: 400 }
      )
    }

    // Use server-side env var first, fallback to client-provided key (for testing)
    const secretKey = process.env.SANDBOX_SK || process.env.SWAPPED_API_SK || clientSecretKey

    if (!secretKey) {
      return NextResponse.json(
        { success: false, message: 'Secret key is required. Set SANDBOX_SK in environment or provide it in the request.' },
        { status: 400 }
      )
    }

    // Parse the URL to get the search string (query parameters)
    const urlObj = new URL(url)
    const searchString = urlObj.search

    // Create HMAC-SHA256 signature and encode in Base64
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(searchString)
      .digest('base64')

    return NextResponse.json({
      success: true,
      signature: encodeURIComponent(signature),
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    )
  }
}
