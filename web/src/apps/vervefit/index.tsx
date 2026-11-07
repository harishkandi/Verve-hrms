import { HeartPulse, Footprints, Trophy } from 'lucide-react'
import type { AppManifest } from '@/core/apps/types'
import { HomePage } from './pages/HomePage'

const manifest: AppManifest = {
  id: 'vervefit',
  name: 'VerveFit',
  shortName: 'VerveFit',
  tagline: 'Move more, together.',
  description:
    'Company wellness challenges, activity tracking, personal wellness goals and team leaderboards.',
  icon: HeartPulse,
  accent: 'emerald',
  category: 'Wellbeing',
  permission: 'vervefit.open',
  nav: [
    { label: 'Overview', path: '' },
    { label: 'Challenges', path: 'challenges' },
    { label: 'My activity', path: 'activity' },
    { label: 'Leaderboard', path: 'leaderboard' },
  ],
  quickActions: [
    { label: 'Log activity', path: 'activity', icon: Footprints },
    { label: 'Challenges', path: 'challenges', icon: Trophy },
  ],
  routes: [{ index: true, element: <HomePage /> }],
}

export default manifest
