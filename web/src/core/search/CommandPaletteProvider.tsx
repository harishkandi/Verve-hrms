import { Command } from 'cmdk'
import { ArrowRight, House, LayoutGrid, Monitor, Moon, Search, Sun } from 'lucide-react'
import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { appHref, apps } from '@/core/apps/registry'
import { useTheme } from '@/core/theme/theme'
import { AppIcon } from '@/shared/ui/AppIcon'
import { Kbd } from '@/shared/ui/primitives'
import { CommandPaletteContext } from './commandPalette'

const itemClass =
  'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-fg data-[selected=true]:bg-surface-2'
const groupClass =
  '[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted'

/** Global search (⌘K / Ctrl+K): apps, quick actions, pages and settings. */
export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { setPreference } = useTheme()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const run = useCallback((action: () => void) => {
    setIsOpen(false)
    action()
  }, [])

  const ctx = useMemo(() => ({ open: () => setIsOpen(true) }), [])

  return (
    <CommandPaletteContext.Provider value={ctx}>
      {children}
      <Command.Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
        label="Search Verve HRMS"
        overlayClassName="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        contentClassName="fixed top-[12vh] left-1/2 z-50 w-[min(640px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-lg border border-border bg-surface shadow-pop"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 text-muted" aria-hidden />
          <Command.Input
            placeholder="Search apps, actions and pages…"
            className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
          />
          <Kbd>Esc</Kbd>
        </div>

        <Command.List className="max-h-[min(420px,60vh)] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-10 text-center text-sm text-muted">
            No results found.
          </Command.Empty>

          <Command.Group heading="Apps" className={groupClass}>
            {apps.map((app) => (
              <Command.Item
                key={app.id}
                value={`app ${app.name} ${app.category} ${app.tagline}`}
                onSelect={() => run(() => navigate(appHref(app)))}
                className={itemClass}
              >
                <AppIcon icon={app.icon} accent={app.accent} size="xs" />
                <span className="flex-1">{app.name}</span>
                <span className="text-xs text-muted">{app.category}</span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Quick actions" className={groupClass}>
            {apps.flatMap((app) =>
              app.quickActions.map((action) => (
                <Command.Item
                  key={`${app.id}-${action.label}`}
                  value={`action ${action.label} ${app.name}`}
                  onSelect={() => run(() => navigate(appHref(app, action.path)))}
                  className={itemClass}
                >
                  <action.icon className="size-4 text-muted" aria-hidden />
                  <span className="flex-1">{action.label}</span>
                  <span className="text-xs text-muted">{app.shortName}</span>
                </Command.Item>
              )),
            )}
          </Command.Group>

          <Command.Group heading="Go to" className={groupClass}>
            <Command.Item value="home dashboard" onSelect={() => run(() => navigate('/'))} className={itemClass}>
              <House className="size-4 text-muted" aria-hidden />
              <span className="flex-1">Home</span>
              <ArrowRight className="size-4 text-muted" aria-hidden />
            </Command.Item>
            <Command.Item value="all apps directory" onSelect={() => run(() => navigate('/apps'))} className={itemClass}>
              <LayoutGrid className="size-4 text-muted" aria-hidden />
              <span className="flex-1">All apps</span>
              <ArrowRight className="size-4 text-muted" aria-hidden />
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Theme" className={groupClass}>
            <Command.Item value="theme light mode" onSelect={() => run(() => setPreference('light'))} className={itemClass}>
              <Sun className="size-4 text-muted" aria-hidden />
              Light mode
            </Command.Item>
            <Command.Item value="theme dark mode" onSelect={() => run(() => setPreference('dark'))} className={itemClass}>
              <Moon className="size-4 text-muted" aria-hidden />
              Dark mode
            </Command.Item>
            <Command.Item value="theme system default" onSelect={() => run(() => setPreference('system'))} className={itemClass}>
              <Monitor className="size-4 text-muted" aria-hidden />
              Use system setting
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </CommandPaletteContext.Provider>
  )
}
