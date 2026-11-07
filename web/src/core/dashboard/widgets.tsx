import { Check } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { appHref, getApp } from '@/core/apps/registry'
import { cn } from '@/shared/lib/cn'
import { formatINR } from '@/shared/lib/format'
import { Button } from '@/shared/ui/Button'
import { Panel } from '@/shared/ui/Card'
import { Avatar } from '@/shared/ui/primitives'
import { useLeaveBalances } from '@/apps/leave/leaveStore'
import { todayIso } from '@/shared/lib/date'
import { announcements, celebrations, holidays, reimbursements, reviewStatus } from './sampleData'

const toneSquare = { brand: 'bg-primary', teal: 'bg-teal', ok: 'bg-ok', warn: 'bg-warn', neutral: 'bg-subtle' }

/** SAMPLE: reads the Leave app's demo store, so a new request shows here too. */
export function LeaveBalanceCard() {
  const leave = getApp('leave')
  const balances = useLeaveBalances().filter((b) => b.available !== null)
  return (
    <Panel
      title="Leave balance"
      action={leave && <Link to={appHref(leave, '?apply=1')} className="hover:underline">Apply leave</Link>}
    >
      <ul className="grid grid-cols-2 gap-2.5">
        {balances.map((l) => (
          <li key={l.id} className="rounded-md border border-border-soft bg-surface-2 px-3 py-2.5">
            <p className="text-xl font-bold tracking-tight tabular-nums">
              {l.available}{' '}
              <span className="text-xs font-medium tracking-normal text-subtle">{l.available === 1 ? 'day' : 'days'}</span>
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
              <span className={cn('size-1.5 rounded-xs', toneSquare[l.tone])} aria-hidden />
              {l.name.replace(' leave', '')}
            </p>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

export function HolidaysCard() {
  const leave = getApp('leave')
  const today = todayIso()
  const upcoming = holidays.filter((h) => h.date >= today).slice(0, 3)
  return (
    <Panel
      title="Upcoming holidays"
      action={leave && <Link to={appHref(leave, 'holidays')} className="hover:underline">View all</Link>}
    >
      <ul className="divide-y divide-border-soft">
        {upcoming.map((h) => {
          const date = new Date(`${h.date}T00:00:00`)
          return (
            <li key={h.date} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
              <span className="w-11 shrink-0 rounded-md bg-primary-soft py-1 text-center leading-tight text-primary">
                <span className="block text-[9.5px] font-bold tracking-wider uppercase">
                  {date.toLocaleDateString('en-IN', { month: 'short' })}
                </span>
                <span className="block text-base font-bold">{date.getDate()}</span>
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{h.name}</span>
                <span className="block text-xs text-subtle">
                  {date.toLocaleDateString('en-IN', { weekday: 'long' })}
                </span>
              </span>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}

export function TasksCard({ className }: { className?: string }) {
  const pms = getApp('pms')
  const claims = getApp('reimbursement')
  const current = reviewStatus.steps.find((s) => s.state === 'current')
  const openClaims = reimbursements.claims.filter((c) => c.status !== 'Paid').length

  const tasks = [
    {
      title: `${reviewStatus.period} review`,
      meta: `${current?.label ?? 'Review'} in progress · due in ${reviewStatus.dueInDays} days`,
      dot: 'bg-primary',
      to: pms && appHref(pms),
    },
    {
      title: 'Claims in progress',
      meta: `${openClaims} claims · ${formatINR(reimbursements.pendingAmount)} pending`,
      dot: 'bg-warn',
      to: claims && appHref(claims),
    },
    { title: 'Read the reimbursement policy', meta: 'New limits from 1 Dec', dot: 'bg-subtle', to: undefined },
  ]

  return (
    <Panel title="My tasks" count={tasks.length} className={className} bodyClassName="px-2">
      <ul>
        {tasks.map((t) => {
          const body = (
            <>
              <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', t.dot)} aria-hidden />
              <span className="min-w-0">
                <span className="block text-sm font-medium">{t.title}</span>
                <span className="block text-xs text-subtle">{t.meta}</span>
              </span>
            </>
          )
          return (
            <li key={t.title}>
              {t.to ? (
                <Link to={t.to} className="flex gap-3 rounded-md px-3 py-2 transition-colors hover:bg-surface-2">
                  {body}
                </Link>
              ) : (
                <div className="flex gap-3 px-3 py-2">{body}</div>
              )}
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}

type CelebrationTab = 'today' | 'joiners'

export function CelebrationsCard() {
  const [tab, setTab] = useState<CelebrationTab>('today')
  const [wished, setWished] = useState<string[]>([])
  const { today, newJoiners } = celebrations

  const tabs: { id: CelebrationTab; label: string }[] = [
    { id: 'today', label: `Today (${today.length})` },
    { id: 'joiners', label: `New hires (${newJoiners.count})` },
  ]

  return (
    <Panel title="Celebrations">
      <div className="-mx-1 mb-2 flex gap-1" role="tablist" aria-label="Celebrations">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'rounded-md px-2.5 py-1 text-xs transition-colors',
              tab === t.id ? 'bg-primary-soft font-semibold text-primary' : 'font-medium text-muted hover:text-fg',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'today' ? (
        <ul className="divide-y divide-border-soft">
          {today.map((p) => {
            const done = wished.includes(p.name)
            return (
              <li key={p.name} className="flex items-center gap-3 py-2.5">
                <Avatar initials={p.initials} tone={p.tone} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{p.name}</span>
                  <span className="block truncate text-xs text-subtle">
                    {p.occasion} · {p.meta}
                  </span>
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={done}
                  onClick={() => setWished((w) => [...w, p.name])}
                >
                  {done ? (
                    <>
                      <Check aria-hidden /> Wished
                    </>
                  ) : (
                    'Wish'
                  )}
                </Button>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="flex items-center gap-3 py-2.5">
          <span className="flex">
            {newJoiners.initials.map((i, n) => (
              <Avatar
                key={i}
                initials={i}
                tone={(['teal', 'brand', 'warn'] as const)[n % 3]}
                size="sm"
                className={cn('ring-2 ring-surface', n > 0 && '-ml-2')}
              />
            ))}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium">{newJoiners.count} people joined in November</span>
            <span className="block text-xs text-subtle">{newJoiners.teams}</span>
          </span>
        </div>
      )}
    </Panel>
  )
}

export function AnnouncementsCard() {
  return (
    <Panel title="Announcements">
      <ul className="divide-y divide-border-soft">
        {announcements.map((a) => (
          <li key={a.id} className="py-2.5 first:pt-0 last:pb-0">
            <p className="text-sm font-medium">{a.title}</p>
            <p className="mt-0.5 line-clamp-1 text-xs text-subtle">
              <span className="font-semibold text-primary">{a.tag}</span> · {a.body}
            </p>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
