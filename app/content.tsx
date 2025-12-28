'use client'

import { ArcActionBar, ArcCard } from '@/components/hyper/arc-card'
import { Brand } from '@/components/hyper/brand'
import { Icon } from '@/lib/icons'
import Link from 'next/link'

export const Content = () => {
  return (
    <main className='bg-serene max-w-5xl mx-auto'>
      <div className='flex items-center justify-between w-full px-2'>
        <Brand dark size='sm' />
        <div className='flex items-center space-x-1 text-dark leading-none text-sm font-semibold font-space'>
          <Icon name='solana' className='size-2.5 mb-px' />
          <span>140</span>
          <Icon name='ethereum' className='size-2.5 mb-px' />
          <span>3.3K</span>
        </div>
      </div>
      <div className='flex items-start justify-center bg-zinc-50 font-sans dark:bg-serene'>
        <ArcCard className='bg-linear-to-r from-serene to-depths w-full'>
          <ArcActionBar>
            <Meld />
            <Swapped />
          </ArcActionBar>
        </ArcCard>
      </div>
    </main>
  )
}

const Swapped = () => {
  return (
    <Link href='/swapped-commerce' prefetch className='relative flex items-center justify-center'>
      <div className='flex h-12 w-full items-center justify-center gap-3 bg-dark px-12 text-depths transition-colors font-polysans'>
        <span className='relative select-none z-20 text-2xl font-light! font-polysans'>swapped</span>
      </div>
    </Link>
  )
}
const Meld = () => {
  return (
    <a
      className='flex h-12 w-full items-center justify-center gap-3 bg-dark px-12 text-serene transition-colors font-polysans'
      href={process.env.NEXT_PUBLIC_MELD_URL}
      target='_blank'
      rel='noopener noreferrer'>
      <span className='text-xl font-light! font-polysans'>meld.io</span>
    </a>
  )
}
