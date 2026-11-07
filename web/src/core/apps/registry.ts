import attendance from '@/apps/attendance'
import exit from '@/apps/exit'
import leave from '@/apps/leave'
import onboarding from '@/apps/onboarding'
import pms from '@/apps/pms'
import reimbursement from '@/apps/reimbursement'
import vervefit from '@/apps/vervefit'
import type { AppManifest } from './types'

/** Every app plugged into the portal. Order = default order in the launcher. */
export const apps: AppManifest[] = [leave, attendance, pms, reimbursement, vervefit, onboarding, exit]

export function getApp(id: string): AppManifest | undefined {
  return apps.find((app) => app.id === id)
}

/**
 * Build an absolute URL for a path inside an app. A path that starts with `?`
 * stays on the app home, e.g. `?apply=1` opens the Apply leave panel.
 */
export function appHref(app: AppManifest, path = ''): string {
  if (!path) return `/${app.id}`
  return path.startsWith('?') ? `/${app.id}${path}` : `/${app.id}/${path}`
}
