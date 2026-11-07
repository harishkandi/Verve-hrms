import type { LucideIcon } from 'lucide-react'
import type { RouteObject } from 'react-router'
import type { Accent } from '@/shared/ui/accent'

export type AppCategory = 'People' | 'Performance' | 'Time' | 'Finance' | 'Wellbeing'

/** A tab in the app's header. `path` is relative to the app root ('' = app home). */
export interface AppNavItem {
  label: string
  path: string
}

/** A one-tap shortcut shown on the home screen and in search. */
export interface AppQuickAction {
  label: string
  path: string
  icon: LucideIcon
}

/**
 * The contract every Verve app exports from `src/apps/<id>/index.tsx`.
 * The portal reads these manifests to build the launcher, sidebar, search,
 * quick actions and routes, so adding an app never requires editing portal code.
 */
export interface AppManifest {
  /** Unique id; also the URL prefix (`/<id>`) and API prefix (`/api/v1/<id>`). */
  id: string
  name: string
  /** Short label for tight spaces (mobile, switcher). */
  shortName: string
  /** One line, shown on app tiles. */
  tagline: string
  /** One or two sentences, shown in the app directory. */
  description: string
  icon: LucideIcon
  accent: Accent
  category: AppCategory
  /** Permission a user needs to see and open the app, e.g. `pms.open`. */
  permission: string
  /** Tabs shown in the app header. */
  nav: AppNavItem[]
  quickActions: AppQuickAction[]
  /** Routes relative to `/<id>`. Use `index: true` for the app's home page. */
  routes: RouteObject[]
}
