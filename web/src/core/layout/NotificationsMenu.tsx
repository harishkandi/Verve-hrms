import * as Popover from '@radix-ui/react-popover'
import { Bell } from 'lucide-react'
import { useState } from 'react'
import { getApp } from '@/core/apps/registry'
import { notifications as sampleNotifications } from '@/core/dashboard/sampleData'
import { cn } from '@/shared/lib/cn'
import { AppIcon } from '@/shared/ui/AppIcon'
import { Badge, IconButton } from '@/shared/ui/primitives'

/** Notification centre. Uses sample data until the notifications service (Phase 6). */
export function NotificationsMenu() {
  const [items, setItems] = useState(sampleNotifications)
  const unread = items.filter((n) => n.unread).length

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`} title="Notifications">
          <Bell className="size-5" aria-hidden />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full bg-bad text-[10px] font-semibold text-white ring-2 ring-surface">
              {unread}
            </span>
          )}
        </IconButton>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-50 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-lg border border-border bg-surface shadow-pop"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold">Notifications</h2>
              <Badge>Sample</Badge>
            </div>
            <button
              type="button"
              disabled={unread === 0}
              onClick={() => setItems((all) => all.map((n) => ({ ...n, unread: false })))}
              className="text-xs font-medium text-primary hover:underline disabled:text-muted disabled:no-underline"
            >
              Mark all as read
            </button>
          </div>
          <ul className="max-h-96 divide-y divide-border overflow-y-auto">
            {items.map((n) => {
              const app = getApp(n.appId)
              return (
                <li key={n.id} className={cn('flex gap-3 px-4 py-3', n.unread && 'bg-primary/[0.03]')}>
                  {app && <AppIcon icon={app.icon} accent={app.accent} size="sm" />}
                  <div className="min-w-0 flex-1">
                    <p className={cn('text-sm', n.unread ? 'font-medium' : 'text-muted')}>{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {app?.shortName} · {n.time}
                    </p>
                  </div>
                  {n.unread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                </li>
              )
            })}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
