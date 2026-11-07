import { Building2, Users } from 'lucide-react'
import { Page, PageTitle } from '@/core/layout/Page'
import { Card } from '@/shared/ui/Card'

const spaces = {
  Team: {
    icon: Users,
    lead: 'Your team at a glance.',
    planned: [
      "Who's in, on leave or working from home today",
      'Team attendance and timesheets',
      'Leave and claim approvals waiting for you',
      'Review progress for each person',
    ],
  },
  Organization: {
    icon: Building2,
    lead: 'Verve Advisory as a whole.',
    planned: [
      'Employee directory and org chart',
      'Company announcements and policies',
      'Holiday calendar by location',
      'Departments and locations',
    ],
  },
}

/** Team and Organization spaces. Planned; the content arrives with the apps that feed them. */
export function SpacePage({ space }: { space: keyof typeof spaces }) {
  const { icon: Icon, lead, planned } = spaces[space]
  return (
    <Page tabs={[{ label: 'Overview', to: `/${space.toLowerCase()}` }]}>
      <PageTitle title={space} lead={lead} />
      <Card className="flex flex-col gap-6 p-6 sm:flex-row sm:p-8">
        <span className="inline-grid size-12 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
          <Icon className="size-6" strokeWidth={1.7} aria-hidden />
        </span>
        <div>
          <h2 className="text-base font-semibold">This space is planned</h2>
          <p className="mt-1 text-sm text-muted">It fills in as the apps behind it are built. It will show:</p>
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {planned.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brass" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </Page>
  )
}
