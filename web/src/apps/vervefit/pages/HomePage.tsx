import { AppComingSoon } from '@/core/apps/AppComingSoon'

const plannedFeatures = [
  'Company-wide fitness challenges',
  'Activity logging and streaks',
  'Personal wellness goals',
  'Team and company leaderboards',
  'Participation insights for HR',
]

export function HomePage() {
  return <AppComingSoon features={plannedFeatures} />
}
