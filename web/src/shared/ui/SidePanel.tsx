import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * Forms open in this panel from the right, over the page, so you keep your
 * place: apply leave, regularize attendance, and later new claims.
 */
export function SidePanel({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  /** One line under the title. */
  description?: ReactNode
  footer?: ReactNode
  children: ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-navy/45 motion-safe:animate-fade-in" />
        <Dialog.Content
          // Without a description Radix expects this to be set explicitly.
          {...(description ? {} : { 'aria-describedby': undefined })}
          // Start on the first field rather than the close button.
          onOpenAutoFocus={(e) => {
            const first = (e.currentTarget as HTMLElement).querySelector<HTMLElement>('input, select, textarea')
            if (first) {
              e.preventDefault()
              first.focus()
            }
          }}
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col border-l border-border bg-surface shadow-pop outline-none motion-safe:animate-panel-in"
        >
          <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
            <div className="min-w-0">
              <Dialog.Title className="font-serif text-xl font-semibold">{title}</Dialog.Title>
              {description && (
                <Dialog.Description className="mt-0.5 text-sm text-muted">{description}</Dialog.Description>
              )}
            </div>
            <Dialog.Close
              aria-label="Close"
              className="-mr-2 inline-grid size-9 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <X className="size-4.5" aria-hidden />
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
          {footer && (
            <div className="flex justify-end gap-2 border-t border-border bg-surface-2 px-6 py-3.5">{footer}</div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
