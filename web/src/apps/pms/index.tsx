import { TrendingUp, ClipboardCheck, Target } from 'lucide-react'
import type { AppManifest } from '@/core/apps/types'
import { HomePage } from './pages/HomePage'

const manifest: AppManifest = {
  id: 'pms',
  name: 'Verve PMS',
  shortName: 'PMS',
  tagline: 'Monthly reviews, goals and growth.',
  description:
    'Monthly self and manager assessments, goals and KPIs, feedback, quarterly and annual reviews, and improvement plans.',
  icon: TrendingUp,
  accent: 'violet',
  category: 'Performance',
  permission: 'pms.open',
  nav: [
    { label: 'Overview', path: '' },
    { label: 'My reviews', path: 'reviews' },
    { label: 'Goals & KPIs', path: 'goals' },
    { label: 'Team', path: 'team' },
  ],
  quickActions: [
    { label: 'Self review', path: 'reviews', icon: ClipboardCheck },
    { label: 'Update goals', path: 'goals', icon: Target },
  ],
  routes: [{ index: true, element: <HomePage /> }],
}

export default manifest
