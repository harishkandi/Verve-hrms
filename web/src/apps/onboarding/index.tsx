import { UserPlus, ListChecks, FileUp } from 'lucide-react'
import type { AppManifest } from '@/core/apps/types'
import { HomePage } from './pages/HomePage'

const manifest: AppManifest = {
  id: 'onboarding',
  name: 'Verve Onboarding',
  shortName: 'Onboarding',
  tagline: 'A smooth first day, every time.',
  description:
    'Collect new-joiner details and documents, run onboarding checklists, handle HR approvals and department allocation, and track progress.',
  icon: UserPlus,
  accent: 'sky',
  category: 'People',
  permission: 'onboarding.open',
  nav: [
    { label: 'Overview', path: '' },
    { label: 'My checklist', path: 'checklist' },
    { label: 'Documents', path: 'documents' },
    { label: 'New joiners', path: 'joiners' },
  ],
  quickActions: [
    { label: 'Checklist', path: 'checklist', icon: ListChecks },
    { label: 'Upload docs', path: 'documents', icon: FileUp },
  ],
  routes: [{ index: true, element: <HomePage /> }],
}

export default manifest
