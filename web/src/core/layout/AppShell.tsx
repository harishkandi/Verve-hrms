import { Outlet, ScrollRestoration } from 'react-router'
import { CommandPaletteProvider } from '@/core/search/CommandPaletteProvider'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

/** Portal frame shared by every page: navy module bar, top bar, content and mobile tab bar. */
export function AppShell() {
  return (
    <CommandPaletteProvider>
      <div className="flex min-h-svh">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1 pb-20 md:pb-0">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileNav />
      <ScrollRestoration />
    </CommandPaletteProvider>
  )
}
