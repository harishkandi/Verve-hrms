import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/core/theme/theme'
import { IconButton } from '@/shared/ui/primitives'

/** One-click light/dark switch for the top bar. "System" stays available in the account menu. */
export function ThemeToggle() {
  const { resolved, setPreference } = useTheme()
  const next = resolved === 'dark' ? 'light' : 'dark'

  return (
    <IconButton aria-label={`Switch to ${next} theme`} onClick={() => setPreference(next)}>
      {resolved === 'dark' ? (
        <Sun className="size-5" aria-hidden />
      ) : (
        <Moon className="size-5" aria-hidden />
      )}
    </IconButton>
  )
}
