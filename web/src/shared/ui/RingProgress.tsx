import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

/**
 * Circular progress ring with content in the middle, e.g. hours worked today
 * or a challenge's completion. Color comes from `className` via `text-*`.
 */
export function RingProgress({
  value,
  size = 140,
  thickness = 12,
  label,
  className = 'text-primary',
  trackClassName = 'text-surface-2',
  children,
}: {
  /** 0–100 */
  value: number
  size?: number
  thickness?: number
  /** What the ring measures, read out by screen readers. */
  label: string
  className?: string
  trackClassName?: string
  children?: ReactNode
}) {
  const clamped = Math.min(100, Math.max(0, value))
  const r = (size - thickness) / 2
  const circumference = 2 * Math.PI * r
  const center = size / 2

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={thickness}
          className={trackClassName}
        />
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${(clamped / 100) * circumference} ${circumference}`}
          transform={`rotate(-90 ${center} ${center})`}
          className={cn('transition-[stroke-dasharray] duration-700', className)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  )
}
