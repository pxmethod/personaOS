import { cn } from '@/lib/utils'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

const buttonClassName = (
  variant: 'default' | 'ghost' | 'outline' | 'subtle',
  size: 'sm' | 'md',
  className?: string,
) =>
  cn(
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    size === 'sm' ? 'h-8 px-3 text-xs' : 'h-10 px-4 text-sm',
    variant === 'default' &&
      'bg-lime text-canvas shadow-sm hover:bg-lime-hover hover:text-white active:brightness-95',
    variant === 'ghost' && 'bg-transparent text-ink hover:bg-white/10 hover:text-white',
    variant === 'outline' &&
      'border border-lime bg-transparent text-lime hover:bg-lime-muted hover:text-white',
    variant === 'subtle' && 'bg-lime-muted text-lime hover:bg-lime hover:text-white',
    className,
  )

export function Button({
  className,
  variant = 'default',
  size = 'md',
  href,
  ...props
}: (ButtonHTMLAttributes<HTMLButtonElement> | AnchorHTMLAttributes<HTMLAnchorElement>) & {
  variant?: 'default' | 'ghost' | 'outline' | 'subtle'
  size?: 'sm' | 'md'
  /** When set, renders a link (e.g. `mailto:`) with the same styles as a button. */
  href?: string
}) {
  const classes = buttonClassName(variant, size, className)
  if (href) {
    return (
      <a href={href} className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} />
    )
  }
  return (
    <button
      type="button"
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  )
}
