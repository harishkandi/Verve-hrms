/**
 * Calendar-date helpers. Dates are plain `YYYY-MM-DD` strings in local time,
 * so a leave day never shifts because of time zones.
 */

export type IsoDate = string

export function toIso(d: Date): IsoDate {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function fromIso(iso: IsoDate): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayIso(): IsoDate {
  return toIso(new Date())
}

export function addDays(iso: IsoDate, days: number): IsoDate {
  const d = fromIso(iso)
  d.setDate(d.getDate() + days)
  return toIso(d)
}

/** Sunday of the week that contains `iso`. */
export function startOfWeek(iso: IsoDate): IsoDate {
  return addDays(iso, -fromIso(iso).getDay())
}

export function isWeekend(iso: IsoDate): boolean {
  const day = fromIso(iso).getDay()
  return day === 0 || day === 6
}

/** Every date from `from` to `to`, both included. */
export function eachDay(from: IsoDate, to: IsoDate): IsoDate[] {
  const days: IsoDate[] = []
  for (let d = from; d <= to; d = addDays(d, 1)) days.push(d)
  return days
}

/** "Mon, 23 Nov" */
export function formatDay(iso: IsoDate): string {
  return fromIso(iso).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

/** "Mon, 23 Nov 2026", or "Mon, 28 Dec – Tue, 29 Dec 2026" for a range. */
export function formatDayRange(from: IsoDate, to: IsoDate = from): string {
  const year = fromIso(to).getFullYear()
  if (from === to) return `${formatDay(from)} ${year}`
  const fromYear = fromIso(from).getFullYear()
  return `${formatDay(from)}${fromYear === year ? '' : ` ${fromYear}`} – ${formatDay(to)} ${year}`
}

/** "01 Nov 2026" */
export function formatDate(iso: IsoDate): string {
  return fromIso(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

/** Minutes after midnight → "09:08 AM". */
export function formatClock(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = Math.floor(minutes % 60)
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

/** Minutes → "8:52". */
export function formatHours(minutes: number): string {
  return `${Math.floor(minutes / 60)}:${String(Math.floor(minutes % 60)).padStart(2, '0')}`
}

/** "HH:MM" from a time input → minutes after midnight. */
export function parseClock(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value)
  return match ? Number(match[1]) * 60 + Number(match[2]) : null
}

/** Minutes after midnight → "HH:MM" for a time input. */
export function toClockValue(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
}
