import { useSession } from '@/core/session/session'
import { cn } from '@/shared/lib/cn'
import { Card } from '@/shared/ui/Card'
import { workWeek } from './sampleData'

/** 532 → "8:52" */
const hm = (minutes: number) => `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`

const circle = {
  present: 'bg-ok-soft text-ok',
  today: 'bg-primary text-primary-fg ring-4 ring-primary-soft',
  weekend: 'border border-dashed border-border bg-surface text-subtle',
  upcoming: 'border border-border bg-surface text-muted',
}

/** Week strip: present days in green, today in blue, weekends dashed. */
export function WorkSchedule() {
  const { user } = useSession()

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 pt-4">
        <h2 className="text-[15px] font-semibold">Work schedule</h2>
        <p className="flex flex-wrap gap-x-3 text-xs text-muted">
          <span>
            {user.shift.name} · {user.shift.hours}
          </span>
          <span className="text-subtle">{workWeek.range}</span>
        </p>
      </div>
      <ol className="relative grid grid-cols-7 px-2 pt-5 pb-5 sm:px-5">
        <span
          aria-hidden
          className="absolute top-[59px] right-[calc(100%/14)] left-[calc(100%/14)] h-0.5 bg-border-soft"
        />
        {workWeek.days.map((d) => (
          <li key={d.date} className="relative flex flex-col items-center gap-1.5 text-center">
            <span className={cn('eyebrow', d.state === 'today' && 'text-primary')}>
              {d.state === 'today' ? 'Today' : d.day}
            </span>
            <span
              className={cn('grid size-9 place-items-center rounded-full text-[13px] font-bold', circle[d.state])}
            >
              {d.date}
            </span>
            <span
              className={cn(
                'text-xs',
                d.minutes === null ? 'text-subtle' : 'font-semibold',
                d.state === 'today' && 'text-primary',
              )}
            >
              {d.minutes !== null ? `${hm(d.minutes)} hrs` : d.state === 'weekend' ? 'Weekend' : 'Shift'}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  )
}
