import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

/** Small rounded label, e.g. a category or status. */
export function Badge({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted',
        className,
      )}
      {...props}
    />
  )
}

export type StatusTone = 'ok' | 'warn' | 'bad' | 'teal' | 'brand' | 'neutral'

const pillTones: Record<StatusTone, string> = {
  ok: 'bg-ok-soft text-ok',
  warn: 'bg-warn-soft text-warn',
  bad: 'bg-bad-soft text-bad',
  teal: 'bg-teal-soft text-teal',
  brand: 'bg-primary-soft text-primary',
  neutral: 'border border-border bg-surface-2 text-muted',
}

/** Status pill with a dot: Approved, Pending approval, Holiday… */
export function StatusPill({ tone, children }: { tone: StatusTone; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex h-[22px] items-center gap-1.5 rounded-full px-2.5 text-[11.5px] font-semibold whitespace-nowrap',
        pillTones[tone],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {children}
    </span>
  )
}

/** Keyboard key hint, e.g. Ctrl K. */
export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-border bg-surface px-1.5 font-sans text-[11px] font-medium text-muted">
      {children}
    </kbd>
  )
}

export type AvatarTone = 'brand' | 'teal' | 'warn' | 'ok'

const avatarTones: Record<AvatarTone, string> = {
  brand: 'bg-primary-soft text-primary',
  teal: 'bg-teal-soft text-teal',
  warn: 'bg-warn-soft text-warn',
  ok: 'bg-ok-soft text-ok',
}

const avatarSizes = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-[11px]',
  md: 'size-9 text-xs',
  lg: 'size-10 text-sm',
  xl: 'size-20 text-2xl',
}

export function Avatar({
  initials,
  tone = 'brand',
  size = 'md',
  className,
}: {
  initials: string
  tone?: AvatarTone
  /** Set size here, not through className: `cn` doesn't resolve class conflicts. */
  size?: keyof typeof avatarSizes
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-grid shrink-0 place-items-center rounded-full font-semibold',
        avatarSizes[size],
        avatarTones[tone],
        className,
      )}
      aria-hidden
    >
      {initials}
    </span>
  )
}

export function Progress({
  value,
  className,
  barClassName = 'bg-primary',
  label,
}: {
  /** 0–100 */
  value: number
  className?: string
  barClassName?: string
  label: string
}) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-1.5 overflow-hidden rounded-full bg-border-soft', className)}
    >
      <div className={cn('h-full rounded-full', barClassName)} style={{ width: `${clamped}%` }} />
    </div>
  )
}

/** Square icon-only button for toolbars. Always pass an aria-label. */
export function IconButton({ className, ...props }: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        'relative inline-grid size-9 place-items-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-fg',
        className,
      )}
      {...props}
    />
  )
}
