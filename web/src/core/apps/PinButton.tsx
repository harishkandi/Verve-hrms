import { Star } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { togglePinned, useAppPrefs } from './appPrefs'
import type { AppManifest } from './types'

export function PinButton({ app, className }: { app: AppManifest; className?: string }) {
  const { pinned } = useAppPrefs()
  const isPinned = pinned.includes(app.id)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        togglePinned(app.id)
      }}
      aria-pressed={isPinned}
      aria-label={isPinned ? `Unpin ${app.name}` : `Pin ${app.name}`}
      title={isPinned ? 'Unpin' : 'Pin to the top of the side bar'}
      className={cn(
        'inline-grid size-8 place-items-center rounded-lg transition hover:bg-surface-2',
        isPinned ? 'text-brass' : 'text-muted hover:text-fg',
        className,
      )}
    >
      <Star className="size-4" fill={isPinned ? 'currentColor' : 'none'} aria-hidden />
    </button>
  )
}
