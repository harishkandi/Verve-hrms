import { Search } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router'
import { useCommandPalette } from '@/core/search/commandPalette'
import { cn } from '@/shared/lib/cn'
import { isPreview } from '@/shared/lib/env'
import { Kbd } from '@/shared/ui/primitives'
import { VerveLogo } from '@/shared/ui/VerveLogo'
import { NotificationsMenu } from './NotificationsMenu'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)

/** The three spaces, as in the design: your own work, your team, the company. */
const spaces = [
  { label: 'Team', to: '/team' },
  { label: 'Organization', to: '/organization' },
]

const tabClass = (active: boolean) =>
  cn(
    'relative flex h-full items-center text-[13.5px] font-semibold transition-colors',
    active
      ? 'text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-t after:bg-primary'
      : 'text-muted hover:text-fg',
  )

export function TopBar() {
  const { open } = useCommandPalette()
  const { pathname } = useLocation()
  const inMySpace = !spaces.some((s) => pathname.startsWith(s.to))

  return (
    <header className="sticky top-0 z-30 flex h-15 items-center gap-6 border-b border-border bg-surface px-4 sm:px-6">
      <Link to="/" aria-label="Verve HRMS home" className="shrink-0">
        <VerveLogo />
      </Link>
      {isPreview && (
        <span
          className="hidden shrink-0 items-center gap-1.5 rounded-full border border-brass/40 bg-brass/10 px-2.5 py-0.5 text-[11px] font-semibold text-brass sm:inline-flex"
          title="This is a preview with sample data. Nothing you do here is saved."
        >
          <span className="size-1.5 rounded-full bg-brass" aria-hidden />
          Preview · sample data
        </span>
      )}

      <nav aria-label="Spaces" className="hidden h-full gap-7 lg:flex">
        <Link to="/" className={tabClass(inMySpace)} aria-current={inMySpace ? 'page' : undefined}>
          My Space
        </Link>
        {spaces.map((s) => (
          <NavLink key={s.to} to={s.to} className={({ isActive }) => tabClass(isActive)}>
            {s.label}
          </NavLink>
        ))}
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={open}
          aria-label="Search"
          className="mr-2 flex h-9 items-center gap-2.5 rounded-md border border-border bg-surface-2 px-3 text-sm whitespace-nowrap text-subtle transition-colors hover:text-muted sm:w-72"
        >
          <Search className="size-4" aria-hidden />
          <span className="hidden flex-1 truncate text-left sm:inline">Search employee or action</span>
          <span className="hidden items-center gap-1 xl:flex">
            <Kbd>{isMac ? '⌘' : 'Ctrl'}</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>
        <ThemeToggle />
        <NotificationsMenu />
        <UserMenu />
      </div>
    </header>
  )
}
