import { CalendarMinus, Plane, Repeat, Sun, Thermometer, type LucideIcon } from 'lucide-react'
import { useMemo } from 'react'
import { holidays } from '@/core/dashboard/sampleData'
import { addDays, eachDay, type IsoDate, isWeekend } from '@/shared/lib/date'
import { createStore } from '@/shared/lib/store'

export type LeaveTypeId = 'casual' | 'sick' | 'earned' | 'comp' | 'unpaid'
export type LeaveTone = 'brand' | 'teal' | 'ok' | 'warn' | 'neutral'

export interface LeaveType {
  id: LeaveTypeId
  name: string
  icon: LucideIcon
  tone: LeaveTone
  /** Days granted for the year. `null` = no balance (leave without pay). */
  granted: number | null
}

/** SAMPLE: the leave types HR sets up for Verve, with this year's grant. */
export const leaveTypes: LeaveType[] = [
  { id: 'casual', name: 'Casual leave', icon: Sun, tone: 'brand', granted: 12 },
  { id: 'sick', name: 'Sick leave', icon: Thermometer, tone: 'teal', granted: 6 },
  { id: 'earned', name: 'Earned leave', icon: Plane, tone: 'ok', granted: 12 },
  { id: 'comp', name: 'Comp off', icon: Repeat, tone: 'warn', granted: 1 },
  { id: 'unpaid', name: 'Leave without pay', icon: CalendarMinus, tone: 'neutral', granted: null },
]

export const toneClasses: Record<LeaveTone, { soft: string; bar: string }> = {
  brand: { soft: 'bg-primary-soft text-primary', bar: 'bg-primary' },
  teal: { soft: 'bg-teal-soft text-teal', bar: 'bg-teal' },
  ok: { soft: 'bg-ok-soft text-ok', bar: 'bg-ok' },
  warn: { soft: 'bg-warn-soft text-warn', bar: 'bg-warn' },
  neutral: { soft: 'bg-surface-2 text-muted ring-1 ring-border', bar: 'bg-subtle' },
}

export type LeaveSession = 'full' | 'first' | 'second'
export type LeaveStatus = 'pending' | 'approved'

export interface LeaveRequest {
  id: string
  type: LeaveTypeId
  from: IsoDate
  to: IsoDate
  session: LeaveSession
  days: number
  reason: string
  status: LeaveStatus
}

/** SAMPLE: this year's requests. Pending and approved days both count as booked. */
const store = createStore<LeaveRequest[]>([
  { id: 'l1', type: 'casual', from: '2026-03-09', to: '2026-03-10', session: 'full', days: 2, reason: "Cousin's wedding", status: 'approved' },
  { id: 'l2', type: 'earned', from: '2026-04-06', to: '2026-04-10', session: 'full', days: 5, reason: 'Trip home', status: 'approved' },
  { id: 'l3', type: 'sick', from: '2026-05-15', to: '2026-05-15', session: 'full', days: 1, reason: 'Migraine', status: 'approved' },
  { id: 'l4', type: 'earned', from: '2026-08-17', to: '2026-08-21', session: 'full', days: 5, reason: 'Vacation', status: 'approved' },
  { id: 'l5', type: 'sick', from: '2026-09-22', to: '2026-09-22', session: 'full', days: 1, reason: 'Fever', status: 'approved' },
  { id: 'l6', type: 'casual', from: '2026-10-12', to: '2026-10-13', session: 'full', days: 2, reason: 'Family function', status: 'approved' },
  { id: 'l7', type: 'casual', from: '2026-12-28', to: '2026-12-29', session: 'full', days: 2, reason: 'Year-end travel', status: 'pending' },
])

export function useLeaveRequests() {
  return store.useStore()
}

export interface LeaveBalance extends LeaveType {
  booked: number
  /** `null` when the type has no balance. */
  available: number | null
}

export function useLeaveBalances(): LeaveBalance[] {
  const requests = useLeaveRequests()
  return useMemo(
    () =>
      leaveTypes.map((t) => {
        const booked = requests.filter((r) => r.type === t.id).reduce((sum, r) => sum + r.days, 0)
        return { ...t, booked, available: t.granted === null ? null : t.granted - booked }
      }),
    [requests],
  )
}

let nextId = 100

export function applyLeave(request: Omit<LeaveRequest, 'id' | 'status'>) {
  store.set((all) => [...all, { ...request, id: `l${nextId++}`, status: 'pending' }])
}

export function withdrawLeave(id: string) {
  store.set((all) => all.filter((r) => r.id !== id))
}

const holidayDates = new Set(holidays.map((h) => h.date))

/** Working days between two dates: weekends and holidays don't count. */
export function leaveDays(from: IsoDate, to: IsoDate, session: LeaveSession): number {
  if (!from || !to || to < from) return 0
  const working = eachDay(from, to).filter((d) => !isWeekend(d) && !holidayDates.has(d)).length
  return from === to && session !== 'full' ? working / 2 : working
}

export function nextWorkingDay(after: IsoDate): IsoDate {
  let d = addDays(after, 1)
  while (isWeekend(d) || holidayDates.has(d)) d = addDays(d, 1)
  return d
}

export function overlapsExisting(requests: LeaveRequest[], from: IsoDate, to: IsoDate): boolean {
  return requests.some((r) => r.from <= to && from <= r.to)
}

/** 0.5 → "Half a day", 1 → "1 day", 3 → "3 days". */
export function formatDays(n: number): string {
  if (n === 0.5) return 'Half a day'
  return `${n} ${n === 1 ? 'day' : 'days'}`
}
