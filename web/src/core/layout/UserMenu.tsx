import * as Menu from '@radix-ui/react-dropdown-menu'
import { Check, LogOut, Monitor, Moon, Settings, Sun, User } from 'lucide-react'
import type { ReactNode } from 'react'
import { useSession } from '@/core/session/session'
import { type ThemePreference, useTheme } from '@/core/theme/theme'
import { Avatar, Badge } from '@/shared/ui/primitives'

const itemClass =
  'flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none data-[disabled]:cursor-default data-[disabled]:opacity-50 data-[highlighted]:bg-surface-2'

const themes: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export function UserMenu() {
  const { user } = useSession()
  const { preference, setPreference } = useTheme()

  return (
    <Menu.Root>
      <Menu.Trigger
        className="ml-2 flex items-center gap-2.5 rounded-md py-1 pr-2 pl-1 text-left transition-colors hover:bg-surface-2 xl:border-l xl:border-border xl:pl-3"
        aria-label="Account menu"
      >
        <Avatar initials={user.initials} size="sm" />
        <span className="hidden leading-tight xl:block">
          <span className="block text-[13px] font-semibold">{user.fullName}</span>
          <span className="block text-[11px] text-subtle">{user.employeeId}</span>
        </span>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-64 rounded-lg border border-border bg-surface p-1.5 shadow-pop"
        >
          <div className="flex items-center gap-3 px-2.5 py-2.5">
            <Avatar initials={user.initials} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.fullName}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-1.5 px-2.5 pb-2">
            <Badge>{user.role}</Badge>
            <Badge>{user.department}</Badge>
          </div>

          <Menu.Separator className="my-1 h-px bg-border" />
          <Menu.Item disabled className={itemClass}>
            <User className="size-4 text-muted" aria-hidden /> My profile <Soon />
          </Menu.Item>
          <Menu.Item disabled className={itemClass}>
            <Settings className="size-4 text-muted" aria-hidden /> Settings <Soon />
          </Menu.Item>

          <Menu.Separator className="my-1 h-px bg-border" />
          <Menu.Label className="px-2.5 pt-1.5 pb-1 text-xs font-medium text-muted">Theme</Menu.Label>
          <Menu.RadioGroup
            value={preference}
            onValueChange={(v) => setPreference(v as ThemePreference)}
          >
            {themes.map(({ value, label, icon: Icon }) => (
              <Menu.RadioItem key={value} value={value} className={itemClass}>
                <Icon className="size-4 text-muted" aria-hidden />
                <span className="flex-1">{label}</span>
                <Menu.ItemIndicator>
                  <Check className="size-4 text-primary" aria-hidden />
                </Menu.ItemIndicator>
              </Menu.RadioItem>
            ))}
          </Menu.RadioGroup>

          <Menu.Separator className="my-1 h-px bg-border" />
          <Menu.Item disabled className={itemClass}>
            <LogOut className="size-4 text-muted" aria-hidden /> Sign out <Soon />
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  )
}

function Soon(): ReactNode {
  return <span className="ml-auto text-[11px] text-muted">Phase 1</span>
}
