import { AppComingSoon } from '@/core/apps/AppComingSoon'

const plannedFeatures = [
  'New-joiner information forms',
  'Secure document uploads',
  'Onboarding checklists',
  'HR approvals',
  'Department and manager allocation',
  'Progress tracking for HR',
]

export function HomePage() {
  return <AppComingSoon features={plannedFeatures} />
}
