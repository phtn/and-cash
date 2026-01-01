import Link from 'next/link'

export const Brand = () => {
  return (
    <Link href={'/'} className='flex items-center justify-between h-16 ps-4 md:py-3 shrink-0'>
      <div className='relative'>
        <div className='text-lg text-foreground font-brk font-thin tracking-wide md:text-xl ml-0.5'>
          <span className='text-indigo-600 font-black'>&</span>
          <span className='text-black'>cash</span>
        </div>
      </div>
      <div className='flex items-center px-2'></div>
    </Link>
  )
}
