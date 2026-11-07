import type { PageTab } from './Page'

/** Tabs under My Space (Home and the app directory). */
export const mySpaceTabs: PageTab[] = [
  { label: 'Overview', to: '/', end: true },
  { label: 'All apps', to: '/apps' },
]
