import { createContext, useContext } from 'react'

export const CommandPaletteContext = createContext<{ open: () => void } | null>(null)

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext)
  if (!ctx) throw new Error('useCommandPalette must be used inside <CommandPaletteProvider>')
  return ctx
}
