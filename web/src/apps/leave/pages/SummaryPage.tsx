import { CheckCircle2, Plus, X } from 'lucide-react'
import { Fragment, useState } from 'react'
import { useSearchParams } from 'react-router'
import { holidays } from '@/core/dashboard/sampleData'
import { PageTitle } from '@/core/layout/Page'
import { cn } from '@/shared/lib/cn'
import { formatDayRange, type IsoDate, todayIso } from '@/shared/lib/date'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Progress, StatusPill } from '@/shared/ui/primitives'
import { ApplyLeavePanel } from '../components/ApplyLeavePanel'
import {
  type LeaveBalance,
  leaveTypes,
  toneClasses,
  useLeaveBalances,
  useLeaveRequests,
  withdrawLeave,
} from '../leaveStore'

/** Leave › Leave summary: balance by type, then every request and upcoming holiday. */
export function SummaryPage() {
  const balances = useLeaveBalances()
  const [params, setParams] = useSearchParams()
  const [notice, setNotice] = useState<string | null>(null)
  const applyOpen = params.get('apply') === '1'

  const setApplyOpen = (open: boolean) =>
    setParams(
      (p) => {
        const next = new URLSearchParams(p)
        if (open) next.set('apply', '1')
        else next.delete('apply')
        return next
      },
      { replace: true },
    )

  return (
    <>
      <PageTitle
        title="Leave summary"
        lead={`January – December ${todayIso().slice(0, 4)} · sample data`}
        action={
          <Button
            onClick={() => {
              setNotice(null)
              setApplyOpen(true)
            }}
          >
            <Plus aria-hidden /> Apply leave
          </Button>
        }
      />

      <div role="status">
        {notice && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-ok/25 bg-ok-soft px-4 py-3">
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

      <ul className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {balances.map((b) => (
          <BalanceCard key={b.id} balance={b} />
        ))}
      </ul>

      <LeaveHistory />

      <ApplyLeavePanel open={applyOpen} onOpenChange={setApplyOpen} onApplied={setNotice} />
    </>
  )
}

function BalanceCard({ balance: b }: { balance: LeaveBalance }) {
  const Icon = b.icon
  const share = b.granted ? ((b.available ?? 0) / b.granted) * 100 : 0
  return (
    <li className="rounded-lg border border-border bg-surface p-4 shadow-card">
      <p className="flex items-center gap-2.5 text-sm font-semibold">
        <span className={cn('grid size-8 shrink-0 place-items-center rounded-md', toneClasses[b.tone].soft)}>
          <Icon className="size-4" aria-hidden />
        </span>
        <span className="min-w-0 truncate">{b.name}</span>
      </p>
      <div className="mt-4 flex items-end justify-between gap-2">
        <div>
          <p className="eyebrow">Available</p>
          <p className="mt-0.5 text-2xl font-semibold tabular-nums">{b.available ?? '–'}</p>
        </div>
        <div className="text-right">
          <p className="eyebrow">Booked</p>
          <p className="mt-0.5 text-2xl font-semibold text-muted tabular-nums">{b.booked}</p>
        </div>
      </div>
      <Progress
        value={share}
        className="mt-3"
        barClassName={toneClasses[b.tone].bar}
        label={`${b.name}: ${b.available ?? 0} of ${b.granted ?? 0} days available`}
      />
    </li>
  )
}

interface HistoryRow {
  key: string
  from: IsoDate
  to: IsoDate
  type: string
  days: number
  reason: string
  status: 'pending' | 'approved' | 'holiday'
  requestId?: string
}

const typeName = Object.fromEntries(leaveTypes.map((t) => [t.id, t.name]))

function LeaveHistory() {
  const requests = useLeaveRequests()
  const today = todayIso()

  const rows: HistoryRow[] = [
    ...requests.map((r) => ({
      key: r.id,
      from: r.from,
      to: r.to,
      type: typeName[r.type],
      days: r.days,
      reason: r.reason,
      status: r.status,
      requestId: r.id,
    })),
    ...holidays
      .filter((h) => h.date >= today)
      .map((h) => ({
        key: h.date,
        from: h.date,
        to: h.date,
        type: 'Holiday',
        days: 1,
        reason: h.name,
        status: 'holiday' as const,
      })),
  ]
  const upcoming = rows.filter((r) => r.to >= today).sort((a, b) => a.from.localeCompare(b.from))
  const past = rows.filter((r) => r.to < today).sort((a, b) => b.from.localeCompare(a.from))

  const groups = [
    { label: 'Upcoming leave and holidays', rows: upcoming, empty: 'Nothing booked yet.' },
    { label: 'Past leave', rows: past, empty: 'No leave taken this year.' },
  ]

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <h2 className="text-[15px] font-semibold">Leave history</h2>
        <span className="text-xs text-subtle">{requests.length} requests this year</span>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              {['Date', 'Type', 'Days', 'Reason', 'Status'].map((h) => (
                <th key={h} scope="col" className="eyebrow px-5 py-2.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <Fragment key={g.label}>
                <tr className="bg-surface-2">
                  <th colSpan={5} scope="colgroup" className="px-5 py-2 text-xs font-semibold text-muted">
                    {g.label}
                  </th>
                </tr>
                {g.rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-3.5 text-subtle">
                      {g.empty}
                    </td>
                  </tr>
                )}
                {g.rows.map((r) => (
                  <tr key={r.key} className="border-t border-border-soft">
                    <td className="px-5 py-3 font-medium whitespace-nowrap tabular-nums">
                      {formatDayRange(r.from, r.to)}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">{r.type}</td>
                    <td className="px-5 py-3 tabular-nums">{r.days}</td>
                    <td className="px-5 py-3 text-muted">{r.reason}</td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      {r.status === 'holiday' && <StatusPill tone="teal">Holiday</StatusPill>}
                      {r.status === 'approved' && <StatusPill tone="ok">Approved</StatusPill>}
                      {r.status === 'pending' && (
                        <span className="inline-flex items-center gap-3">
                          <StatusPill tone="warn">Pending approval</StatusPill>
                          <button
                            type="button"
                            onClick={() => r.requestId && withdrawLeave(r.requestId)}
                            className="text-xs font-semibold text-muted underline-offset-2 hover:text-bad hover:underline"
                          >
                            Withdraw
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
