import { AppComingSoon } from '@/core/apps/AppComingSoon'

const plannedFeatures = [
  'Monthly self-assessments',
  'Manager assessments and sign-off',
  'Goals and KPI tracking',
  'Continuous feedback',
  'Quarterly and annual reviews',
  'Performance improvement plans',
]

export function HomePage() {
  return <AppComingSoon features={plannedFeatures} />
}
