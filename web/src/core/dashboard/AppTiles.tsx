import { Link } from 'react-router'
import { PinButton } from '@/core/apps/PinButton'
import { appHref, apps } from '@/core/apps/registry'
import { cn } from '@/shared/lib/cn'
import { accents } from '@/shared/ui/accent'
import { AppIcon } from '@/shared/ui/AppIcon'
import { appStatus } from './sampleData'

/** The launcher: every app the user can open, each in its own color, with a one-line status. */
export function AppTiles() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-7">
      {apps.map((app) => {
        const accent = accents[app.accent]
        return (
          <li key={app.id} className="relative">
            <Link
              to={appHref(app)}
              className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-xl border border-border bg-surface p-4 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span aria-hidden className={cn('pointer-events-none absolute inset-x-0 top-0 h-20', accent.wash)} />
              <span
                aria-hidden
                className={cn(
                  'absolute inset-x-0 bottom-0 h-0.5 opacity-60 transition-opacity group-hover:opacity-100',
                  accent.bar,
                )}
              />
              <AppIcon
                icon={app.icon}
                accent={app.accent}
                size="lg"
                className="relative transition-transform duration-200 group-hover:scale-105"
              />
              <span className="relative">
                <span className="block text-sm font-semibold">{app.name}</span>
                <span className="mt-0.5 block text-xs text-muted">{appStatus[app.id] ?? app.tagline}</span>
              </span>
            </Link>
            <PinButton app={app} className="absolute top-3 right-3" />
          </li>
        )
      })}
    </ul>
  )
}
