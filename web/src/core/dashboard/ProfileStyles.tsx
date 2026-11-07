/**
 * TEMPORARY: four profile-card styles shown side by side on /profile-styles so one
 * can be picked for Home. Delete this file once a style is chosen.
 */
import { ChevronRight, LayoutGrid, type LucideIcon } from 'lucide-react'
import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router'
import { timerParts, todayCheckIn, useCheckClock } from '@/apps/attendance/clock'
import { appHref, getApp } from '@/core/apps/registry'
import { useSession } from '@/core/session/session'
import { cn } from '@/shared/lib/cn'
import { formatClock } from '@/shared/lib/date'
import { type Accent, accents } from '@/shared/ui/accent'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Avatar } from '@/shared/ui/primitives'

const WORKDAY_SECONDS = 9 * 3600

function useLinks() {
  const links: { label: string; to: string; icon: LucideIcon; accent?: Accent }[] = [
    ...(['leave', 'attendance', 'pms', 'reimbursement'] as const).flatMap((id) => {
      const app = getApp(id)
      if (!app) return []
      const label = { leave: 'My leave', attendance: 'My attendance', pms: 'My review', reimbursement: 'My claims' }[id]
      return [{ label, to: appHref(app), icon: app.icon, accent: app.accent }]
    }),
    { label: 'All apps', to: '/apps', icon: LayoutGrid },
  ]
  return links
}

function hoursWorked(seconds: number) {
  return `${Math.floor(seconds / 3600)}h ${Math.floor(seconds / 60) % 60}m`
}

/* ------------------------------------------------------------------ */
/* 1. Original                                                          */
/* ------------------------------------------------------------------ */

export function OriginalProfile() {
  const { user } = useSession()
  const { checkedIn, checkedOutAt, seconds, toggle } = useCheckClock()
  const parts = timerParts(seconds)
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
        <div className="mt-5 w-full rounded-lg border border-border-soft bg-surface-2 p-4">
          <p className={cn('inline-flex items-center gap-2 text-xs font-semibold', checkedIn ? 'text-ok' : 'text-muted')}>
            <span className={cn('size-1.5 rounded-full', checkedIn ? 'bg-ok ring-3 ring-ok-soft' : 'bg-subtle')} />
            {checkedIn ? 'Checked in' : `Checked out at ${checkedOutAt}`}
          </p>
          <div className="mt-2.5 flex items-start justify-center gap-1.5">
            {['Hrs', 'Min', 'Sec'].map((unit, i) => (
              <Fragment key={unit}>
                {i > 0 && <span className="text-[22px] leading-tight text-subtle">:</span>}
                <span className="flex flex-col items-center">
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
      </div>
      <LightFooter />
    </Card>
  )
}

function LightFooter({ colorIcons = false }: { colorIcons?: boolean }) {
  const { user } = useSession()
  const links = useLinks()
  return (
    <>
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
          {links.map(({ label, to, icon: Icon, accent }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex h-9 items-center gap-3 rounded-md px-2 text-sm font-medium transition-colors hover:bg-surface-2"
              >
                {colorIcons && accent ? (
                  <span className={cn('grid size-6 place-items-center rounded-md text-white', accents[accent].tile)}>
                    <Icon className="size-3.5" aria-hidden />
                  </span>
                ) : (
                  <Icon className="size-4 text-subtle" aria-hidden />
                )}
                <span className="flex-1">{label}</span>
                <ChevronRight className="size-3.5 text-subtle" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Midnight: fully dark, glowing                                     */
/* ------------------------------------------------------------------ */

export function MidnightProfile() {
  const { user } = useSession()
  const links = useLinks()
  const { checkedIn, checkedOutAt, seconds, toggle } = useCheckClock()
  const parts = timerParts(seconds)
  const progress = Math.min(1, seconds / WORKDAY_SECONDS)

  return (
    <div className="relative isolate overflow-hidden rounded-2xl bg-[#0a0f1f] text-white shadow-pop ring-1 ring-white/10">
      <div aria-hidden className="absolute -top-20 -left-16 -z-10 size-56 rounded-full bg-blue-600/35 blur-3xl" />
      <div aria-hidden className="absolute -top-12 -right-20 -z-10 size-52 rounded-full bg-violet-600/35 blur-3xl" />
      <div aria-hidden className="absolute top-72 -left-10 -z-10 size-40 rounded-full bg-cyan-500/15 blur-3xl" />

      <div className="flex flex-col items-center px-5 pt-7 pb-5 text-center">
        <span className="relative">
          <span className="grid size-20 place-items-center rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 text-[26px] font-bold shadow-lg ring-1 shadow-violet-600/40 ring-white/25">
            {user.initials}
          </span>
          {checkedIn && (
            <span className="absolute -right-1 -bottom-1 size-4 rounded-full bg-emerald-400 ring-[3px] ring-[#0a0f1f]" />
          )}
        </span>
        <h2 className="mt-4 text-xl font-semibold tracking-tight">{user.fullName}</h2>
        <p className="mt-0.5 text-sm text-white/60">{user.jobTitle}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-1.5 text-[11px] font-medium text-white/75">
          {[user.employeeId, user.department, user.location].map((t) => (
            <span key={t} className="rounded-full bg-white/5 px-2.5 py-0.5 ring-1 ring-white/10 ring-inset">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5 w-full rounded-xl bg-white/[0.04] p-4 ring-1 ring-white/10 backdrop-blur-sm ring-inset">
          <div className="flex items-center justify-between text-[11.5px] font-semibold">
            <span className={cn('inline-flex items-center gap-1.5', checkedIn ? 'text-emerald-300' : 'text-white/50')}>
              <span className="relative flex size-2">
                {checkedIn && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />}
                <span className={cn('relative size-2 rounded-full', checkedIn ? 'bg-emerald-400' : 'bg-white/40')} />
              </span>
              {checkedIn ? 'Live' : `Out ${checkedOutAt}`}
            </span>
            <span className="text-white/45">In {formatClock(todayCheckIn.minutes)}</span>
          </div>
          <p className="mt-3 bg-linear-to-b from-white to-cyan-200 bg-clip-text text-[40px] leading-none font-bold tracking-tight text-transparent tabular-nums drop-shadow-[0_0_18px_rgb(34_211_238_/_0.35)]">
            {parts[0]}:{parts[1]}
            <span className="text-2xl text-white/40">:{parts[2]}</span>
          </p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-linear-to-r from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_12px_rgb(99_102_241_/_0.8)]"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <p className="mt-1.5 flex justify-between text-[10.5px] text-white/45">
            <span>{hoursWorked(seconds)} worked</span>
            <span>9h shift</span>
          </p>
          <button
            type="button"
            onClick={toggle}
            className={cn(
              'mt-4 h-10 w-full rounded-lg text-sm font-semibold text-white shadow-lg transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none',
              checkedIn
                ? 'bg-linear-to-r from-rose-500 to-pink-600 shadow-rose-600/30'
                : 'bg-linear-to-r from-cyan-500 to-blue-600 shadow-blue-600/30',
            )}
          >
            {checkedIn ? 'Check out' : 'Check in'}
          </button>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-4">
        <p className="mb-2.5 text-[11px] font-semibold tracking-[0.08em] text-white/40 uppercase">Reporting to</p>
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-full bg-teal-400/15 text-xs font-semibold text-teal-300 ring-1 ring-teal-300/20">
            {user.manager.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user.manager.fullName}</p>
            <p className="truncate text-xs text-white/45">{user.manager.jobTitle}</p>
          </div>
        </div>
      </div>
      <ul className="border-t border-white/10 px-3 py-3">
        {links.map(({ label, to, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className="flex h-9 items-center gap-3 rounded-md px-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Icon className="size-4 text-white/45" aria-hidden />
              <span className="flex-1">{label}</span>
              <ChevronRight className="size-3.5 text-white/30" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 3. Aurora: colorful banner, ring clock                               */
/* ------------------------------------------------------------------ */

export function AuroraProfile() {
  const { user } = useSession()
  const { checkedIn, checkedOutAt, seconds, toggle } = useCheckClock()
  const parts = timerParts(seconds)
  const progress = Math.min(1, seconds / WORKDAY_SECONDS)
  const r = 58
  const c = 2 * Math.PI * r

  return (
    <Card className="overflow-hidden rounded-2xl">
      <div
        aria-hidden
        className="h-28"
        style={{
          backgroundImage:
            'radial-gradient(at 0% 0%, #6366f1 0, transparent 55%), radial-gradient(at 100% 0%, #ec4899 0, transparent 55%), radial-gradient(at 50% 100%, #06b6d4 0, transparent 60%), linear-gradient(135deg, #4f46e5, #a855f7)',
        }}
      />
      <div className="flex flex-col items-center px-5 pb-5 text-center">
        <span className="-mt-11 rounded-full bg-linear-to-br from-indigo-500 via-fuchsia-500 to-amber-400 p-1 shadow-lg shadow-fuchsia-500/25">
          <span className="grid size-20 place-items-center rounded-full bg-surface">
            <span className="bg-linear-to-br from-indigo-600 to-fuchsia-600 bg-clip-text text-[26px] font-bold text-transparent">
              {user.initials}
            </span>
          </span>
        </span>
        <h2 className="mt-3 text-xl font-bold tracking-tight">{user.fullName}</h2>
        <p className="mt-0.5 text-sm text-muted">
          {user.jobTitle} · {user.employeeId}
        </p>
        <p className="text-xs text-subtle">
          {user.department} · {user.location}
        </p>

        <div className="relative mt-5 grid size-36 place-items-center">
          <svg viewBox="0 0 140 140" className="absolute inset-0 -rotate-90" aria-hidden>
            <defs>
              <linearGradient id="aurora-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="55%" stopColor="#d946ef" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <circle cx="70" cy="70" r={r} fill="none" stroke="currentColor" strokeWidth="9" className="text-border-soft" />
            <circle
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke="url(#aurora-ring)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - progress)}
            />
          </svg>
          <span className="flex flex-col items-center">
            <span className="text-[26px] leading-none font-bold tracking-tight tabular-nums">
              {parts[0]}:{parts[1]}
            </span>
            <span className="mt-1 text-xs font-semibold text-subtle tabular-nums">{parts[2]} sec</span>
            <span
              className={cn(
                'mt-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold',
                checkedIn ? 'bg-ok-soft text-ok' : 'bg-surface-2 text-muted',
              )}
            >
              {checkedIn ? 'Checked in' : `Out ${checkedOutAt}`}
            </span>
          </span>
        </div>
        <button
          type="button"
          onClick={toggle}
          className={cn(
            'mt-4 h-10 w-full rounded-full text-sm font-semibold text-white shadow-lg transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:outline-none',
            checkedIn
              ? 'bg-linear-to-r from-rose-500 to-orange-400 shadow-rose-500/25'
              : 'bg-linear-to-r from-indigo-500 to-fuchsia-500 shadow-fuchsia-500/25',
          )}
        >
          {checkedIn ? 'Check out' : 'Check in'}
        </button>
        <p className="mt-2.5 text-[11.5px] text-subtle">
          In at {formatClock(todayCheckIn.minutes)} · {hoursWorked(seconds)} of 9h
        </p>
      </div>
      <LightFooter colorIcons />
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* 4. Minimal: calm, left aligned                                       */
/* ------------------------------------------------------------------ */

export function MinimalProfile() {
  const { user } = useSession()
  const { checkedIn, checkedOutAt, seconds, toggle } = useCheckClock()
  const parts = timerParts(seconds)
  const progress = Math.min(1, seconds / WORKDAY_SECONDS)

  return (
    <Card className="overflow-hidden rounded-2xl">
      <div className="flex items-center gap-3.5 px-5 pt-5">
        <span className="relative grid size-14 shrink-0 place-items-center rounded-xl bg-primary-soft text-lg font-semibold text-primary">
          {user.initials}
          {checkedIn && <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full bg-ok ring-2 ring-surface" />}
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-[17px] font-semibold tracking-tight">{user.fullName}</h2>
          <p className="truncate text-[13px] text-muted">{user.jobTitle}</p>
          <p className="truncate text-xs text-subtle">
            {user.employeeId} · {user.location}
          </p>
        </div>
      </div>

      <div className="px-5 pt-6 pb-5">
        <p className="eyebrow">Today</p>
        <p className="mt-1 flex items-baseline gap-1 tabular-nums">
          <span className="text-5xl leading-none font-light tracking-tighter">
            {parts[0]}:{parts[1]}
          </span>
          <span className="text-lg font-light text-subtle">{parts[2]}</span>
        </p>
        <div className="mt-4 h-0.5 rounded-full bg-border-soft">
          <div className="h-full rounded-full bg-fg" style={{ width: `${progress * 100}%` }} />
        </div>
        <p className="mt-2 flex justify-between text-xs text-subtle">
          <span className="inline-flex items-center gap-1.5">
            <span className={cn('size-1.5 rounded-full', checkedIn ? 'bg-ok' : 'bg-subtle')} />
            {checkedIn ? `In since ${formatClock(todayCheckIn.minutes)}` : `Out at ${checkedOutAt}`}
          </span>
          <span>9h shift</span>
        </p>
        <button
          type="button"
          onClick={toggle}
          className={cn(
            'mt-4 h-10 w-full rounded-lg text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
            checkedIn
              ? 'border border-border text-fg hover:border-bad hover:text-bad'
              : 'bg-fg text-surface hover:opacity-90',
          )}
        >
          {checkedIn ? 'Check out' : 'Check in'}
        </button>
      </div>
      <LightFooter />
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Preview page                                                         */
/* ------------------------------------------------------------------ */

const styles: { n: number; name: string; note: string; card: ReactNode }[] = [
  { n: 1, name: 'Original', note: 'How it looked before today', card: <OriginalProfile /> },
  { n: 2, name: 'Midnight', note: 'Fully dark, glowing timer and progress bar', card: <MidnightProfile /> },
  { n: 3, name: 'Aurora', note: 'Colourful banner, ring clock', card: <AuroraProfile /> },
  { n: 4, name: 'Minimal', note: 'Calm, no banner, big thin digits', card: <MinimalProfile /> },
]

export function ProfileStylesPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Profile card styles</h1>
      <p className="mt-1 text-sm text-muted">Pick a number. All four share the same live clock.</p>
      <div className="mt-6 grid items-start gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {styles.map((s) => (
          <section key={s.n} className="w-full max-w-[300px] justify-self-center">
            <p className="mb-3 flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-primary text-sm font-bold text-primary-fg">
                {s.n}
              </span>
              <span className="font-semibold">{s.name}</span>
            </p>
            <p className="-mt-2 mb-3 text-xs text-subtle">{s.note}</p>
            {s.card}
          </section>
        ))}
      </div>
    </div>
  )
}
