import { ArrowRight, Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { PinButton } from '@/core/apps/PinButton'
import { appHref, apps } from '@/core/apps/registry'
import type { AppCategory } from '@/core/apps/types'
import { Page, PageTitle } from '@/core/layout/Page'
import { mySpaceTabs } from '@/core/layout/spaces'
import { cn } from '@/shared/lib/cn'
import { AppIcon } from '@/shared/ui/AppIcon'
import { Badge } from '@/shared/ui/primitives'

type Filter = AppCategory | 'All'

/** App directory: browse, search and pin every Verve app. */
export function AppsPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('All')

  const categories: Filter[] = ['All', ...new Set(apps.map((app) => app.category))]
  const q = query.trim().toLowerCase()
  const visible = apps.filter(
    (app) =>
      (filter === 'All' || app.category === filter) &&
      (!q || `${app.name} ${app.tagline} ${app.description}`.toLowerCase().includes(q)),
  )

  return (
    <Page tabs={mySpaceTabs}>
      <PageTitle title="All apps" lead="Every Verve tool, one sign-in." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative w-full sm:max-w-xs">
          <span className="sr-only">Filter apps</span>
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter apps…"
            className="h-9 w-full rounded-md border border-border bg-surface pr-3 pl-9 text-sm outline-none placeholder:text-subtle focus:border-primary focus:ring-3 focus:ring-primary-soft"
          />
        </label>
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto" role="group" aria-label="Category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
              className={cn(
                'h-8 shrink-0 rounded-full px-3.5 text-sm font-medium transition',
                filter === c
                  ? 'bg-primary-soft font-semibold text-primary'
                  : 'border border-border bg-surface text-muted hover:text-fg',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-16 text-center text-muted">No apps match “{query}”.</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((app) => (
            <li
              key={app.id}
              className="group relative flex flex-col rounded-lg border border-border bg-surface p-5 shadow-card transition hover:border-primary/30 hover:shadow-lift"
            >
              <div className="flex items-start gap-4">
                <AppIcon icon={app.icon} accent={app.accent} size="lg" />
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold">
                    <Link to={appHref(app)} className="after:absolute after:inset-0">
                      {app.name}
                    </Link>
                  </h2>
                  <Badge className="mt-1.5">{app.category}</Badge>
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">{app.description}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open app
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
              </span>
              <PinButton app={app} className="absolute top-4 right-4 z-10" />
            </li>
          ))}
        </ul>
      )}
    </Page>
  )
}
