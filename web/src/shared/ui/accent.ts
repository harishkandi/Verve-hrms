/**
 * Each app has one accent color. Class names are written out in full so
 * Tailwind can find them at build time — never build them with string concatenation.
 */
export type Accent = 'sky' | 'violet' | 'emerald' | 'amber' | 'blue' | 'rose'

interface AccentClasses {
  /** Gradient fill for app icon tiles. */
  tile: string
  /** Soft tinted background + matching text, for chips and highlights. */
  soft: string
  /** Solid fill for progress bars and dots. */
  solid: string
  /** Text color only. */
  text: string
}

export const accents: Record<Accent, AccentClasses> = {
  sky: {
    tile: 'bg-linear-to-br from-sky-400 to-cyan-600',
    soft: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    solid: 'bg-sky-500',
    text: 'text-sky-600 dark:text-sky-400',
  },
  violet: {
    tile: 'bg-linear-to-br from-violet-500 to-purple-700',
    soft: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
    solid: 'bg-violet-500',
    text: 'text-violet-600 dark:text-violet-400',
  },
  emerald: {
    tile: 'bg-linear-to-br from-emerald-400 to-teal-600',
    soft: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    solid: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  amber: {
    tile: 'bg-linear-to-br from-amber-400 to-orange-500',
    soft: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    solid: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
  },
  blue: {
    tile: 'bg-linear-to-br from-blue-500 to-indigo-700',
    soft: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
    solid: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
  },
  rose: {
    tile: 'bg-linear-to-br from-rose-400 to-pink-600',
    soft: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
    solid: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
  },
}
