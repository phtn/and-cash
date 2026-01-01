'use client'

import type { HTMLAttributes, ReactElement, ReactNode } from 'react'

import { Icon, type IconName } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { ClassName } from '@/types'
import Link, { LinkProps } from 'next/link'

interface BundleCardRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const BundleCardRoot = ({ children, className, ...props }: BundleCardRootProps) => (
  <div
    className={cn('w-full max-w-5xl rounded-3xl overflow-hidden border border-foreground/40 bg-white', className)}
    {...props}>
    {children}
  </div>
)

interface BundleCardHeaderProps {
  children: ReactNode
}

const BundleCardHeader = ({ children }: BundleCardHeaderProps) => (
  <div className='flex items-center justify-between px-6 py-4'>{children}</div>
)

interface BundleCardTitleProps {
  children: ReactNode
}

const BundleCardTitle = ({ children }: BundleCardTitleProps) => (
  <h1 className='font-polysans text-xl md:text-2xl tracking-tight text-foreground/80'>{children}</h1>
)

interface BundleCardFooterProps {
  children: ReactNode
  className?: ClassName
}

const BundleCardFooter = ({ children, className }: BundleCardFooterProps) => (
  <div
    className={cn(
      'relative flex text-sm md:text-base font-sans tracking-tight border-t border-foreground/20 bg-serene/20 text-[13px] text-foreground/80',
      className
    )}>
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
    {children}
  </div>
)

interface BundleCardDescriptionProps {
  children: ReactNode
  iconName?: IconName
}

const BundleCardDescription = ({ children, iconName = 'info' }: BundleCardDescriptionProps) => (
  <div className='relative flex flex-1 items-center gap-1 px-4 py-3 min-w-0'>
    <Icon name={iconName} className='size-3.5 shrink-0 text-zinc-100' strokeWidth={2} />
    <span className='truncate font-brk text-sm'>{children}</span>
  </div>
)

interface BundleCardActionProps extends LinkProps {
  iconName?: IconName
  className?: string
  children?: ReactNode
}

const BundleCardAction = ({ iconName = 'chevrons-right', className, children, ...props }: BundleCardActionProps) => (
  <Link
    className={cn('flex items-center justify-center px-4 py-3  text-white transition-colors', className)}
    {...props}>
    {children ?? <Icon name={iconName} className='size-8' strokeWidth={1.5} />}
  </Link>
)

interface BundleCardProps extends Omit<BundleCardRootProps, 'children'> {
  title?: string
  description?: string
  actionHref?: string
  iconName?: IconName
  actionIconName?: IconName
  actionLabel?: string
  footerStyle?: ClassName
}

type BundleCardComponent = ((props: BundleCardProps) => ReactElement) & {
  Root: typeof BundleCardRoot
  Header: typeof BundleCardHeader
  Title: typeof BundleCardTitle
  Footer: typeof BundleCardFooter
  Description: typeof BundleCardDescription
  Action: typeof BundleCardAction
}

export const BundleCard: BundleCardComponent = ({
  title = 'title',
  description = 'your description',
  iconName = 'info',
  actionIconName = 'chevron-double',
  actionHref = '#',
  actionLabel = 'Launch',
  className,
  footerStyle
}: BundleCardProps) => (
  <BundleCardRoot className={className}>
    <BundleCardHeader>
      <BundleCardTitle>{title}</BundleCardTitle>
    </BundleCardHeader>

    <BundleCardFooter className={footerStyle}>
      <BundleCardDescription iconName={iconName}>{description}</BundleCardDescription>
      <div className='flex items-center'>
        <BundleCardAction href={actionHref} aria-label={actionLabel} iconName={actionIconName} />
      </div>
    </BundleCardFooter>
  </BundleCardRoot>
)

BundleCard.Root = BundleCardRoot
BundleCard.Header = BundleCardHeader
BundleCard.Title = BundleCardTitle
BundleCard.Footer = BundleCardFooter
BundleCard.Description = BundleCardDescription
BundleCard.Action = BundleCardAction
