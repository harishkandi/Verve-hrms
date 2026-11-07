import { useEffect, useState } from 'react'
import { createStore } from '@/shared/lib/store'

/**
 * SAMPLE: today's check-in, until the Attendance API exists. Home and the
 * Attendance app share this, so checking out in one shows in the other.
 */
export const todayCheckIn = { minutes: 9 * 60 + 12, source: 'Web' }

interface ClockState {
  /** "05:48 PM" once checked out; `null` while checked in. */
  checkedOutAt: string | null
  /** Seconds worked before `since`. */
  bankedSeconds: number
  since: number
}

const store = createStore<ClockState>({
  checkedOutAt: null,
  bankedSeconds: 348 * 60,
  since: Date.now(),
})

export function useCheckClock() {
  const state = store.useStore()
  const checkedIn = state.checkedOutAt === null
  const [now, setNow] = useState(Date.now)

  useEffect(() => {
    if (!checkedIn) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [checkedIn])

  const seconds = state.bankedSeconds + (checkedIn ? Math.max(0, Math.floor((now - state.since) / 1000)) : 0)

  const toggle = () => {
    const at = Date.now()
    store.set((s) =>
      s.checkedOutAt === null
        ? {
            checkedOutAt: new Date(at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            bankedSeconds: s.bankedSeconds + Math.floor((at - s.since) / 1000),
            since: at,
          }
        : { ...s, checkedOutAt: null, since: at },
    )
  }

  return { checkedIn, checkedOutAt: state.checkedOutAt, seconds, toggle }
}

/** 20892 → ["05", "48", "12"] */
export function timerParts(seconds: number): [string, string, string] {
  const pad = (n: number) => String(n).padStart(2, '0')
  return [pad(Math.floor(seconds / 3600)), pad(Math.floor(seconds / 60) % 60), pad(seconds % 60)]
}
