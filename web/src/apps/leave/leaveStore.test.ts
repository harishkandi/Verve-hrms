import { describe, expect, it } from 'vitest'
import { formatDayRange } from '@/shared/lib/date'
import { formatDays, leaveDays, nextWorkingDay } from './leaveStore'

describe('leave days', () => {
  it('counts working days only', () => {
    // Fri 20 Nov to Tue 24 Nov 2026: the weekend and Guru Nanak Jayanti (24th) are free.
    expect(leaveDays('2026-11-20', '2026-11-24', 'full')).toBe(2)
  })

  it('makes a single-day half session half a day', () => {
    expect(leaveDays('2026-11-23', '2026-11-23', 'first')).toBe(0.5)
    expect(formatDays(0.5)).toBe('Half a day')
  })

  it('is zero when the end is before the start', () => {
    expect(leaveDays('2026-11-25', '2026-11-23', 'full')).toBe(0)
  })

  it('skips weekends and holidays when suggesting the next day', () => {
    expect(nextWorkingDay('2026-11-20')).toBe('2026-11-23')
    expect(nextWorkingDay('2026-11-23')).toBe('2026-11-25')
  })
})

describe('date ranges', () => {
  it('shows the year once, or twice across a new year', () => {
    expect(formatDayRange('2026-12-28', '2026-12-29')).toBe('Mon, 28 Dec – Tue, 29 Dec 2026')
    expect(formatDayRange('2026-12-31', '2027-01-04')).toBe('Thu, 31 Dec 2026 – Mon, 4 Jan 2027')
  })
})
