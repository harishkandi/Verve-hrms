import { createBrowserRouter } from 'react-router'
import { AppLayout } from './apps/AppLayout'
import { apps } from './apps/registry'
import { AppShell } from './layout/AppShell'
import { AppsPage } from './pages/AppsPage'
import { HomePage } from './pages/HomePage'
import { AppPageNotBuilt, NotFoundPage } from './pages/NotFoundPage'
import { SpacePage } from './pages/SpacePage'
import { UiKitPage } from './pages/UiKitPage'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'apps', element: <AppsPage /> },
      { path: 'ui', element: <UiKitPage /> },
      { path: 'team', element: <SpacePage space="Team" /> },
      { path: 'organization', element: <SpacePage space="Organization" /> },
      ...apps.map((app) => ({
        path: app.id,
        element: <AppLayout app={app} />,
        children: [...app.routes, { path: '*', element: <AppPageNotBuilt /> }],
      })),
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
