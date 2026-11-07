import { House, LayoutGrid, type LucideIcon } from 'lucide-react'
import { type CSSProperties, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { useAppPrefs } from '@/core/apps/appPrefs'
import { appHref, apps } from '@/core/apps/registry'
import type { AppManifest } from '@/core/apps/types'
import { cn } from '@/shared/lib/cn'
import { VerveMonogram } from '@/shared/ui/VerveLogo'
import { railBadges, railColor, railGroups } from './rail'
import { RailIcon } from './RailIcon'

/**
 * Navy module bar on the left (desktop). Home, then pinned apps, then the
 * rest in category order. Each app has its
 * own colour; the open one glows, and its icon plays a short animation when
 * clicked.
 */
export function Sidebar() {
  const { pinned } = useAppPrefs()
  // Which item to animate. `n` changes on every click so the animation replays.
  const [play, setPlay] = useState<{ id: string; n: number }>({ id: '', n: 0 })

  const pinnedApps = pinned.map((id) => apps.find((app) => app.id === id)).filter((app) => app !== undefined)
  const rest = apps.filter((app) => !pinned.includes(app.id))
  const sections = [
    pinnedApps,
    ...railGroups.map((categories) => rest.filter((app) => categories.includes(app.category))),
    // Anything with a category no group lists still gets shown.
    rest.filter((app) => !railGroups.flat().includes(app.category)),
  ].filter((section) => section.length > 0)

  const itemProps = (id: string) => ({
    id,
    play: play.id === id ? play.n : 0,
    onPlay: () => setPlay((p) => ({ id, n: p.n + 1 })),
  })

  return (
    <aside className="sticky top-0 z-40 hidden h-svh w-[88px] shrink-0 flex-col items-center bg-navy py-3 shadow-navy md:flex">
      <Link to="/" aria-label="Verve HRMS home" className="mb-3 rounded-lg">
        <VerveMonogram />
      </Link>

      <nav
        aria-label="Modules"
        className="no-scrollbar flex w-full flex-1 flex-col items-center gap-1.5 overflow-y-auto pb-2"
      >
        <Item {...itemProps('home')} to="/" end icon={House} label="Home" />
        {sections.flat().map((app) => (
          <AppItem key={app.id} app={app} {...itemProps(app.id)} />
        ))}
      </nav>

      <div className="flex w-full flex-col items-center pt-2">
        <Item {...itemProps('apps')} to="/apps" icon={LayoutGrid} label="All apps" />
      </div>
    </aside>
  )
}

interface PlayProps {
  id: string
  play: number
  onPlay: () => void
}

function AppItem({ app, ...props }: PlayProps & { app: AppManifest }) {
  return (
    <Item
      {...props}
      to={appHref(app)}
      icon={app.icon}
      label={app.shortName}
      color={railColor(app.id, app.accent)}
    />
  )
}

function Item({
  id,
  play,
  onPlay,
  to,
  end,
  icon,
  label,
  color = railColor(id),
}: PlayProps & { to: string; end?: boolean; icon: LucideIcon; label: string; color?: string }) {
  const badge = railBadges[id]
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onPlay}
      style={{ '--rail-c': color } as CSSProperties}
      className={({ isActive }) => cn('rail-item', isActive && 'is-active')}
    >
      {play > 0 && <span key={play} className="rail-shine" aria-hidden />}
      <span className="relative">
        <RailIcon key={play} id={id} fallback={icon} playing={play > 0} />
        {badge && (
          <span className="rail-badge" aria-hidden>
            {badge.count}
          </span>
        )}
      </span>
      <span className="rail-label">{label}</span>
      {badge && <span className="sr-only">, {badge.label}</span>}
    </NavLink>
  )
}
