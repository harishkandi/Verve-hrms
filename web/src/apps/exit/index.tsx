import { LogOut } from 'lucide-react'
import type { AppManifest } from '@/core/apps/types'
import { HomePage } from './pages/HomePage'

const manifest: AppManifest = {
  id: 'exit',
  name: 'Verve Exit',
  shortName: 'Exit',
  tagline: 'Respectful, organised offboarding.',
  description:
    'Resignation submission, approvals, notice period tracking, exit interviews, asset handover, knowledge transfer and clearance.',
  icon: LogOut,
  accent: 'rose',
  category: 'People',
  permission: 'exit.open',
  nav: [
    { label: 'Overview', path: '' },
    { label: 'Resignation', path: 'resignation' },
    { label: 'Clearance', path: 'clearance' },
    { label: 'Exit interview', path: 'interview' },
  ],
  quickActions: [

  ],
  routes: [{ index: true, element: <HomePage /> }],
}

export default manifest
