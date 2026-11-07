import { useSyncExternalStore } from 'react'

/**
 * Per-browser app preferences: pinned apps and recently opened apps.
 * A convenience only — kept in localStorage and safe if storage is unavailable.
 * (Could move to the user's profile on the server in a later phase.)
 */
interface AppPrefs {
  pinned: string[]
  recent: string[]
}

const STORAGE_KEY = 'verve.appPrefs'
const MAX_RECENT = 6
const DEFAULT_PREFS: AppPrefs = { pinned: ['attendance', 'reimbursement'], recent: [] }

function load(): AppPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppPrefs>
      return {
        pinned: Array.isArray(parsed.pinned) ? parsed.pinned : DEFAULT_PREFS.pinned,
        recent: Array.isArray(parsed.recent) ? parsed.recent : [],
      }
    }
  } catch {
    // Fall through to defaults.
  }
  return DEFAULT_PREFS
}

let state: AppPrefs = load()
const listeners = new Set<() => void>()

function update(next: AppPrefs) {
  state = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Ignore — preferences still apply until the page reloads.
  }
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function togglePinned(id: string) {
  const pinned = state.pinned.includes(id)
    ? state.pinned.filter((p) => p !== id)
    : [...state.pinned, id]
  update({ ...state, pinned })
}

export function markOpened(id: string) {
  if (state.recent[0] === id) return
  update({ ...state, recent: [id, ...state.recent.filter((r) => r !== id)].slice(0, MAX_RECENT) })
}

export function useAppPrefs(): AppPrefs {
  return useSyncExternalStore(subscribe, () => state)
}
