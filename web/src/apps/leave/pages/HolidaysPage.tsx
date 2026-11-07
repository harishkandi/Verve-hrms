import { holidays } from '@/core/dashboard/sampleData'
import { PageTitle } from '@/core/layout/Page'
import { cn } from '@/shared/lib/cn'
import { fromIso, todayIso } from '@/shared/lib/date'
import { Card } from '@/shared/ui/Card'
import { StatusPill } from '@/shared/ui/primitives'

/** Leave › Holiday calendar: every company holiday, the next one marked. */
export function HolidaysPage() {
  const today = todayIso()
  const next = holidays.find((h) => h.date >= today)

  return (
    <>
      <PageTitle title="Holiday calendar" lead="All Verve Advisory offices · sample data" />
      <Card className="overflow-hidden">
        <ul className="divide-y divide-border-soft">
          {holidays.map((h) => {
            const date = fromIso(h.date)
            const passed = h.date < today
            return (
              <li key={h.date} className={cn('flex items-center gap-4 px-5 py-3.5', passed && 'text-subtle')}>
                <span
                  className={cn(
                    'w-12 shrink-0 rounded-md border py-1 text-center leading-tight',
                    passed ? 'border-border-soft' : 'border-primary/15 bg-primary-soft text-primary',
                  )}
                >
                  <span className="block text-[10px] font-semibold tracking-wider uppercase">
                    {date.toLocaleDateString('en-IN', { month: 'short' })}
                  </span>
                  <span className="block text-lg font-semibold tabular-nums">{date.getDate()}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn('block truncate text-sm font-medium', !passed && 'text-fg')}>{h.name}</span>
                  <span className="block text-xs text-subtle">
                    {date.toLocaleDateString('en-GB', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </span>
                {h === next && <StatusPill tone="brand">Next holiday</StatusPill>}
              </li>
            )
          })}
        </ul>
      </Card>
    </>
  )
}
