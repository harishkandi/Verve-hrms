import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

/**
 * Side bar icons drawn in parts, so each can move on its own when clicked:
 * the clock hands turn, the notes shuffle, the arrow grows, the heart beats.
 * Animations live in index.css under `.rail-play` and respect reduced motion.
 */
const shapes: Record<string, ReactNode> = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path className="rl-door" d="M9.5 21v-6h5v6" />
    </>
  ),
  leave: (
    <>
      <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v3M16 3v3" />
      <path className="rl-check" pathLength={1} d="m9 15 2 2 4-4" />
    </>
  ),
  attendance: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path className="rl-hour" d="m12 12 3.2 2" />
      <path className="rl-min" d="M12 12V6.5" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  reimbursement: (
    <>
      <g className="rl-note-back">
        <path d="M6 8.5H5a2 2 0 0 0-2 2V17a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1" />
      </g>
      <g className="rl-note-front">
        <rect x="6" y="5" width="15" height="10" rx="2" />
        <circle cx="13.5" cy="10" r="2" />
        <path d="M9 10h.01M18 10h.01" />
      </g>
    </>
  ),
  pms: (
    <>
      <path className="rl-line" pathLength={1} d="m3 17 6-6 4 4 8-8" />
      <path className="rl-head" d="M14 7h7v7" />
    </>
  ),
  vervefit: (
    <path
      className="rl-heart"
      d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"
    />
  ),
  onboarding: (
    <>
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21a7 7 0 0 1 14 0" />
      <path className="rl-plus" d="M19 8v6M16 11h6" />
    </>
  ),
  exit: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path className="rl-arrow" d="m16 17 5-5-5-5M21 12H9" />
    </>
  ),
  apps: (
    <>
      <rect className="rl-sq" x="3" y="3" width="7" height="7" rx="1.5" />
      <rect className="rl-sq" x="14" y="3" width="7" height="7" rx="1.5" />
      <rect className="rl-sq" x="3" y="14" width="7" height="7" rx="1.5" />
      <rect className="rl-sq" x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
}

export function RailIcon({
  id,
  fallback: Fallback,
  playing,
}: {
  id: string
  /** Used for apps without a custom drawing; it gets a small hop instead. */
  fallback: LucideIcon
  playing: boolean
}) {
  const shape = shapes[id]
  const className = cn('rail-icon', `rl-${id}`, playing && 'rail-play')

  if (!shape) return <Fallback className={cn(className, 'rl-hop')} strokeWidth={1.8} aria-hidden />
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {shape}
    </svg>
  )
}
