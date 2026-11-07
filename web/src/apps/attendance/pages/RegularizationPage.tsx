import { PencilLine } from 'lucide-react'
import { Link } from 'react-router'
import { PageTitle } from '@/core/layout/Page'
import { formatClock, formatDayRange } from '@/shared/lib/date'
import { buttonClass } from '@/shared/ui/buttonClass'
import { Card } from '@/shared/ui/Card'
import { StatusPill } from '@/shared/ui/primitives'
import { useRegularizations } from '../attendanceData'

/** Attendance › Regularization: every correction you've asked for. */
export function RegularizationPage() {
  const requests = [...useRegularizations()].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <PageTitle
        title="Regularization"
        lead="Corrections to your check-in and check-out times · sample data"
        action={
          <Link to="/attendance?regularize=1" className={buttonClass({ variant: 'secondary' })}>
            <PencilLine aria-hidden /> Regularize
          </Link>
        }
      />
      <Card className="overflow-hidden">
        {requests.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">No corrections yet.</p>
        ) : (
          <ul className="divide-y divide-border-soft">
            {requests.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-x-6 gap-y-1.5 px-5 py-3.5">
                <span className="w-44 text-sm font-medium tabular-nums">{formatDayRange(r.date)}</span>
                <span className="w-48 text-sm text-muted tabular-nums">
                  {formatClock(r.checkIn)} – {formatClock(r.checkOut)}
                </span>
                <span className="min-w-0 flex-1 text-sm text-muted">{r.reason}</span>
                {r.status === 'pending' ? (
                  <StatusPill tone="warn">Pending approval</StatusPill>
                ) : (
                  <StatusPill tone="ok">Approved</StatusPill>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}
