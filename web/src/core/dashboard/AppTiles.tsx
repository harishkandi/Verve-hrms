import { Link } from 'react-router'
import { PinButton } from '@/core/apps/PinButton'
import { appHref, apps } from '@/core/apps/registry'
import { AppIcon } from '@/shared/ui/AppIcon'
import { appStatus } from './sampleData'

/** The launcher: every app the user can open, with a live one-line status. */
export function AppTiles() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-6">
      {apps.map((app) => (
        <li key={app.id} className="relative">
          <Link
            to={appHref(app)}
            className="flex h-full flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-card transition hover:border-primary/30 hover:shadow-lift"
          >
            <AppIcon icon={app.icon} accent={app.accent} size="md" />
            <span>
              <span className="block text-sm font-semibold">{app.name}</span>
              <span className="mt-0.5 block text-xs text-muted">{appStatus[app.id] ?? app.tagline}</span>
            </span>
          </Link>
          <PinButton app={app} className="absolute top-3 right-3" />
        </li>
      ))}
    </ul>
  )
}
