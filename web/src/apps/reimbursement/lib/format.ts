import type { ClaimStatus } from './types'

// Paise matter in reimbursements, so unlike the portal's formatINR this keeps 2 decimals.
const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })

export const money = (value: string | number | null | undefined): string =>
  value === null || value === undefined || value === '' ? '—' : inr.format(Number(value))

export const day = (iso: string | null | undefined): string =>
  iso
    ? new Date(iso.length === 10 ? `${iso}T00:00:00` : iso).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—'

export const monthLabel = (period: string): string => {
  const [y, m] = period.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('')

/** "today", "yesterday", "3 days ago", then a date. */
export const ago = (iso: string | null | undefined): string => {
  if (!iso) return '—'
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  return day(iso)
}

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

export const STATUS_LABEL: Record<ClaimStatus, string> = {
  draft: 'Draft',
  submitted: 'With manager',
  returned: 'Returned',
  manager_approved: 'With Accounts',
  verified: 'Verified',
  in_payout_batch: 'In payout',
  paid: 'Paid',
  rejected: 'Rejected',
}

/** Full Tailwind class names (never concatenated) so the build can find them. */
export const STATUS_TONE: Record<ClaimStatus, string> = {
  draft: 'bg-surface-2 text-muted ring-border',
  submitted: 'bg-blue-500/8 text-blue-700 ring-blue-500/20 dark:text-blue-300',
  returned: 'bg-amber-500/10 text-amber-800 ring-amber-500/25 dark:text-amber-300',
  manager_approved: 'bg-blue-500/8 text-blue-700 ring-blue-500/20 dark:text-blue-300',
  verified: 'bg-violet-500/8 text-violet-700 ring-violet-500/20 dark:text-violet-300',
  in_payout_batch: 'bg-violet-500/8 text-violet-700 ring-violet-500/20 dark:text-violet-300',
  paid: 'bg-emerald-500/8 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300',
  rejected: 'bg-red-500/8 text-red-700 ring-red-500/20 dark:text-red-300',
}

export const STATUS_DOT: Record<ClaimStatus, string> = {
  draft: 'bg-muted/60',
  submitted: 'bg-blue-500',
  returned: 'bg-amber-500',
  manager_approved: 'bg-blue-500',
  verified: 'bg-violet-500',
  in_payout_batch: 'bg-violet-500',
  paid: 'bg-emerald-500',
  rejected: 'bg-red-500',
}

/** Day of month the claim for `period` is due (next month), as an ISO date. */
export const dueDate = (period: string, dueDay: number): string => {
  const [y, m] = period.split('-').map(Number)
  const ny = m === 12 ? y + 1 : y
  const nm = m === 12 ? 1 : m + 1
  return `${ny}-${String(nm).padStart(2, '0')}-${String(dueDay).padStart(2, '0')}`
}

/** Whole days from today to an ISO date (negative when past). */
export const daysUntil = (iso: string): number => {
  const start = new Date(`${today()}T00:00:00`).getTime()
  return Math.round((new Date(`${iso}T00:00:00`).getTime() - start) / 86_400_000)
}

export const today = (): string => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const thisPeriod = (): string => today().slice(0, 7)
