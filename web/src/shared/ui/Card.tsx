import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('rounded-lg border border-border bg-surface shadow-card', className)}
      {...props}
    />
  )
}

/** Card with a title row: the standard dashboard panel. */
export function Panel({
  title,
  count,
  action,
  className,
  bodyClassName,
  children,
}: {
  title: string
  count?: number
  action?: ReactNode
  className?: string
  bodyClassName?: string
  children: ReactNode
}) {
  return (
    <Card className={cn('flex min-w-0 flex-col', className)}>
      <div className="flex items-center justify-between gap-3 px-5 pt-4">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold">
          {title}
          {count !== undefined && (
            <span className="inline-grid h-5 min-w-5 place-items-center rounded-full bg-primary-soft px-1.5 text-[11px] font-bold text-primary">
              {count}
            </span>
          )}
        </h2>
        {action && <div className="shrink-0 text-[13px] font-semibold text-primary">{action}</div>}
      </div>
      <div className={cn('flex-1 px-5 pt-3 pb-5', bodyClassName)}>{children}</div>
    </Card>
  )
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0 whitespace-nowrap">{action}</div>}
    </div>
  )
}
