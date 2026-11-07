import { createContext, useContext } from 'react'
import type { AppManifest } from './types'

export const CurrentAppContext = createContext<AppManifest | null>(null)

/** The manifest of the app whose page is being rendered. Use inside app pages. */
export function useCurrentApp(): AppManifest {
  const app = useContext(CurrentAppContext)
  if (!app) throw new Error('useCurrentApp must be used inside an app route')
  return app
}
