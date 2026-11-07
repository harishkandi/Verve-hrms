import { CheckCircle2, Hammer } from 'lucide-react'
import { Card } from '@/shared/ui/Card'
import { useCurrentApp } from './currentApp'

/**
 * Placeholder shown until an app's team builds the real page.
 * Pass `features` to show what's planned; omit it for sub-pages.
 */
export function AppComingSoon({ features }: { features?: string[] }) {
  const app = useCurrentApp()

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-warn-soft px-2.5 py-1 text-xs font-semibold text-warn"
          >
            <Hammer className="size-3.5" aria-hidden />
            In development
          </span>
          <h2 className="mt-4 font-serif text-2xl font-semibold">
            {app.name} is being built
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{app.description}</p>
        </div>

        {features && features.length > 0 && (
          <div>
            <h3 className="eyebrow">
              What's coming
            </h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 rounded-md border border-border-soft bg-surface-2 px-3 py-2.5 text-sm"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  )
}
