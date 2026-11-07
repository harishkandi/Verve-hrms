import { CalendarCheck, CalendarPlus, PartyPopper } from 'lucide-react'
import type { AppManifest } from '@/core/apps/types'
import { HolidaysPage } from './pages/HolidaysPage'
import { SummaryPage } from './pages/SummaryPage'

const manifest: AppManifest = {
  id: 'leave',
  name: 'Verve Leave',
  shortName: 'Leave',
  tagline: 'Apply for leave and see your balance at a glance.',
  description:
    'Leave balances by type, leave requests with manager approval, and the company holiday calendar.',
  icon: CalendarCheck,
  accent: 'sky',
  category: 'Time',
  permission: 'leave.open',
  nav: [
    { label: 'Leave summary', path: '' },
    { label: 'Holiday calendar', path: 'holidays' },
  ],
  quickActions: [
    { label: 'Apply leave', path: '?apply=1', icon: CalendarPlus },
    { label: 'Holiday calendar', path: 'holidays', icon: PartyPopper },
  ],
  routes: [
    { index: true, element: <SummaryPage /> },
    { path: 'holidays', element: <HolidaysPage /> },
  ],
}

export default manifest
