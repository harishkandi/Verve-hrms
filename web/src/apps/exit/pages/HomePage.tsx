import { AppComingSoon } from '@/core/apps/AppComingSoon'

const plannedFeatures = [
  'Resignation submission',
  'Approval workflow and notice period',
  'Exit interviews',
  'Asset handover',
  'Knowledge transfer checklist',
  'Clearance and final settlement',
]

export function HomePage() {
  return <AppComingSoon features={plannedFeatures} />
}
