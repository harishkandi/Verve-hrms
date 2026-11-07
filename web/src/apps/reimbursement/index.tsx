import { Receipt, ReceiptText, Wallet } from 'lucide-react'
import type { AppManifest } from '@/core/apps/types'
import { OverviewPage } from './pages/OverviewPage'
import { Root } from './Root'

const manifest: AppManifest = {
  id: 'reimbursement',
  name: 'Verve Reimbursement',
  shortName: 'Expenses',
  tagline: 'Claim expenses and track every rupee back.',
  description:
    'Submit expense claims with receipts, route them through manager approval and finance verification, and track payouts end to end.',
  icon: Receipt,
  accent: 'amber',
  category: 'Finance',
  permission: 'reimbursement.open',
  nav: [
    { label: 'Overview', path: '' },
    { label: 'My claims', path: 'claims' },
    { label: 'New claim', path: 'new' },
    { label: 'Approvals', path: 'approvals' },
  ],
  quickActions: [
    { label: 'New claim', path: 'new', icon: ReceiptText },
    { label: 'Track claims', path: 'claims', icon: Wallet },
  ],
  routes: [
    {
      // Pathless wrapper: signs in to the Reimbursement API, then shows the page.
      element: <Root />,
      children: [{ index: true, element: <OverviewPage /> }],
    },
  ],
}

export default manifest
