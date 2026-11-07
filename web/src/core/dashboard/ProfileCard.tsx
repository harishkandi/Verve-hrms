import { ChevronRight, LayoutGrid, type LucideIcon } from 'lucide-react'
import { Fragment } from 'react'
import { Link } from 'react-router'
import { appHref, getApp } from '@/core/apps/registry'
import { useSession } from '@/core/session/session'
import { cn } from '@/shared/lib/cn'
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
      <div aria-hidden className="relative h-28">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(120% 90% at 85% 0%, rgb(255 255 255 / 0.16), transparent 55%), repeating-linear-gradient(135deg, rgb(255 255 255 / 0.045) 0 1px, transparent 1px 16px), linear-gradient(125deg, var(--color-brand) 0%, var(--color-brand-deep) 45%, var(--color-navy) 100%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-0.75 bg-linear-to-r from-transparent via-brass to-transparent" />
      </div>
      <div className="flex flex-col items-center px-5 pb-5 text-center">
        <ProfilePhoto initials={user.initials} />
        <h2 className="mt-3 font-serif text-[22px] leading-tight font-semibold tracking-[-0.01em]">
          {user.fullName}
        </h2>
        <p className="mt-1 text-sm text-muted">{user.jobTitle}</p>
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 text-[11.5px] font-medium">
          <span className="rounded-full border border-brass/40 bg-brass/10 px-2.5 py-0.5 text-[#8a6a3a] dark:text-brass">
            {user.employeeId}
          </span>
          <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-muted ring-1 ring-border ring-inset">
            {user.department} · {user.location}
          </span>
        </div>
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

/** Initials inside a brass ring, with a presence dot while checked in. */
function ProfilePhoto({ initials }: { initials: string }) {
  const { checkedIn } = useCheckClock()
  return (
    <span className="relative -mt-12 rounded-full bg-linear-to-br from-[#e6cc98] via-brass to-[#6f532c] p-0.75 shadow-pop">
      <span className="grid size-21 place-items-center rounded-full bg-linear-to-br from-[#eef2fa] to-[#d9e2f3] font-serif text-[28px] font-semibold text-brand-deep ring-4 ring-surface dark:from-[#22305a] dark:to-[#152040] dark:text-[#c9d6f2]">
        {initials}
      </span>
      {checkedIn && (
        <span
          aria-hidden
          className="absolute right-1.5 bottom-1.5 size-4 rounded-full bg-ok ring-[3px] ring-surface"
        />
      )}
    </span>
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
    <div
      className="relative mt-5 w-full overflow-hidden rounded-xl p-4 text-white shadow-pop ring-1 ring-white/10"
      style={{
        backgroundImage:
          'radial-gradient(100% 70% at 50% 0%, rgb(255 255 255 / 0.10), transparent 60%), linear-gradient(160deg, var(--color-brand-deep), var(--color-navy))',
      }}
    >
      <p
        className={cn(
          'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ring-1 ring-inset',
          checkedIn ? 'bg-emerald-400/10 text-emerald-300 ring-emerald-300/25' : 'bg-white/5 text-white/70 ring-white/15',
        )}
      >
        <span className="relative flex size-2" aria-hidden>
          {checkedIn && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />}
          <span className={cn('relative size-2 rounded-full', checkedIn ? 'bg-emerald-400' : 'bg-white/40')} />
        </span>
        {checkedIn ? 'Checked in' : `Checked out at ${checkedOutAt}`}
      </p>
      <div
        role="timer"
        aria-label={`Worked today: ${Number(parts[0])} hours ${Number(parts[1])} minutes`}
        className="mt-3.5 flex items-start justify-center gap-1.5"
      >
        {units.map((unit, i) => (
          <Fragment key={unit}>
            {i > 0 && (
              <span className="pt-1.5 text-xl leading-tight font-semibold text-white/35" aria-hidden>
                :
              </span>
            )}
            <span className="flex flex-col items-center gap-1.5" aria-hidden>
              <span className="grid h-12 w-14 place-items-center rounded-lg bg-white/[0.07] text-[26px] font-bold tracking-tight tabular-nums ring-1 ring-white/10 ring-inset">
                {parts[i]}
              </span>
              <span className="text-[9.5px] font-semibold tracking-[0.14em] text-brass uppercase">{unit}</span>
            </span>
          </Fragment>
        ))}
      </div>
      <button
        type="button"
        onClick={toggle}
        className={cn(
          'mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none',
          checkedIn
            ? 'bg-white/10 text-white ring-1 ring-white/20 ring-inset hover:bg-rose-500/90 hover:ring-rose-400'
            : 'bg-linear-to-r from-[#d9bb84] to-brass text-navy shadow-lg shadow-black/20 hover:brightness-105',
        )}
      >
        {checkedIn ? 'Check out' : 'Check in'}
      </button>
      <p className="mt-2.5 text-[11.5px] text-white/50">
        In at {formatClock(todayCheckIn.minutes)} · {todayCheckIn.source} · sample data
      </p>
    </div>
  )
}
