import { ArrowRight, Check, Plus, Receipt } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useCurrentApp } from '@/core/apps/currentApp'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { ClaimTable, Empty, ErrorNote, SkeletonRows } from '../components/ui'
import { get, post } from '../lib/api'
import {
  STATUS_LABEL,
  day,
  daysUntil,
  dueDate,
  money,
  monthLabel,
  plural,
  thisPeriod,
} from '../lib/format'
import type { ClaimDetail, ClaimStatus, ClaimSummary, Policy } from '../lib/types'
import { useLoad } from '../lib/useLoad'

const WITH_APPROVERS: ClaimStatus[] = ['submitted', 'manager_approved']
const TO_BE_PAID: ClaimStatus[] = ['verified', 'in_payout_batch']

const sum = (cs: ClaimSummary[], key: 'total_claimed' | 'total_approved') =>
  cs.reduce((s, c) => s + Number(c[key]), 0)

const previousPeriod = (period: string) => {
  const [y, m] = period.split('-').map(Number)
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`
}

/** An employee's home: the claim that needs them, money in flight, and every monthly claim. */
export function OverviewPage() {
  const app = useCurrentApp()
  const navigate = useNavigate()
  const { data: claims, error } = useLoad(() => get<ClaimSummary[]>('/claims'))
  const { data: policy } = useLoad(() => get<Policy>('/policy'))
  const [period, setPeriod] = useState(thisPeriod())
  const [busy, setBusy] = useState<string | null>(null)
  const [openError, setOpenError] = useState<string | null>(null)

  async function open(p: string) {
    setBusy(p)
    setOpenError(null)
    try {
      // Returns the existing claim if this month already has one.
      const claim = await post<ClaimDetail>('/claims', { period: p })
      navigate(`/${app.id}/claims/${claim.id}`)
    } catch (e) {
      setOpenError((e as Error).message)
      setBusy(null)
    }
  }

  const list = claims ?? []
  const dueDay = policy?.submission_due_day ?? 5
  const year = thisPeriod().slice(0, 4)
  const withApprovers = list.filter((c) => WITH_APPROVERS.includes(c.status))
  const toBePaid = list.filter((c) => TO_BE_PAID.includes(c.status))
  const paid = list.filter((c) => c.status === 'paid' && c.paid_at?.startsWith(year))

  return (
    <div className="space-y-8">
      <ErrorNote error={error || openError} />

      {claims ? (
        <FocusCard claims={list} dueDay={dueDay} busy={busy} onOpen={open} />
      ) : (
        <div className="h-64 animate-pulse rounded-lg bg-surface-2" aria-hidden />
      )}

      <MoneyFlow
        loading={!claims}
        parts={[
          {
            label: 'With approvers',
            value: sum(withApprovers, 'total_claimed'),
            note: withApprovers.length
              ? `${plural(withApprovers.length, 'claim')} with your manager or Accounts`
              : 'Nothing awaiting approval',
            dot: 'bg-blue-500',
          },
          {
            label: 'Approved, to be paid',
            value: sum(toBePaid, 'total_approved'),
            note: toBePaid.length
              ? `${plural(toBePaid.length, 'claim')} in the next bank transfer`
              : 'Nothing awaiting payout',
            dot: 'bg-violet-500',
          },
          {
            label: `Paid in ${year}`,
            value: sum(paid, 'total_approved'),
            note: paid.length ? `Across ${plural(paid.length, 'claim')}` : 'No payouts yet this year',
            dot: 'bg-emerald-500',
          },
        ]}
      />

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">All claims</h2>
            <p className="mt-0.5 text-sm text-muted">
              One claim per month. Open one to see its expenses and history.
            </p>
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <input
              type="month"
              aria-label="Claim month"
              value={period}
              max={thisPeriod()}
              onChange={(e) => setPeriod(e.target.value)}
              className="h-10 min-w-0 flex-1 rounded-md border border-border bg-surface px-3 text-sm sm:w-44 sm:flex-none"
            />
            <Button
              variant="secondary"
              onClick={() => open(period)}
              loading={busy === period}
              disabled={!period || busy !== null}
            >
              Open month
            </Button>
          </div>
        </div>
        <Card className="overflow-hidden">
          {claims ? (
            <ClaimTable
              claims={list}
              cols={['month', 'items', 'status', 'updated', 'claimed', 'approved']}
              empty={
                <Empty
                  icon={Receipt}
                  title="No claims yet"
                  action={
                    <Button onClick={() => open(thisPeriod())} loading={busy === thisPeriod()}>
                      <Plus aria-hidden /> Start {monthLabel(thisPeriod())}
                    </Button>
                  }
                >
                  Add expenses with bills as they happen, then submit by the {dueDay}th of the next
                  month.
                </Empty>
              }
            />
          ) : (
            <SkeletonRows />
          )}
        </Card>
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ */

const STEPS = ['Draft', 'Manager', 'Accounts', 'Payout', 'Paid'] as const
const STEP_OF: Record<ClaimStatus, number> = {
  draft: 0,
  returned: 0,
  submitted: 1,
  manager_approved: 2,
  verified: 3,
  in_payout_batch: 3,
  paid: 4,
  rejected: -1,
}

/** Picks the one claim the employee should look at first. */
function pickFocus(claims: ClaimSummary[]) {
  const current = thisPeriod()
  const prev = previousPeriod(current)
  return (
    claims.find((c) => c.status === 'returned') ??
    claims.find((c) => c.period === prev && c.status === 'draft') ??
    claims.find((c) => c.period === current) ??
    null
  )
}

function FocusCard({
  claims,
  dueDay,
  busy,
  onOpen,
}: {
  claims: ClaimSummary[]
  dueDay: number
  busy: string | null
  onOpen: (period: string) => void
}) {
  const focus = pickFocus(claims)
  const period = focus?.period ?? thisPeriod()
  const status = focus?.status
  const editable = !focus || status === 'draft' || status === 'returned'
  const due = dueDate(period, dueDay)
  const left = daysUntil(due)
  const step = status ? STEP_OF[status] : 0

  const eyebrow = !focus
    ? `${monthLabel(period)} · not started`
    : status === 'returned'
      ? `${monthLabel(period)} · returned for changes`
      : `${monthLabel(period)} claim`

  const cta = !focus
    ? `Start ${monthLabel(period).split(' ')[0]} claim`
    : status === 'returned'
      ? 'Fix and resubmit'
      : status === 'draft'
        ? 'Continue claim'
        : 'View claim'

  const deadline = !editable
    ? `${STATUS_LABEL[status!]} · updated ${day(focus!.status_changed_at)}`
    : left > 1
      ? `Submit by ${day(due)} · ${left} days left`
      : left === 1
        ? `Submit by ${day(due)} · due tomorrow`
        : left === 0
          ? 'Due today'
          : `Was due ${day(due)} · submit as soon as you can`

  return (
    <section
      className="relative isolate overflow-hidden rounded-lg bg-navy text-white shadow-navy"
      aria-label="Current claim"
    >
      {/* Fine diagonal rule pattern, as on the Home profile card. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, rgb(255 255 255 / 0.04) 0 1px, transparent 1px 14px), linear-gradient(120deg, var(--color-brand-deep), var(--color-navy))',
        }}
      />

      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12 lg:p-10">
        <div className="min-w-0">
          <p
            className={cn(
              'text-[13px] font-semibold tracking-wide',
              status === 'returned' ? 'text-amber-300' : 'text-white/60',
            )}
          >
            {eyebrow}
          </p>
          <p className="mt-3 text-[40px] leading-none font-semibold tracking-[-0.04em] tabular-nums sm:text-[56px]">
            {money(focus?.total_claimed ?? 0)}
          </p>
          <p className="mt-3 text-sm text-white/60">
            {focus ? plural(focus.line_count, 'expense') : 'No expenses yet'}
            <span className="mx-2 text-white/25">/</span>
            <span className={cn(editable && left <= 3 && 'font-medium text-amber-300')}>
              {deadline}
            </span>
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => onOpen(period)}
              disabled={busy !== null}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-navy shadow-[0_8px_24px_-8px_rgb(0_0_0/0.5)] transition hover:bg-white/90 disabled:opacity-60"
            >
              {cta}
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        {status !== 'rejected' && <Steps current={step} />}
      </div>
    </section>
  )
}

/** Where the claim is in its journey. Vertical on desktop, horizontal on phones. */
function Steps({ current }: { current: number }) {
  return (
    <ol className="grid grid-cols-5 gap-1 lg:w-56 lg:grid-cols-1 lg:gap-0" aria-label="Claim progress">
      {STEPS.map((label, i) => {
        const done = i < current
        const here = i === current
        return (
          <li
            key={label}
            aria-current={here ? 'step' : undefined}
            className="relative flex flex-col items-center gap-2 text-center lg:flex-row lg:gap-3 lg:pb-5 lg:text-left lg:last:pb-0"
          >
            {i < STEPS.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  'absolute top-2.5 left-1/2 h-px w-full lg:top-5 lg:left-2.5 lg:h-[calc(100%-12px)] lg:w-px',
                  done ? 'bg-white/60' : 'bg-white/25',
                )}
              />
            )}
            <span
              className={cn(
                'relative grid size-5 shrink-0 place-items-center rounded-full',
                done && 'bg-white text-navy',
                here && 'bg-navy ring-2 ring-white',
                !done && !here && 'bg-navy ring-1 ring-white/25',
              )}
            >
              {done && <Check className="size-3" strokeWidth={3} aria-hidden />}
              {here && <span className="size-1.5 rounded-full bg-white" />}
            </span>
            <span
              className={cn(
                'text-[11px] sm:text-xs',
                here ? 'font-semibold text-white' : done ? 'text-white/70' : 'text-white/40',
              )}
            >
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

/* ------------------------------------------------------------------ */

type Part = { label: string; value: number; note: string; dot: string }

/** Money in flight, as one card with a proportional bar instead of separate stat tiles. */
function MoneyFlow({ parts, loading }: { parts: Part[]; loading: boolean }) {
  const total = parts.reduce((s, p) => s + p.value, 0)
  return (
    <Card className="p-6 sm:p-7">
      <div className="flex h-1.5 gap-1 overflow-hidden rounded-full bg-surface-2" aria-hidden>
        {!loading &&
          total > 0 &&
          parts.map(
            (p) =>
              p.value > 0 && (
                <span
                  key={p.label}
                  className={cn('h-full rounded-full', p.dot)}
                  style={{ flexGrow: p.value, flexBasis: 0, minWidth: 6 }}
                />
              ),
          )}
      </div>
      <dl className="mt-6 grid gap-5 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
        {parts.map((p, i) => (
          <div
            key={p.label}
            className={cn(
              'grid grid-cols-[1fr_auto] items-center gap-x-4 sm:block',
              i > 0 && 'sm:pl-7',
              i < parts.length - 1 && 'sm:pr-7',
            )}
          >
            <dt className="flex items-center gap-2 text-[13px] font-medium text-muted">
              <span className={cn('size-2 rounded-full', p.dot)} aria-hidden />
              {p.label}
            </dt>
            <dd className="row-span-2 text-xl leading-tight sm:mt-2 sm:text-[26px] font-semibold tracking-[-0.03em] tabular-nums">
              {loading ? (
                <span className="inline-block h-7 w-32 animate-pulse rounded-lg bg-surface-2 align-middle" />
              ) : (
                money(p.value)
              )}
            </dd>
            <dd className="mt-1 text-xs text-muted">{loading ? ' ' : p.note}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
