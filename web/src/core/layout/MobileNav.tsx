import { House, LayoutGrid, Search } from 'lucide-react'
import { NavLink } from 'react-router'
import { useCommandPalette } from '@/core/search/commandPalette'
import { cn } from '@/shared/lib/cn'

const itemClass = 'flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium'

/** Bottom tab bar on phones, like a native super-app. */
export function MobileNav() {
  const { open } = useCommandPalette()
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(itemClass, isActive ? 'text-primary' : 'text-muted')

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <NavLink to="/" end className={linkClass}>
        <House className="size-5" aria-hidden />
        Home
      </NavLink>
      <NavLink to="/apps" className={linkClass}>
        <LayoutGrid className="size-5" aria-hidden />
        Apps
      </NavLink>
      <button type="button" onClick={open} className={cn(itemClass, 'text-muted')}>
        <Search className="size-5" aria-hidden />
        Search
      </button>
    </nav>
  )
}
