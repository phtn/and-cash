import { ReactNode } from 'react'
import { Brand } from './brand'

interface NavbarProps {
  children?: ReactNode
}

export const Navbar = ({ children }: NavbarProps) => {
  return (
    <div className='relative flex items-center justify-between text-sm md:text-base font-sans h-14 sm:h-20 md:h-24 tracking-tight border-foreground/10 text-[13px] text-foreground/80'>
      <Brand />
      <div>{children}</div>
    </div>
  )
}
