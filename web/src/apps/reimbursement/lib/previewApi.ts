import type { ClaimDetail, ClaimStatus, ClaimSummary, Me, Policy, UserBrief } from './types'

/**
 * SAMPLE: stands in for the Reimbursement API on the preview site, where no
 * backend runs. Covers only the calls the app makes today; anything else
 * answers 404. Data lives in memory and resets on reload.
 */

type PreviewUser = Me & { role: string }

const base = {
  is_admin: false,
  can_verify: false,
  can_pay: false,
  is_fallback_approver: false,
  is_active: true,
  is_approver: false,
}

const priya: UserBrief = { id: 2, name: 'Priya Raman', email: 'priya.raman@verve.example' }

const users: PreviewUser[] = [
  {
    ...base,
    id: 1,
    name: 'Aarav Mehta',
    email: 'aarav.mehta@verve.example',
    employee_code: 'VA-0142',
    department: 'Design',
    manager_id: 2,
    manager: priya,
    role: 'Employee',
  },
  {
    ...base,
    ...priya,
    employee_code: 'VA-0031',
    department: 'Design',
    manager_id: null,
    manager: null,
    is_approver: true,
    role: 'Manager',
  },
  {
    ...base,
    id: 3,
    name: 'Kavya Nair',
    email: 'kavya.nair@verve.example',
    employee_code: 'VA-0018',
    department: 'Accounts',
    manager_id: null,
    manager: null,
    can_verify: true,
    can_pay: true,
    role: 'Accounts',
  },
  {
    ...base,
    id: 4,
    name: 'Rahul Verma',
    email: 'rahul.verma@verve.example',
    employee_code: 'VA-0004',
    department: 'Operations',
    manager_id: null,
    manager: null,
    is_admin: true,
    role: 'Admin',
  },
]

const policy: Policy = {
  submission_due_day: 5,
  max_age_days: 60,
  cash_no_bill_item_limit: '500.00',
  cash_no_bill_month_limit: '2000.00',
}

/** "YYYY-MM" for `monthsAgo` months before now. */
function period(monthsAgo: number): string {
  const d = new Date()
  d.setDate(1)
  d.setMonth(d.getMonth() - monthsAgo)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** An ISO timestamp on `day` of the month after `p`. */
function after(p: string, day: number): string {
  const [y, m] = p.split('-').map(Number)
  return new Date(y, m, day, 11, 0).toISOString()
}

const brief = ({ id, name, email }: UserBrief): UserBrief => ({ id, name, email })

let nextId = 500
const claims = new Map<number, ClaimSummary[]>()

function claimsFor(user: PreviewUser): ClaimSummary[] {
  let list = claims.get(user.id)
  if (!list) {
    const make = (monthsAgo: number, status: ClaimStatus, claimed: string, approved: string, lines: number) => {
      const p = period(monthsAgo)
      const paid = status === 'paid'
      return {
        id: nextId++,
        period: p,
        status,
        employee: brief(user),
        employee_department: user.department,
        approver: user.manager,
        total_claimed: claimed,
        total_approved: approved,
        line_count: lines,
        submitted_at: after(p, 3),
        status_changed_at: after(p, paid ? 20 : 4),
        payout_batch_id: paid ? 40 + monthsAgo : null,
        payment_reference: paid ? `NEFT-${p.replace('-', '')}-${user.id}` : null,
        paid_at: paid ? after(p, 20) : null,
        warning_count: 0,
      }
    }
    list = [
      make(1, 'submitted', '4250.00', '0.00', 6),
      make(2, 'verified', '3180.00', '3180.00', 4),
      make(3, 'paid', '2760.50', '2760.50', 5),
      make(4, 'paid', '5120.00', '4870.00', 7),
    ]
    claims.set(user.id, list)
  }
  return list
}

const TOKEN_PREFIX = 'preview-'

export interface PreviewResponse {
  status: number
  body: unknown
}

export function previewRespond(path: string, method: string, json: unknown, token: string | null): PreviewResponse {
  const me = token?.startsWith(TOKEN_PREFIX) ? users.find((u) => `${TOKEN_PREFIX}${u.id}` === token) : undefined
  const ok = (body: unknown): PreviewResponse => ({ status: 200, body })
  const fail = (status: number, detail: string): PreviewResponse => ({ status, body: { detail } })

  if (method === 'GET' && path === '/auth/dev-users') {
    return ok(users.map((u) => ({ ...brief(u), role: u.role })))
  }
  if (method === 'POST' && path === '/auth/dev-login') {
    const email = (json as { email?: string } | undefined)?.email
    const user = users.find((u) => u.email === email)
    return user ? ok({ access_token: `${TOKEN_PREFIX}${user.id}`, user }) : fail(404, 'No test user with that email.')
  }

  if (!me) return fail(401, 'Sign in again.')

  if (method === 'GET' && path === '/auth/me') return ok(me)
  if (method === 'GET' && path === '/policy') return ok(policy)
  if (method === 'GET' && path === '/claims') return ok(claimsFor(me))
  if (method === 'POST' && path === '/claims') {
    const p = (json as { period?: string } | undefined)?.period ?? period(0)
    const list = claimsFor(me)
    let claim = list.find((c) => c.period === p)
    if (!claim) {
      claim = {
        id: nextId++,
        period: p,
        status: 'draft',
        employee: brief(me),
        employee_department: me.department,
        approver: me.manager,
        total_claimed: '0.00',
        total_approved: '0.00',
        line_count: 0,
        submitted_at: null,
        status_changed_at: new Date().toISOString(),
        payout_batch_id: null,
        payment_reference: null,
        paid_at: null,
        warning_count: 0,
      }
      list.unshift(claim)
    }
    const detail: ClaimDetail = { ...claim, lines: [], events: [], warnings: [], allowed_actions: ['edit', 'submit'] }
    return ok(detail)
  }

  return fail(404, 'This part of Reimbursement isn’t in the preview yet.')
}
