import type { AppCategory } from '@/core/apps/types'
import type { Accent } from '@/shared/ui/accent'

/**
 * Side bar look: one colour per app, tuned to read on the navy rail in both
 * themes. Apps not listed here fall back to a colour from their accent.
 */
const colorById: Record<string, string> = {
  home: '#d9b67a',
  leave: '#5ec8f0',
  attendance: '#7c9cff',
  reimbursement: '#f4b860',
  pms: '#b79bff',
  vervefit: '#ff7a90',
  onboarding: '#4fd3a0',
  exit: '#ff9466',
  apps: '#c9d3e6',
}

const colorByAccent: Record<Accent, string> = {
  sky: '#5ec8f0',
  violet: '#b79bff',
  emerald: '#4fd3a0',
  amber: '#f4b860',
  blue: '#7c9cff',
  rose: '#ff7a90',
}

export function railColor(id: string, accent?: Accent): string {
  return colorById[id] ?? (accent ? colorByAccent[accent] : colorById.apps)
}

/** Side bar order after pinned apps: apps are listed by category in this order. */
export const railGroups: AppCategory[][] = [
  ['Time', 'Finance'],
  ['Performance', 'Wellbeing'],
  ['People'],
]

/** SAMPLE: things that need you, shown as a red count on the app. */
export const railBadges: Record<string, { count: number; label: string }> = {
  pms: { count: 1, label: 'self review due' },
}
