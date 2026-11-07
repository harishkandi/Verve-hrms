import { type FormEvent, useState } from 'react'
import { useSession } from '@/core/session/session'
import { formatDayRange, todayIso } from '@/shared/lib/date'
import { Button } from '@/shared/ui/Button'
import { Field, Segmented } from '@/shared/ui/Field'
import { inputClass, textareaClass } from '@/shared/ui/inputClass'
import { Avatar } from '@/shared/ui/primitives'
import { SidePanel } from '@/shared/ui/SidePanel'
import {
  applyLeave,
  formatDays,
  type LeaveSession,
  type LeaveTypeId,
  leaveDays,
  nextWorkingDay,
  overlapsExisting,
  useLeaveBalances,
  useLeaveRequests,
} from '../leaveStore'

const FORM_ID = 'apply-leave'

export function ApplyLeavePanel({
  open,
  onOpenChange,
  onApplied,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called with a confirmation line after the request is sent. */
  onApplied: (message: string) => void
}) {
  return (
    <SidePanel
      open={open}
      onOpenChange={onOpenChange}
      title="Apply leave"
      description="Your manager is notified as soon as you submit."
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID}>
            Submit request
          </Button>
        </>
      }
    >
      {/* The form unmounts with the panel, so it starts fresh every time. */}
      <ApplyLeaveForm
        onDone={(message) => {
          onApplied(message)
          onOpenChange(false)
        }}
      />
    </SidePanel>
  )
}

const sessions: { value: LeaveSession; label: string }[] = [
  { value: 'full', label: 'Full day' },
  { value: 'first', label: 'First half' },
  { value: 'second', label: 'Second half' },
]

function ApplyLeaveForm({ onDone }: { onDone: (message: string) => void }) {
  const { user } = useSession()
  const requests = useLeaveRequests()
  const balances = useLeaveBalances()

  const [type, setType] = useState<LeaveTypeId>('casual')
  const [dates, setDates] = useState(() => {
    const first = nextWorkingDay(todayIso())
    return { from: first, to: first }
  })
  const [session, setSession] = useState<LeaveSession>('full')
  const [reason, setReason] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const { from, to } = dates
  const singleDay = from === to
  const effectiveSession = singleDay ? session : 'full'
  const days = leaveDays(from, to, effectiveSession)
  const balance = balances.find((b) => b.id === type) ?? balances[0]
  const left = balance.available === null ? null : balance.available - days

  // Date and balance problems show straight away; a missing reason only after Submit.
  let datesError: string | undefined
  if (!from || !to) datesError = 'Pick the dates.'
  else if (to < from) datesError = 'The end date is before the start date.'
  else if (days === 0) datesError = 'These dates are weekends or holidays, so there is nothing to apply for.'
  else if (overlapsExisting(requests, from, to)) datesError = 'You already have leave on some of these dates.'

  const typeError =
    !datesError && left !== null && left < 0
      ? `You have ${formatDays(balance.available ?? 0).toLowerCase()} of ${balance.name.toLowerCase()} left. Pick fewer days or another leave type.`
      : undefined
  const reasonError = reason.trim() ? undefined : 'Add a short reason for your manager.'

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (datesError || typeError || reasonError) return
    applyLeave({ type, from, to, session: effectiveSession, days, reason: reason.trim() })
    onDone(
      `${formatDays(days)} of ${balance.name.toLowerCase()} requested for ${formatDayRange(from, to)}. ${user.manager.fullName} has been notified.`,
    )
  }

  return (
    <form id={FORM_ID} onSubmit={submit} noValidate className="flex flex-col gap-5">
      <Field
        label="Leave type"
        htmlFor="leave-type"
        error={typeError}
        hint={
          balance.available === null ? (
            'Unpaid. Doesn’t use a balance.'
          ) : (
            <>
              <b className="font-semibold text-fg">{formatDays(balance.available)}</b> available
            </>
          )
        }
      >
        <select
          id="leave-type"
          value={type}
          onChange={(e) => setType(e.target.value as LeaveTypeId)}
          aria-invalid={Boolean(typeError)}
          aria-describedby={typeError ? 'leave-type-error' : undefined}
          className={inputClass}
        >
          {balances.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </Field>

      <div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="From" htmlFor="leave-from">
            <input
              id="leave-from"
              type="date"
              value={from}
              required
              onChange={(e) => {
                const value = e.target.value
                setDates((d) => ({ from: value, to: value && value > d.to ? value : d.to }))
              }}
              aria-invalid={Boolean(datesError)}
              aria-describedby={datesError ? 'leave-dates-error' : undefined}
              className={inputClass}
            />
          </Field>
          <Field label="To" htmlFor="leave-to">
            <input
              id="leave-to"
              type="date"
              value={to}
              min={from}
              required
              onChange={(e) => {
                const value = e.target.value
                setDates((d) => ({ ...d, to: value }))
              }}
              aria-invalid={Boolean(datesError)}
              aria-describedby={datesError ? 'leave-dates-error' : undefined}
              className={inputClass}
            />
          </Field>
        </div>
        {datesError && (
          <p id="leave-dates-error" className="mt-1.5 text-xs font-medium text-bad">
            {datesError}
          </p>
        )}
      </div>

      <Field
        label="Session"
        hint={singleDay ? 'First half ends at 2:00 PM.' : 'Half days are for single-day requests.'}
      >
        <Segmented
          name="leave-session"
          label="Session"
          value={effectiveSession}
          options={sessions}
          onChange={setSession}
          disabled={!singleDay}
        />
      </Field>

      <Field label="Reason" htmlFor="leave-reason" error={submitted ? reasonError : undefined}>
        <textarea
          id="leave-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={500}
          placeholder="For example, personal work at the bank"
          aria-invalid={submitted && Boolean(reasonError)}
          aria-describedby={submitted && reasonError ? 'leave-reason-error' : undefined}
          className={textareaClass}
        />
      </Field>

      <div className="flex flex-col gap-1.5">
        <p className="text-[13px] font-semibold">Notify</p>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 py-1 pr-3 pl-1 text-[13px] font-medium">
            <Avatar initials={user.manager.initials} tone="teal" size="xs" />
            {user.manager.fullName}
          </span>
          <span className="text-xs text-subtle">Manager, always notified</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-lg border border-primary/15 bg-primary-soft px-4 py-3.5">
        <div className="min-w-0">
          <p className="text-lg font-semibold text-primary tabular-nums">{formatDays(days)}</p>
          <p className="truncate text-xs text-muted">
            {balance.name}
            {from && to && to >= from && ` · ${formatDayRange(from, to)}`}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg font-semibold tabular-nums">
            {left === null ? 'Unpaid' : formatDays(Math.max(left, 0))}
          </p>
          <p className="text-xs text-muted">{left === null ? 'no balance used' : 'left after this'}</p>
        </div>
      </div>
    </form>
  )
}
