import { Loader2 } from 'lucide-react'
import type { ComponentProps } from 'react'
import { buttonClass, type ButtonSize, type ButtonVariant } from './buttonClass'

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Shows a spinner and blocks clicks, e.g. while a form submits. */
  loading?: boolean
}

/** The one button for the whole portal. */
export function Button({
  variant,
  size,
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClass({ variant, size, className })}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" aria-hidden />}
      {children}
    </button>
  )
}
