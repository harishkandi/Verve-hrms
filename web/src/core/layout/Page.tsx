import type { ReactNode } from 'react'
import { NavLink } from 'react-router'
import { cn } from '@/shared/lib/cn'

export interface PageTab {
  label: string
  to: string
  /** Match the URL exactly (for an index tab). */
  end?: boolean
}

/**
 * Standard page frame: a white tab row under the top bar (Overview, Dashboard…),
 * then the page content on the grey canvas.
 */
export function Page({
  tabs,
  leading,
  actions,
  width = 'wide',
  children,
}: {
  tabs?: PageTab[]
  /** Shown before the tabs, e.g. the app's name. */
  leading?: ReactNode
  /** Shown at the right end of the tab row. */
  actions?: ReactNode
  width?: 'wide' | 'narrow'
  children: ReactNode
}) {
  const hasBar = Boolean(tabs?.length || leading || actions)
  return (
    <>
      {hasBar && (
        <div className="border-b border-border bg-surface">
          <div className="no-scrollbar flex h-12 items-center gap-1 overflow-x-auto px-4 sm:px-6">
            {leading && (
              <div className="mr-3 flex shrink-0 items-center gap-2.5 border-r border-border pr-4">
                {leading}
              </div>
            )}
            {tabs?.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  cn(
                    'flex h-8 shrink-0 items-center rounded-md px-3.5 text-sm transition-colors',
                    isActive
                      ? 'bg-primary-soft font-semibold text-primary'
                      : 'font-medium text-muted hover:bg-surface-2 hover:text-fg',
                  )
                }
              >
                {tab.label}
              </NavLink>
            ))}
            {actions && <div className="ml-auto flex shrink-0 items-center gap-2 pl-3">{actions}</div>}
          </div>
        </div>
      )}
      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <div className={cn('mx-auto', width === 'wide' ? 'max-w-[1440px]' : 'max-w-5xl')}>
          {children}
        </div>
      </div>
    </>
  )
}

/** Serif page title with an optional line underneath. */
export function PageTitle({ title, lead, action }: { title: string; lead?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-serif text-[28px] leading-tight font-semibold tracking-[-0.01em] text-balance">
          {title}
        </h1>
        {lead && <div className="mt-1 text-sm text-muted">{lead}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
