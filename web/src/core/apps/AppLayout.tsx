import { useEffect } from 'react'
import { Outlet } from 'react-router'
import { Page } from '@/core/layout/Page'
import { AppIcon } from '@/shared/ui/AppIcon'
import { markOpened } from './appPrefs'
import { CurrentAppContext } from './currentApp'
import { PinButton } from './PinButton'
import { appHref } from './registry'
import type { AppManifest } from './types'

/** Frame around every app: the app's name and tabs in the tab row, then the app's own page. */
export function AppLayout({ app }: { app: AppManifest }) {
  useEffect(() => markOpened(app.id), [app.id])

  return (
    <CurrentAppContext.Provider value={app}>
      <Page
        leading={
          <>
            <AppIcon icon={app.icon} size="xs" />
            <span className="text-sm font-semibold whitespace-nowrap">{app.name}</span>
          </>
        }
        tabs={app.nav.map((item) => ({
          label: item.label,
          to: appHref(app, item.path),
          end: item.path === '',
        }))}
        actions={<PinButton app={app} />}
      >
        <Outlet />
      </Page>
    </CurrentAppContext.Provider>
  )
}
