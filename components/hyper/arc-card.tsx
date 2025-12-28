import { Icon, IconName } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { ClassName } from '@/types'
import Link from 'next/link'
import { PropsWithChildren, ReactNode } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { HyperList } from './list'

interface ArcCardProps {
  children?: ReactNode
  className?: string
  actionbar?: ReactNode
}

const ArcCard = ({ children, className }: ArcCardProps) => {
  return (
    <div className='w-full'>
      <Card className={cn('rounded-none p-0 border border-foreground/20 dark:bg-dark-table/40', className)}>
        <CardContent className='space-y-6 p-0'>{children}</CardContent>
      </Card>
    </div>
  )
}

interface ArcHeaderProps {
  title: ReactNode
  description?: string
  icon?: IconName
  iconStyle?: ClassName
  status?: ReactNode
}

const ArcHeader = ({ title, description, icon, iconStyle, status }: ArcHeaderProps) => (
  <div>
    <div className='flex items-center justify-between w-full'>
      <div className='flex items-center text-2xl font-polysans opacity-90 h-14'>{title}</div>
      <div className='flex items-center'>{status}</div>
    </div>
    <div className='flex items-center space-x-1 font-space'>
      {icon && <Icon name={icon} className={cn('size-6 text-indigo-400', iconStyle)} />}
      <span className='opacity-60'>{description}</span>
    </div>
  </div>
)

interface ArcCalloutProps {
  value?: ReactNode
  icon?: IconName
}

const ArcCallout = ({ value, icon }: ArcCalloutProps) => (
  <div className='flex items-center space-x-2 p-2 bg-sidebar/40 rounded-md'>
    {icon && <Icon name={icon} className='size-4 ml-0.5' />}
    <p className='text-sm text-color-muted'>{value}</p>
  </div>
)

const ArcActionBar = ({ children }: PropsWithChildren) => (
  <div className='grid grid-cols-2 w-full gap-px'>{children}</div>
)

interface ArcButtonProps {
  label: string
  fn?: VoidFunction
  href?: string
  icon?: IconName
}

const ArcButtonLeft = ({ label, fn, href, icon }: ArcButtonProps) => (
  <Link href={href ?? '#'}>
    <Button asChild size='lg' onClick={fn} className='w-full font-polysans font-normal! dark:bg-sidebar'>
      <span>{label}</span>
      {icon && <Icon name={icon} className='size-5' />}
    </Button>
  </Link>
)

const ArcButtonRight = ({ label, fn, href, icon }: ArcButtonProps) => (
  <Link href={href ?? ''}>
    <Button
      asChild
      onClick={fn}
      className='w-full font-polysans font-normal! bg-dark-gray dark:bg-white dark:text-dark-gray'>
      {icon && <Icon name={icon} className='size-5' />}
      <span>{label}</span>
    </Button>
  </Link>
)

interface ArcLineItemsProps<T> {
  data: T & { label: string; value: string }[]
}

const ArcLineItems = <T,>({ data }: ArcLineItemsProps<T>) => (
  <HyperList data={data} component={ArcLineItem} container='space-y-2 mb-8' />
)

const ArcLineItem = <T extends { label: string; value: string }>(item: T) => (
  <div className='flex justify-between text-sm border-t border-foreground/20 border-dotted first:border-0 pt-3 first:pt-0'>
    <span className=''>{item.label}</span>
    <span className='text-xl font-semibold font-space'>{item.value}</span>
  </div>
)

export { ArcActionBar, ArcButtonLeft, ArcButtonRight, ArcCallout, ArcCard, ArcHeader, ArcLineItems }
