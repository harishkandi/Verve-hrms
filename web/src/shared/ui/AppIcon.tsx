import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { type Accent, accents } from './accent'

const sizes = {
  xs: { box: 'size-6 rounded', icon: 'size-3.5' },
  sm: { box: 'size-8 rounded-md', icon: 'size-4' },
  md: { box: 'size-10 rounded-lg', icon: 'size-5' },
  lg: { box: 'size-12 rounded-lg', icon: 'size-6' },
}

/**
 * App icon tile. With an accent it is a colored gradient with a white glyph and a
 * soft glow; without one it falls back to the neutral Verve blue tint.
 */
export function AppIcon({
  icon: Icon,
  accent,
  size = 'md',
  className,
}: {
  icon: LucideIcon
  accent?: Accent
  size?: keyof typeof sizes
  className?: string
}) {
  const colored = accent ? accents[accent] : null
  const glow = colored && (size === 'md' || size === 'lg') ? colored.glow : null
  return (
    <span
      className={cn(
        'inline-grid shrink-0 place-items-center',
        colored
          ? cn(colored.tile, glow, 'text-white ring-1 ring-white/20 ring-inset')
          : 'bg-primary-soft text-primary ring-1 ring-primary/10 ring-inset',
        sizes[size].box,
        className,
      )}
    >
      <Icon className={sizes[size].icon} strokeWidth={1.8} aria-hidden />
    </span>
  )
}
