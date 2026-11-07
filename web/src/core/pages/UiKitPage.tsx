import { Plus, Send, Trash2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Page, PageTitle } from '@/core/layout/Page'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'

/**
 * Internal showcase of the shared UI components. Each new component gets a
 * section here so we can see every variant in light and dark mode.
 */
export function UiKitPage() {
  return (
    <Page width="narrow">
      <PageTitle title="UI kit" lead="The building blocks every Verve screen is made from." />
      <ButtonDemo />
    </Page>
  )
}

function Section({ title, use, children }: { title: string; use: string; children: ReactNode }) {
  return (
    <Card className="p-6">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      <p className="mt-0.5 text-sm text-muted">{use}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </Card>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="w-24 shrink-0 text-xs font-medium tracking-wide text-muted uppercase">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

function ButtonDemo() {
  const [saving, setSaving] = useState(false)
  const save = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 1500)
  }

  return (
    <Section title="Button" use="Any action a user can take: submit, approve, cancel, delete.">
      <Row label="Variants">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="checkout">Check out</Button>
      </Row>
      <Row label="Sizes">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </Row>
      <Row label="With icon">
        <Button>
          <Plus aria-hidden /> New request
        </Button>
        <Button variant="secondary">
          <Send aria-hidden /> Submit
        </Button>
        <Button variant="danger">
          <Trash2 aria-hidden /> Delete
        </Button>
      </Row>
      <Row label="States">
        <Button loading={saving} onClick={save}>
          {saving ? 'Saving…' : 'Click to save'}
        </Button>
        <Button disabled>Disabled</Button>
      </Row>
    </Section>
  )
}
