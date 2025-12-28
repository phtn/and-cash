import { cn } from '@/lib/utils'

interface Props {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  dark?: boolean
}
export const Brand = ({ className, size = 'md', dark = false }: Props) => {
  return (
    <div
      suppressHydrationWarning
      className={cn(
        'font-polysans text-6xl flex items-center -space-x-1',
        { 'text-5xl': size === 'lg', 'text-4xl': size === 'md', 'text-3xl': size === 'sm', 'text-dark': dark },
        className
      )}>
      <span className='opacity-70 font-black font-doto'>&</span>
      <span className='font-black tracking-tighter'>Cash</span>
    </div>
  )
}
