import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import type { Accent } from './accent'

const sizes = {
  xs: { box: 'size-6 rounded', icon: 'size-3.5' },
  sm: { box: 'size-8 rounded-md', icon: 'size-4' },
  md: { box: 'size-10 rounded-lg', icon: 'size-5' },
  lg: { box: 'size-12 rounded-lg', icon: 'size-6' },
}

/**
 * App icon tile. Every app uses the same Verve blue tint so the portal reads as
 * one product; the app's own accent is kept for future use but not shown here.
 */
export function AppIcon({
  icon: Icon,
  size = 'md',
  className,
}: {
  icon: LucideIcon
  accent?: Accent
  size?: keyof typeof sizes
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-grid shrink-0 place-items-center bg-primary-soft text-primary ring-1 ring-primary/10 ring-inset',
        sizes[size].box,
        className,
      )}
    >
      <Icon className={sizes[size].icon} strokeWidth={1.8} aria-hidden />
    </span>
  )
}
