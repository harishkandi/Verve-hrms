import { ChevronRight, LayoutGrid, type LucideIcon } from 'lucide-react'
import { Fragment } from 'react'
import { Link } from 'react-router'
import { appHref, getApp } from '@/core/apps/registry'
import { useSession } from '@/core/session/session'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Avatar } from '@/shared/ui/primitives'
import { timerParts, todayCheckIn, useCheckClock } from '@/apps/attendance/clock'
import { formatClock } from '@/shared/lib/date'

/** Left column of Home: who you are, the check-in clock, your manager and shortcuts. */
export function ProfileCard() {
  const { user } = useSession()

  const links: { label: string; to: string; icon: LucideIcon }[] = [
    ...(['leave', 'attendance', 'pms', 'reimbursement'] as const).flatMap((id) => {
      const app = getApp(id)
      if (!app) return []
      const label = { leave: 'My leave', attendance: 'My attendance', pms: 'My review', reimbursement: 'My claims' }[id]
      return [{ label, to: appHref(app), icon: app.icon }]
    }),
    { label: 'All apps', to: '/apps', icon: LayoutGrid },
  ]

  return (
    <Card className="overflow-hidden">
      <div
        aria-hidden
        className="h-24 border-b-2 border-brass"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, rgb(255 255 255 / 0.05) 0 1px, transparent 1px 14px), linear-gradient(120deg, var(--color-brand-deep), var(--color-navy))',
        }}
      />
      <div className="flex flex-col items-center px-5 pb-5 text-center">
        <Avatar initials={user.initials} size="xl" className="-mt-10 ring-4 ring-surface" />
        <h2 className="mt-3 font-serif text-xl font-semibold">{user.fullName}</h2>
        <p className="mt-0.5 text-sm text-muted">
          {user.employeeId} · {user.jobTitle}
        </p>
        <p className="text-xs text-subtle">
          {user.department} · {user.location}
        </p>
        <CheckClock />
      </div>

      <div className="border-t border-border px-5 py-4">
        <p className="eyebrow mb-2.5">Reporting to</p>
        <div className="flex items-center gap-3">
          <Avatar initials={user.manager.initials} tone="teal" size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user.manager.fullName}</p>
            <p className="truncate text-xs text-subtle">
              {user.manager.jobTitle} · {user.department}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-3 py-3">
        <p className="eyebrow mb-1 px-2">Quick links</p>
        <ul>
          {links.map(({ label, to, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex h-9 items-center gap-3 rounded-md px-2 text-sm font-medium transition-colors hover:bg-surface-2"
              >
                <Icon className="size-4 text-subtle" aria-hidden />
                <span className="flex-1">{label}</span>
                <ChevronRight className="size-3.5 text-subtle" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

const units = ['Hrs', 'Min', 'Sec']

/**
 * Today's clock. SAMPLE: shared with the Attendance app; the real check-in and
 * check-out API replaces it later.
 */
function CheckClock() {
  const { checkedIn, checkedOutAt, seconds, toggle } = useCheckClock()
  const parts = timerParts(seconds)

  return (
    <div className="mt-5 w-full rounded-lg border border-border-soft bg-surface-2 p-4">
      <p
        className={cn(
          'inline-flex items-center gap-2 text-xs font-semibold',
          checkedIn ? 'text-ok' : 'text-muted',
        )}
      >
        <span
          className={cn('size-1.5 rounded-full', checkedIn ? 'bg-ok ring-3 ring-ok-soft' : 'bg-subtle')}
          aria-hidden
        />
        {checkedIn ? 'Checked in' : `Checked out at ${checkedOutAt}`}
      </p>
      <div
        role="timer"
        aria-label={`Worked today: ${Number(parts[0])} hours ${Number(parts[1])} minutes`}
        className="mt-2.5 flex items-start justify-center gap-1.5"
      >
        {units.map((unit, i) => (
          <Fragment key={unit}>
            {i > 0 && (
              <span className="text-[22px] leading-tight text-subtle" aria-hidden>
                :
              </span>
            )}
            <span className="flex flex-col items-center" aria-hidden>
              <span className="text-[26px] leading-tight font-bold tracking-tight">{parts[i]}</span>
              <span className="eyebrow text-[9.5px]">{unit}</span>
            </span>
          </Fragment>
        ))}
      </div>
      <Button variant={checkedIn ? 'checkout' : 'primary'} className="mt-3.5 w-full" onClick={toggle}>
        {checkedIn ? 'Check out' : 'Check in'}
      </Button>
      <p className="mt-2.5 text-[11.5px] text-subtle">
        In at {formatClock(todayCheckIn.minutes)} · {todayCheckIn.source} · sample data
      </p>
    </div>
  )
}
