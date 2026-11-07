import logoDark from '@/assets/brand/verve-logo-dark.png'
import logo from '@/assets/brand/verve-logo.png'
import markWhite from '@/assets/brand/verve-mark-white.png'
import { cn } from '@/shared/lib/cn'

/**
 * Official Verve Advisory logo. Shows the original artwork in light mode and a
 * recoloured version (lighter blue, off-white "Advisory") in dark mode.
 * Every logo in the portal comes from this file.
 */
export function VerveLogo({ size = 'md', className }: { size?: 'sm' | 'md'; className?: string }) {
  const height = size === 'md' ? 'h-8' : 'h-6'
  return (
    <span className={cn('inline-flex shrink-0', className)} role="img" aria-label="Verve Advisory">
      <img src={logo} alt="" className={cn(height, 'w-auto dark:hidden')} />
      <img src={logoDark} alt="" className={cn(height, 'hidden w-auto dark:block')} />
    </span>
  )
}

/** The "v" from the logo in white, for the navy side bar. */
export function VerveMonogram({ className }: { className?: string }) {
  return (
    <span
      className={cn('inline-grid size-10 place-items-center rounded-lg bg-white/8', className)}
      role="img"
      aria-label="Verve Advisory"
    >
      <img src={markWhite} alt="" className="h-[17px] w-auto" />
    </span>
  )
}
