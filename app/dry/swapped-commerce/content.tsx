'use client'

import { Brand } from '@/components/hyper/brand'
import { Button } from '@/components/ui/button'
import { TestTube } from 'lucide-react'
import Link from 'next/link'
import { CryptoPurchaseForm } from './form'

export const Content = () => {
  return (
    <div className='min-h-screen'>
      <header className='h-10 flex items-center justify-between text-dark font-sans px-2'>
        <span>Swapped Commerce SDK v1.0.0</span>
        <Link href='/swapped-commerce/test'>
          <Button variant='ghost' size='sm' className='h-8 text-xs'>
            <TestTube className='h-3 w-3 mr-1.5' />
            Test Endpoints
          </Button>
        </Link>
      </header>
      <main className='h-[calc(100lvh-60px)] flex justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-secondary via-background to-background'>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

        <div className='relative z-10 w-full flex flex-col items-center gap-8'>
          <CryptoPurchaseForm />

          <div className='flex items-center gap-6 grayscale opacity-40'>
            <Brand />
            <div className='h-4 w-px bg-border'></div>
            <span className='text-xs font-bold uppercase tracking-widest'>Secure Payments</span>
          </div>
          {/*<div className='text-center space-y-2'>
            <h1 className='text-4xl md:text-5xl font-black tracking-tighter text-balance'>
              Finance without the <span className='text-primary italic'>middleman.</span>
            </h1>
            <p className='text-muted-foreground max-w-100 mx-auto text-sm md:text-base leading-relaxed'>
              The self-custody platform that brings the best of DeFi directly to you.
            </p>
          </div>*/}
        </div>
      </main>
    </div>
  )
}
