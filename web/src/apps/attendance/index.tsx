import { Clock3, Fingerprint, PencilLine } from 'lucide-react'
import type { AppManifest } from '@/core/apps/types'
import { RegularizationPage } from './pages/RegularizationPage'
import { SummaryPage } from './pages/SummaryPage'

const manifest: AppManifest = {
  id: 'attendance',
  name: 'Verve Attendance',
  shortName: 'Attendance',
  tagline: 'Check in, track hours and fix missed punches.',
  description:
    'Daily check-in and check-out, working hours, late arrivals, correction requests and monthly attendance reports for employees, managers and HR.',
  icon: Clock3,
  accent: 'blue',
  category: 'Time',
  permission: 'attendance.open',
  nav: [
    { label: 'Attendance summary', path: '' },
    { label: 'Regularization', path: 'regularization' },
    { label: 'Shift schedule', path: 'shift' },
    { label: 'Reports', path: 'reports' },
  ],
  quickActions: [
    { label: 'Check in or out', path: '', icon: Fingerprint },
    { label: 'Regularize attendance', path: '?regularize=1', icon: PencilLine },
  ],
  routes: [
    { index: true, element: <SummaryPage /> },
    { path: 'regularization', element: <RegularizationPage /> },
  ],
}

export default manifest
