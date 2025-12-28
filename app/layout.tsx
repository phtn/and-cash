import type { Metadata } from 'next'
import { Doto, Geist, Geist_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'
const space = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin']
})
const doto = Doto({
  variable: '--font-doto',
  subsets: ['latin']
})
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: '&Cash',
  description: 'Accept Payments',
  icons: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      url: '/svg/and-cash-icon.svg'
    }
  ]
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${space.variable} ${doto.variable} ${geistSans.variable} ${geistMono.variable} antialiased dark bg-dark font-sans`}>
        <div className='max-w-5xl mx-auto'>{children}</div>
      </body>
    </html>
  )
}
