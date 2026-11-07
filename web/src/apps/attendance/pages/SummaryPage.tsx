import { CheckCircle2, ChevronLeft, ChevronRight, PencilLine, X } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { useSearchParams } from 'react-router'
import { PageTitle } from '@/core/layout/Page'
import { useSession } from '@/core/session/session'
import { cn } from '@/shared/lib/cn'
import {
  addDays,
  formatClock,
  formatDate,
  formatDay,
  formatHours,
  fromIso,
  startOfWeek,
  todayIso,
} from '@/shared/lib/date'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { IconButton, StatusPill } from '@/shared/ui/primitives'
import {
  axis,
  type DayRecord,
  isLate,
  type Regularization,
  shift,
  useRegularizations,
  weekRecords,
} from '../attendanceData'
import { timerParts, todayCheckIn, useCheckClock } from '../clock'
import { RegularizePanel } from '../components/RegularizePanel'

const pct = (minutes: number) => ((minutes - axis.start) / (axis.end - axis.start)) * 100

/** Attendance › Summary: the week as a list, each day drawn as a bar over the shift. */
export function SummaryPage() {
  const { user } = useSession()
  const today = todayIso()
  const thisWeek = startOfWeek(today)
  const [weekStart, setWeekStart] = useState(thisWeek)
  const regularizations = useRegularizations()
  const clock = useCheckClock()
  const [params, setParams] = useSearchParams()
  const [notice, setNotice] = useState<string | null>(null)

  // `?regularize=1` opens the panel; `?regularize=2026-11-02` opens it on that day.
  const regularize = params.get('regularize')
  const setRegularize = (value: string | null) =>
    setParams(
      (p) => {
        const next = new URLSearchParams(p)
        if (value) next.set('regularize', value)
        else next.delete('regularize')
        return next
      },
      { replace: true },
    )

  const records = weekRecords(weekStart, today, regularizations)
  const liveMinutes = Math.floor(clock.seconds / 60)
  const isThisWeek = weekStart === thisWeek

  return (
    <>
      <PageTitle
        title="My attendance"
        lead={`${user.shift.name} · ${user.shift.hours} · sample data`}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="inline-flex h-9 items-center rounded-md border border-border bg-surface shadow-card">
          <button
            type="button"
            onClick={() => setWeekStart((w) => addDays(w, -7))}
            aria-label="Previous week"
            className="grid h-full w-9 place-items-center rounded-l-md border-r border-border text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <span className="px-3.5 text-sm font-semibold whitespace-nowrap tabular-nums" aria-live="polite">
            {formatDate(weekStart)} – {formatDate(addDays(weekStart, 6))}
          </span>
          <button
            type="button"
            onClick={() => setWeekStart((w) => addDays(w, 7))}
            disabled={isThisWeek}
            aria-label="Next week"
            className="grid h-full w-9 place-items-center rounded-r-md border-l border-border text-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
        {!isThisWeek && (
          <Button variant="ghost" size="sm" className="text-primary" onClick={() => setWeekStart(thisWeek)}>
            Back to this week
          </Button>
        )}

        <div className="ml-auto flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setRegularize('1')}>
            <PencilLine aria-hidden /> Regularize
          </Button>
          <Button variant={clock.checkedIn ? 'checkout' : 'primary'} onClick={clock.toggle} className="tabular-nums">
            {clock.checkedIn ? `Check out · ${timerParts(clock.seconds).join(':')}` : 'Check in'}
          </Button>
        </div>
      </div>

      <div role="status">
        {notice && (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-ok/25 bg-ok-soft px-4 py-3">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden />
            <p className="flex-1 text-sm">{notice}</p>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Dismiss"
              className="-m-1 rounded p-1 text-muted hover:text-fg"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        )}
      </div>

      <WeekStats records={records} liveMinutes={liveMinutes} />

      <Card className="overflow-hidden">
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="eyebrow w-20 px-5 py-2.5">Date</th>
                <th scope="col" className="eyebrow w-28 px-3 py-2.5">Check-in</th>
                <th scope="col" className="px-3 py-2.5">
                  <span className="sr-only">Timeline</span>
                  <HourScale />
                </th>
                <th scope="col" className="eyebrow w-32 px-3 py-2.5">Check-out</th>
                <th scope="col" className="eyebrow w-40 px-3 py-2.5">Hours</th>
                <th scope="col" className="w-14 pr-3">
                  <span className="sr-only">Regularize</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <DayRow
                  key={r.date}
                  record={r}
                  liveMinutes={liveMinutes}
                  checkedOutAt={clock.checkedOutAt}
                  correction={regularizations.find((x) => x.date === r.date)}
                  onRegularize={() => setRegularize(r.date)}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border px-5 py-3 text-xs text-muted">
          <Legend className="bg-ok">Worked</Legend>
          <Legend className="bg-primary">In progress</Legend>
          <Legend className="bg-border">Shift hours, {user.shift.hours}</Legend>
          <span className="sm:ml-auto">Grace period {shift.graceMinutes} min</span>
        </div>
      </Card>

      <RegularizePanel
        open={regularize !== null}
        onOpenChange={(open) => setRegularize(open ? '1' : null)}
        date={regularize && regularize !== '1' ? regularize : undefined}
        onDone={setNotice}
      />
    </>
  )
}

function WeekStats({ records, liveMinutes }: { records: DayRecord[]; liveMinutes: number }) {
  const workdays = records.filter((r) => r.kind !== 'weekend' && r.kind !== 'holiday').length
  const worked = records.reduce(
    (sum, r) => sum + (r.kind === 'present' ? r.checkOut - r.checkIn : r.kind === 'today' ? liveMinutes : 0),
    0,
  )
  const checkIns = records.flatMap((r) =>
    r.kind === 'present' ? [r.checkIn] : r.kind === 'today' ? [todayCheckIn.minutes] : [],
  )
  const average = checkIns.length ? Math.round(checkIns.reduce((a, b) => a + b, 0) / checkIns.length) : null
  const [avgTime, avgPeriod] = average === null ? ['–', ''] : formatClock(average).split(' ')

  const stats = [
    { label: 'Hours this week', value: formatHours(worked), suffix: `of ${formatHours(workdays * (shift.end - shift.start))}` },
    { label: 'Days present', value: String(checkIns.length), suffix: `of ${workdays}` },
    { label: 'Average check-in', value: avgTime, suffix: avgPeriod },
    { label: 'Late arrivals', value: String(checkIns.filter(isLate).length), suffix: '' },
    { label: 'Holidays', value: String(records.filter((r) => r.kind === 'holiday').length), suffix: '' },
  ]

  return (
    <Card className="mb-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-border-soft">
      {stats.map((s) => (
        <div key={s.label} className="px-5 py-4">
          <p className="eyebrow">{s.label}</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">
            {s.value} {s.suffix && <span className="text-xs font-medium text-subtle">{s.suffix}</span>}
          </p>
        </div>
      ))}
    </Card>
  )
}

const scale = [
  { at: 8, label: '8 AM' },
  { at: 10, label: '10' },
  { at: 12, label: '12 PM' },
  { at: 14, label: '2' },
  { at: 16, label: '4' },
  { at: 18, label: '6' },
  { at: 20, label: '8 PM' },
]

function HourScale() {
  return (
    <div className="relative h-4" aria-hidden>
      {scale.map((s, i) => (
        <span
          key={s.at}
          className={cn(
            'absolute top-0 text-[10.5px] font-medium whitespace-nowrap text-subtle',
            i === 0 ? '' : i === scale.length - 1 ? '-translate-x-full' : '-translate-x-1/2',
          )}
          style={{ left: `${pct(s.at * 60)}%` }}
        >
          {s.label}
        </span>
      ))}
    </div>
  )
}

function Time({ minutes, className }: { minutes: number; className?: string }) {
  const [time, period] = formatClock(minutes).split(' ')
  return (
    <span className={cn('tabular-nums', className)}>
      <span className="font-medium">{time}</span> <span className="text-[11px] text-subtle">{period}</span>
    </span>
  )
}

const dash = <span className="text-subtle">–</span>

function DayRow({
  record: r,
  liveMinutes,
  checkedOutAt,
  correction,
  onRegularize,
}: {
  record: DayRecord
  liveMinutes: number
  checkedOutAt: string | null
  correction?: Regularization
  onRegularize: () => void
}) {
  const isToday = r.kind === 'today'
  const date = fromIso(r.date)
  const checkIn = r.kind === 'present' ? r.checkIn : isToday ? todayCheckIn.minutes : null

  let checkOut = dash
  let hours = dash
  let status: ReactNode = null
  if (r.kind === 'present') {
    checkOut = <Time minutes={r.checkOut} />
    hours = <b className="font-semibold tabular-nums">{formatHours(r.checkOut - r.checkIn)}</b>
    status = isLate(r.checkIn) ? <span className="text-warn">Late arrival</span> : 'Present'
  } else if (isToday) {
    checkOut = checkedOutAt ? (
      <span className="font-medium tabular-nums">{checkedOutAt}</span>
    ) : (
      <span className="font-semibold text-primary">Now</span>
    )
    hours = <b className="font-semibold tabular-nums">{formatHours(liveMinutes)}</b>
    status = checkedOutAt ? 'Checked out' : <span className="text-primary">Checked in</span>
  } else if (r.kind === 'upcoming') {
    status = 'Upcoming'
  } else if (r.kind === 'holiday') {
    status = <span className="text-teal">Holiday</span>
  }

  if (correction?.status === 'pending') {
    status = (
      <span title={`Asked for ${formatClock(correction.checkIn)} – ${formatClock(correction.checkOut)}`}>
        <StatusPill tone="warn">Correction pending</StatusPill>
      </span>
    )
  } else if (correction?.status === 'approved') {
    status = <span className="text-ok">Corrected</span>
  }

  return (
    <tr className={cn('group border-t border-border-soft first:border-t-0', isToday && 'bg-primary-soft/50')}>
      <td className="px-5 py-2.5">
        <span className="block text-[11px] font-medium text-subtle">
          {date.toLocaleDateString('en-IN', { weekday: 'short' })}
        </span>
        <span className={cn('block text-base leading-tight font-semibold tabular-nums', isToday && 'text-primary')}>
          {String(date.getDate()).padStart(2, '0')}
        </span>
      </td>
      <td className="px-3 py-2.5">
        {checkIn === null ? dash : <Time minutes={checkIn} className={cn(isLate(checkIn) && '[&>span:first-child]:text-warn')} />}
      </td>
      <td className="px-3 py-2.5">
        <Track record={r} liveMinutes={liveMinutes} live={isToday && !checkedOutAt} />
      </td>
      <td className="px-3 py-2.5">{checkOut}</td>
      <td className="px-3 py-2.5">
        <span className="block">{hours}</span>
        <span className="block text-xs text-subtle">{status}</span>
      </td>
      <td className="pr-3">
        {r.kind === 'present' && !correction && (
          <IconButton
            onClick={onRegularize}
            aria-label={`Regularize ${formatDay(r.date)}`}
            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <PencilLine className="size-4" aria-hidden />
          </IconButton>
        )}
      </td>
    </tr>
  )
}

const hatch = {
  backgroundImage:
    'repeating-linear-gradient(135deg, var(--color-border-soft) 0 6px, transparent 6px 12px)',
}

function Track({ record: r, liveMinutes, live }: { record: DayRecord; liveMinutes: number; live: boolean }) {
  const base = 'relative h-7 overflow-hidden rounded-md'

  if (r.kind === 'weekend') {
    return (
      <div className={cn(base, 'grid place-items-center border border-border-soft')} style={hatch}>
        <span className="rounded bg-surface px-1.5 text-[11px] font-medium text-subtle">Weekend</span>
      </div>
    )
  }
  if (r.kind === 'holiday') {
    return (
      <div className={cn(base, 'grid place-items-center bg-teal-soft')}>
        <span className="text-[11px] font-semibold text-teal">{r.name}</span>
      </div>
    )
  }
  if (r.kind === 'upcoming') {
    return <div className={cn(base, 'border border-dashed border-border')} aria-hidden />
  }

  const start = r.kind === 'present' ? r.checkIn : todayCheckIn.minutes
  const end = r.kind === 'present' ? r.checkOut : Math.min(axis.end, todayCheckIn.minutes + liveMinutes)
  const label =
    r.kind === 'present'
      ? `Worked ${formatClock(start)} to ${formatClock(end)}`
      : `Checked in at ${formatClock(start)}, ${formatHours(liveMinutes)} so far`

  return (
    <div className={cn(base, 'bg-surface-2')} role="img" aria-label={label}>
      {scale.slice(1, -1).map((s) => (
        <span key={s.at} className="absolute inset-y-0 w-px bg-border-soft" style={{ left: `${pct(s.at * 60)}%` }} />
      ))}
      <span
        className="absolute inset-y-1 rounded-sm bg-border/70"
        style={{ left: `${pct(shift.start)}%`, width: `${pct(shift.end) - pct(shift.start)}%` }}
      />
      <span
        className={cn('absolute inset-y-2 rounded-sm', live ? 'bg-primary' : 'bg-ok')}
        style={{ left: `${pct(start)}%`, width: `${Math.max(0.5, pct(end) - pct(start))}%` }}
      >
        {live && (
          <span className="absolute top-1/2 -right-1 size-2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-surface motion-safe:animate-pulse" />
        )}
      </span>
    </div>
  )
}

function Legend({ className, children }: { className: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn('h-2 w-3.5 rounded-xs', className)} aria-hidden />
      {children}
    </span>
  )
}

