import { holidays } from '@/core/dashboard/sampleData'
import { addDays, type IsoDate, isWeekend } from '@/shared/lib/date'
import { createStore } from '@/shared/lib/store'

/** Times are minutes after midnight. */
export const shift = { start: 9 * 60 + 30, end: 18 * 60 + 30, graceMinutes: 15 }
/** The timeline runs from 8 AM to 8 PM. */
export const axis = { start: 8 * 60, end: 20 * 60 }

export const isLate = (checkIn: number) => checkIn > shift.start + shift.graceMinutes

export type DayRecord =
  | { date: IsoDate; kind: 'weekend' }
  | { date: IsoDate; kind: 'holiday'; name: string }
  | { date: IsoDate; kind: 'upcoming' }
  | { date: IsoDate; kind: 'today' }
  | { date: IsoDate; kind: 'present'; checkIn: number; checkOut: number }

export interface Regularization {
  id: string
  date: IsoDate
  checkIn: number
  checkOut: number
  reason: string
  status: 'pending' | 'approved'
}

/** SAMPLE: correction requests. Approved ones replace that day's times. */
const regularizations = createStore<Regularization[]>([
  {
    id: 'r1',
    date: '2026-10-28',
    checkIn: 9 * 60 + 10,
    checkOut: 18 * 60 + 20,
    reason: 'Forgot to check out',
    status: 'approved',
  },
])

export const useRegularizations = () => regularizations.useStore()

let nextId = 100
export function requestRegularization(r: Omit<Regularization, 'id' | 'status'>) {
  regularizations.set((all) => [...all, { ...r, id: `r${nextId++}`, status: 'pending' }])
}

/** SAMPLE: this week's punches, matching the Home page. */
const known: Record<IsoDate, [number, number]> = {
  '2026-11-02': [9 * 60 + 8, 18 * 60],
  '2026-11-03': [9 * 60 + 2, 18 * 60 + 7],
  '2026-11-04': [9 * 60 + 25, 18 * 60 + 5],
}

/** SAMPLE: steady, believable punches for any other past day. */
function samplePunches(date: IsoDate): [number, number] {
  let h = 0
  for (const c of date) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const checkIn = h % 11 === 0 ? 9 * 60 + 47 : 9 * 60 + (h % 27)
  return [checkIn, 17 * 60 + 55 + ((h >>> 5) % 25)]
}

const holidayName = new Map(holidays.map((h) => [h.date, h.name]))

export function dayRecord(date: IsoDate, today: IsoDate, approved: Regularization[]): DayRecord {
  if (isWeekend(date)) return { date, kind: 'weekend' }
  const holiday = holidayName.get(date)
  if (holiday) return { date, kind: 'holiday', name: holiday }
  if (date > today) return { date, kind: 'upcoming' }
  if (date === today) return { date, kind: 'today' }
  const fix = approved.find((r) => r.date === date)
  const [checkIn, checkOut] = fix ? [fix.checkIn, fix.checkOut] : (known[date] ?? samplePunches(date))
  return { date, kind: 'present', checkIn, checkOut }
}

export function weekRecords(weekStart: IsoDate, today: IsoDate, all: Regularization[]): DayRecord[] {
  const approved = all.filter((r) => r.status === 'approved')
  return Array.from({ length: 7 }, (_, i) => dayRecord(addDays(weekStart, i), today, approved))
}
