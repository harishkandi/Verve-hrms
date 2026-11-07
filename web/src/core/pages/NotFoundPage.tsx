import { Link } from 'react-router'
import { AppComingSoon } from '@/core/apps/AppComingSoon'
import { Page } from '@/core/layout/Page'
import { buttonClass } from '@/shared/ui/buttonClass'
import { Card } from '@/shared/ui/Card'

/** Unknown portal URL. */
export function NotFoundPage() {
  return (
    <Page width="narrow">
      <Card className="mx-auto max-w-md p-10 text-center">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="mt-2 font-serif text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted">The page you're looking for doesn't exist.</p>
        <Link to="/" className={buttonClass({ className: 'mt-6' })}>
          Back to home
        </Link>
      </Card>
    </Page>
  )
}

/** Unknown URL inside an app (e.g. a tab that isn't built yet). */
export function AppPageNotBuilt() {
  return <AppComingSoon />
}
