import { cn } from '@/shared/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'checkout'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap transition-colors select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-fg hover:bg-primary-hover',
  secondary: 'border border-border bg-surface text-fg hover:bg-surface-2',
  ghost: 'text-muted hover:bg-surface-2 hover:text-fg',
  danger: 'bg-bad text-white hover:opacity-90',
  /** Deliberate but calm: used for Check out. */
  checkout: 'border border-bad/30 bg-bad-soft text-bad hover:border-bad/50',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-9 px-4 text-sm',
  lg: 'h-11 px-5 text-[15px]',
}

/**
 * Button classes, for when something that isn't a <button> (like a router
 * <Link>) should look like one.
 */
export function buttonClass({
  variant = 'primary',
  size = 'md',
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className)
}
