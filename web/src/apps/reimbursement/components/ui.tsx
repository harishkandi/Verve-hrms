import { AlertCircle, ChevronRight, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { useCurrentApp } from '@/core/apps/currentApp'
import { cn } from '@/shared/lib/cn'
import { Avatar } from '@/shared/ui/primitives'
import { STATUS_DOT, STATUS_LABEL, STATUS_TONE, ago, initials, money, monthLabel, plural } from '../lib/format'
import type { ClaimStatus, ClaimSummary } from '../lib/types'

// Not the shared <Badge>: its built-in grey can't be overridden reliably (Tailwind
// orders utilities by name, so e.g. text-muted beats text-emerald-700).
export function StatusBadge({ status }: { status: ClaimStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full py-0.5 pr-2.5 pl-2 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
        STATUS_TONE[status],
      )}
    >
      <span className={cn('size-1.5 rounded-full', STATUS_DOT[status])} aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  )
}

export function Person({ name, meta }: { name: string; meta?: ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar initials={initials(name)} size="sm" />
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{name}</div>
        {meta && <div className="truncate text-xs text-muted">{meta}</div>}
      </div>
    </div>
  )
}

export function Empty({
  icon: Icon,
  title,
  children,
  action,
}: {
  icon: LucideIcon
  title: string
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="inline-grid size-12 place-items-center rounded-lg bg-surface-2 text-muted">
        <Icon className="size-6" aria-hidden />
      </span>
      <h3 className="mt-4 font-semibold">{title}</h3>
      {children && <p className="mt-1 max-w-sm text-sm text-muted">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorNote({ error }: { error: string | null | undefined }) {
  if (!error) return null
  return (
    <div
      role="alert"
      className="mb-4 flex items-start gap-2.5 rounded-md border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-700 dark:text-red-300"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
      {error}
    </div>
  )
}

export function SkeletonRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="divide-y divide-border" role="status" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="size-8 animate-pulse rounded-full bg-surface-2" />
          <div className="flex-1 space-y-2">
            <div
              className="h-3 animate-pulse rounded bg-surface-2"
              style={{ width: `${45 + ((i * 17) % 30)}%` }}
            />
            <div className="h-2.5 w-1/5 animate-pulse rounded bg-surface-2" />
          </div>
          <div className="h-3 w-16 animate-pulse rounded bg-surface-2" />
        </div>
      ))}
    </div>
  )
}

type Col = 'employee' | 'month' | 'items' | 'status' | 'approver' | 'updated' | 'claimed' | 'approved'

const NOT_APPROVED_YET: ClaimStatus[] = ['draft', 'submitted', 'returned', 'rejected']

/**
 * The standard claims list used by My claims, Approvals, Payouts and Reports.
 * A table on desktop; stacked rows on phones so the page never scrolls sideways.
 */
export function ClaimTable({
  claims,
  cols,
  empty,
}: {
  claims: ClaimSummary[]
  cols: Col[]
  empty: ReactNode
}) {
  const navigate = useNavigate()
  const app = useCurrentApp()
  if (!claims.length) return <>{empty}</>
  const has = (c: Col) => cols.includes(c)
  // With both, the expense count sits under the month instead of taking a column.
  const itemsUnderMonth = has('month') && has('items')
  const open = (id: number) => navigate(`/${app.id}/claims/${id}`)
  const notApproved = (c: ClaimSummary) => NOT_APPROVED_YET.includes(c.status)
  const th = 'px-5 py-3 text-left text-[11px] font-semibold tracking-[0.08em] text-muted uppercase'
  const td = 'px-5 py-4'

  return (
    <>
      {/* Desktop and tablet */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface-2/50">
            <tr>
              {has('employee') && <th className={th}>Employee</th>}
              {has('month') && <th className={th}>Month</th>}
              {has('items') && !itemsUnderMonth && <th className={th}>Items</th>}
              {has('status') && <th className={th}>Status</th>}
              {has('approver') && <th className={th}>Approver</th>}
              {has('updated') && <th className={th}>Last update</th>}
              {has('claimed') && <th className={cn(th, 'text-right')}>Claimed</th>}
              {has('approved') && <th className={cn(th, 'text-right')}>Approved</th>}
              <th className="w-12" aria-hidden />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {claims.map((c) => (
              <tr
                key={c.id}
                onClick={() => open(c.id)}
                className="group cursor-pointer transition-colors hover:bg-surface-2/60"
              >
                {has('employee') && (
                  <td className={td}>
                    <Person name={c.employee.name} meta={c.employee_department ?? c.employee.email} />
                  </td>
                )}
                {has('month') && (
                  <td className={td}>
                    <div className="font-semibold whitespace-nowrap">{monthLabel(c.period)}</div>
                    {itemsUnderMonth && (
                      <div className="mt-0.5 text-xs text-muted">{plural(c.line_count, 'expense')}</div>
                    )}
                  </td>
                )}
                {has('items') && !itemsUnderMonth && (
                  <td className={cn(td, 'text-muted')}>{plural(c.line_count, 'expense')}</td>
                )}
                {has('status') && (
                  <td className={td}>
                    <StatusBadge status={c.status} />
                  </td>
                )}
                {has('approver') && (
                  <td className={cn(td, 'text-muted')}>{c.approver?.name ?? '—'}</td>
                )}
                {has('updated') && (
                  <td className={cn(td, 'whitespace-nowrap text-muted')}>{ago(c.status_changed_at)}</td>
                )}
                {has('claimed') && (
                  <td className={cn(td, 'text-right text-muted tabular-nums')}>
                    {money(c.total_claimed)}
                  </td>
                )}
                {has('approved') && (
                  <td className={cn(td, 'text-right font-semibold tabular-nums')}>
                    {notApproved(c) ? <span className="font-normal text-muted/60">—</span> : money(c.total_approved)}
                  </td>
                )}
                <td className="pr-5 text-right">
                  <ChevronRight
                    className="ml-auto size-4 text-muted/50 transition-colors group-hover:text-fg"
                    aria-hidden
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phones */}
      <ul className="divide-y divide-border md:hidden">
        {claims.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => open(c.id)}
              className="flex w-full items-center gap-3 px-4 py-4 text-left active:bg-surface-2/60"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">
                  {has('employee') ? c.employee.name : monthLabel(c.period)}
                </div>
                <div className="mt-0.5 truncate text-xs text-muted">
                  {has('employee') ? monthLabel(c.period) : plural(c.line_count, 'expense')}
                  {has('updated') && ` · ${ago(c.status_changed_at)}`}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span className="text-sm font-semibold tabular-nums">{money(c.total_claimed)}</span>
                <StatusBadge status={c.status} />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
