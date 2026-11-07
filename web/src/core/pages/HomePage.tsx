import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { AppTiles } from '@/core/dashboard/AppTiles'
import { ProfileCard } from '@/core/dashboard/ProfileCard'
import {
  AnnouncementsCard,
  CelebrationsCard,
  HolidaysCard,
  LeaveBalanceCard,
  TasksCard,
} from '@/core/dashboard/widgets'
import { WorkSchedule } from '@/core/dashboard/WorkSchedule'
import { Page } from '@/core/layout/Page'
import { mySpaceTabs } from '@/core/layout/spaces'
import { useSession } from '@/core/session/session'
import { SectionHeader } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/primitives'

function greeting(hour: number) {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

/** My Space › Overview: profile and clock on the left, the day's picture on the right. */
export function HomePage() {
  const { user } = useSession()
  const [now] = useState(() => new Date())
  const date = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <Page tabs={mySpaceTabs}>
      <div className="grid items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <ProfileCard />

        <div className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-serif text-[28px] leading-tight font-semibold tracking-[-0.01em]">
                {greeting(now.getHours())}, {user.firstName}
              </h1>
              <p className="mt-1 text-sm text-muted">Have a productive day.</p>
            </div>
            <p className="flex items-center gap-2 text-sm text-muted">
              {date}
              <Badge title="Real data arrives as each app is built">Sample data</Badge>
            </p>
          </div>

          <WorkSchedule />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <LeaveBalanceCard />
            <HolidaysCard />
            <TasksCard className="md:col-span-2 xl:col-span-1" />
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <CelebrationsCard />
            <AnnouncementsCard />
          </div>

          <section className="pt-1">
            <SectionHeader
              title="Your apps"
              description="Pinned apps appear first in the side bar."
              action={
                <Link
                  to="/apps"
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline"
                >
                  Browse all <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              }
            />
            <AppTiles />
          </section>
        </div>
      </div>
    </Page>
  )
}
