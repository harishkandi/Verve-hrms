import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

/** A labelled form row with a hint, or an error, underneath. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  className,
  children,
}: {
  label: string
  /** The control's id. Errors get the id `<htmlFor>-error` for aria-describedby. */
  htmlFor?: string
  hint?: ReactNode
  error?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-[13px] font-semibold text-fg">
        {label}
      </label>
      {children}
      {error ? (
        <p id={htmlFor && `${htmlFor}-error`} className="text-xs font-medium text-bad">
          {error}
        </p>
      ) : (
        hint && <div className="text-xs text-subtle">{hint}</div>
      )}
    </div>
  )
}

/** Pick one of a few options, shown as a joined row of buttons. Built on radio inputs. */
export function Segmented<T extends string>({
  name,
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  name: string
  /** Accessible name for the group. */
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
  disabled?: boolean
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn('flex rounded-md border border-border bg-surface-2 p-0.5', disabled && 'opacity-60')}
    >
      {options.map((o) => (
        <label key={o.value} className="flex-1">
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            disabled={disabled}
            onChange={() => onChange(o.value)}
            className="peer sr-only"
          />
          <span className="flex h-8 cursor-pointer items-center justify-center rounded-[5px] text-[13px] font-medium text-muted transition-colors peer-checked:bg-surface peer-checked:font-semibold peer-checked:text-primary peer-checked:shadow-card peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 peer-disabled:cursor-default">
            {o.label}
          </span>
        </label>
      ))}
    </div>
  )
}
