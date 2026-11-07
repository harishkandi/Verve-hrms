import { useSyncExternalStore } from 'react'

/**
 * A tiny in-memory store that components can subscribe to.
 * SAMPLE: holds demo data that should survive moving between pages until the
 * real APIs exist. State resets when the page reloads.
 */
export function createStore<T>(initial: T) {
  let state = initial
  const listeners = new Set<() => void>()

  const get = () => state
  const set = (next: T | ((prev: T) => T)) => {
    state = typeof next === 'function' ? (next as (prev: T) => T)(state) : next
    for (const listener of listeners) listener()
  }
  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }
  const useStore = () => useSyncExternalStore(subscribe, get, get)

  return { get, set, useStore }
}
