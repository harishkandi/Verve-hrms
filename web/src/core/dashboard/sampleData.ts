/**
 * SAMPLE DATA for the home dashboard.
 *
 * Every value here is made up so the dashboard can be designed and reviewed
 * before the apps exist. As each app is built, it replaces its block with a
 * real API call (e.g. GET /api/v1/attendance/summary/me) and the block is
 * deleted from this file.
 */

export const attendanceToday = {
  checkedInAt: '09:12',
  workedMinutes: 348,
  targetMinutes: 540,
  month: { present: 18, late: 1, leave: 1, workingDays: 21 },
  /** Minutes worked each weekday this week; `null` = not started yet. */
  week: [
    { day: 'Mon', minutes: 532 },
    { day: 'Tue', minutes: 545 },
    { day: 'Wed', minutes: 520 },
    { day: 'Thu', minutes: 348 },
    { day: 'Fri', minutes: null },
  ] as { day: string; minutes: number | null }[],
  todayIndex: 3,
}

export const reviewStatus = {
  period: 'October 2026',
  dueInDays: 5,
  steps: [
    { label: 'Self-assessment', state: 'done', note: 'Submitted 2 Nov' },
    { label: 'Manager review', state: 'current', note: 'In progress' },
    { label: 'Sign-off', state: 'todo', note: 'After manager review' },
  ] as const,
  goalsOnTrack: 4,
  goalsTotal: 5,
}

export const reimbursements = {
  pendingAmount: 4250,
  claims: [
    { id: 'EXP-1042', title: 'Client visit — cab', amount: 1850, status: 'Pending approval' },
    { id: 'EXP-1039', title: 'Team lunch', amount: 2400, status: 'Finance check' },
    { id: 'EXP-1031', title: 'Broadband — Sept', amount: 999, status: 'Paid' },
  ],
}

export const wellness = {
  streakDays: 6,
  challenge: { name: '10K Steps October', progress: 72, rank: 14, participants: 86 },
}

export const notifications = [
  { id: 'n1', appId: 'pms', title: 'Your manager started your October review', time: '10 min ago', unread: true },
  { id: 'n2', appId: 'reimbursement', title: 'EXP-1039 moved to finance check', time: '1 h ago', unread: true },
  { id: 'n3', appId: 'vervefit', title: 'You climbed to #14 in 10K Steps October', time: 'Yesterday', unread: false },
  { id: 'n4', appId: 'attendance', title: 'Correction for 28 Oct approved', time: '2 days ago', unread: false },
]

export const announcements = [
  { id: 'a1', title: 'Diwali celebrations on Friday, 3 PM', body: 'Join us in the cafeteria for sweets, rangoli and the annual awards.', tag: 'Event' },
  { id: 'a2', title: 'New reimbursement policy from 1 Dec', body: 'Updated limits for travel and meals. Read the summary before your next claim.', tag: 'Policy' },
  { id: 'a3', title: 'Welcome our 12 new joiners', body: 'Say hello to the November cohort joining Engineering, Sales and Design.', tag: 'People' },
]

export const upcoming = [
  { id: 'u1', date: '07 Nov', title: 'Diwali celebrations', meta: 'Cafeteria · 3:00 PM' },
  { id: 'u2', date: '09 Nov', title: 'October review deadline', meta: 'Verve PMS' },
  { id: 'u3', date: '14 Nov', title: 'Town hall', meta: 'Main hall · 11:00 AM' },
  { id: 'u4', date: '25 Dec', title: 'Christmas — holiday', meta: 'Company holiday' },
]

/** One-line live status under each app on the home launcher, keyed by app id. */
export const appStatus: Record<string, string> = {
  attendance: 'Checked in · 09:12',
  pms: 'Review due 9 Nov',
  reimbursement: '2 claims open',
  vervefit: '6-day streak',
  onboarding: 'Nothing pending',
  exit: 'Nothing pending',
}

/** This week's schedule strip on Home (Sun–Sat). Minutes worked; `null` = no hours. */
export const workWeek = {
  range: '1 Nov – 7 Nov 2026',
  days: [
    { day: 'Sun', date: 1, state: 'weekend', minutes: null },
    { day: 'Mon', date: 2, state: 'present', minutes: 532 },
    { day: 'Tue', date: 3, state: 'present', minutes: 545 },
    { day: 'Wed', date: 4, state: 'present', minutes: 520 },
    { day: 'Thu', date: 5, state: 'today', minutes: 348 },
    { day: 'Fri', date: 6, state: 'upcoming', minutes: null },
    { day: 'Sat', date: 7, state: 'weekend', minutes: null },
  ] as { day: string; date: number; state: 'weekend' | 'present' | 'today' | 'upcoming'; minutes: number | null }[],
}

export const leaveBalance = [
  { type: 'Casual', days: 6, tone: 'brand' },
  { type: 'Sick', days: 4, tone: 'teal' },
  { type: 'Earned', days: 2, tone: 'ok' },
  { type: 'Comp off', days: 1, tone: 'warn' },
] as const

/** The company holiday calendar. ISO dates, in order, so they format for any locale. */
export const holidays = [
  { date: '2026-01-26', name: 'Republic Day' },
  { date: '2026-03-04', name: 'Holi' },
  { date: '2026-03-19', name: 'Ugadi' },
  { date: '2026-08-15', name: 'Independence Day' },
  { date: '2026-09-14', name: 'Ganesh Chaturthi' },
  { date: '2026-10-02', name: 'Gandhi Jayanti' },
  { date: '2026-10-20', name: 'Dussehra' },
  { date: '2026-11-24', name: 'Guru Nanak Jayanti' },
  { date: '2026-12-25', name: 'Christmas' },
  { date: '2027-01-01', name: "New Year's Day" },
]

export const celebrations = {
  today: [
    { name: 'Rohan Mehta', initials: 'RM', occasion: 'Birthday', meta: 'Sales · Mumbai', tone: 'warn' },
    { name: 'Ananya Iyer', initials: 'AI', occasion: '3 years at Verve', meta: 'Design · Hyderabad', tone: 'ok' },
  ] as const,
  newJoiners: { count: 12, initials: ['SK', 'VR', 'NP'], teams: 'Engineering, Sales and Design' },
}
