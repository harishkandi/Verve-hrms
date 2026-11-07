import { type FormEvent, useState } from 'react'
import { useSession } from '@/core/session/session'
import { addDays, formatClock, formatDayRange, type IsoDate, parseClock, todayIso, toClockValue } from '@/shared/lib/date'
import { Button } from '@/shared/ui/Button'
import { Field } from '@/shared/ui/Field'
import { inputClass, textareaClass } from '@/shared/ui/inputClass'
import { SidePanel } from '@/shared/ui/SidePanel'
import { dayRecord, requestRegularization, shift, useRegularizations } from '../attendanceData'

const FORM_ID = 'regularize'
/** How far back a correction can go. */
const WINDOW_DAYS = 30

export function RegularizePanel({
  open,
  onOpenChange,
  date,
  onDone,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Day to start on; defaults to the last working day. */
  date?: IsoDate
  onDone: (message: string) => void
}) {
  return (
    <SidePanel
      open={open}
      onOpenChange={onOpenChange}
      title="Regularize attendance"
      description="Fix a missed or wrong check-in. Your manager approves it."
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID}>
            Send for approval
          </Button>
        </>
      }
    >
      <RegularizeForm
        initialDate={date}
        onDone={(message) => {
          onDone(message)
          onOpenChange(false)
        }}
      />
    </SidePanel>
  )
}

function lastWorkingDay(today: IsoDate): IsoDate {
  let d = addDays(today, -1)
  while (dayRecord(d, today, []).kind !== 'present') d = addDays(d, -1)
  return d
}

function RegularizeForm({ initialDate, onDone }: { initialDate?: IsoDate; onDone: (message: string) => void }) {
  const { user } = useSession()
  const regularizations = useRegularizations()
  const today = todayIso()
  const yesterday = addDays(today, -1)
  const earliest = addDays(today, -WINDOW_DAYS)

  const timesFor = (date: IsoDate) => {
    const approved = regularizations.filter((r) => r.status === 'approved')
    const record = dayRecord(date, today, approved)
    return record.kind === 'present'
      ? { checkIn: toClockValue(record.checkIn), checkOut: toClockValue(record.checkOut) }
      : { checkIn: toClockValue(shift.start), checkOut: toClockValue(shift.end) }
  }

  const [form, setForm] = useState(() => {
    const date = initialDate && initialDate <= yesterday ? initialDate : lastWorkingDay(today)
    return { date, ...timesFor(date), reason: '' }
  })
  const [submitted, setSubmitted] = useState(false)

  const checkIn = parseClock(form.checkIn)
  const checkOut = parseClock(form.checkOut)

  let dateError: string | undefined
  if (!form.date) dateError = 'Pick a date.'
  else if (form.date > yesterday) dateError = 'You can only correct days that have passed.'
  else if (form.date < earliest) dateError = `Corrections are allowed for the last ${WINDOW_DAYS} days.`
  else if (dayRecord(form.date, today, []).kind !== 'present')
    dateError = 'That day is a weekend or holiday, so there is nothing to correct.'
  else if (regularizations.some((r) => r.date === form.date && r.status === 'pending'))
    dateError = 'You already have a correction waiting for this day.'

  const timeError =
    checkIn === null || checkOut === null
      ? 'Enter both times.'
      : checkOut <= checkIn
        ? 'Check-out must be after check-in.'
        : undefined
  const reasonError = form.reason.trim() ? undefined : 'Tell your manager what happened.'

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (dateError || timeError || reasonError || checkIn === null || checkOut === null) return
    requestRegularization({ date: form.date, checkIn, checkOut, reason: form.reason.trim() })
    onDone(
      `Correction for ${formatDayRange(form.date)} (${formatClock(checkIn)} – ${formatClock(checkOut)}) sent to ${user.manager.fullName}.`,
    )
  }

  return (
    <form id={FORM_ID} onSubmit={submit} noValidate className="flex flex-col gap-5">
      <Field label="Date" htmlFor="reg-date" error={dateError} hint={`Up to ${WINDOW_DAYS} days back.`}>
        <input
          id="reg-date"
          type="date"
          value={form.date}
          min={earliest}
          max={yesterday}
          onChange={(e) => {
            const date = e.target.value
            setForm((f) => ({ ...f, date, ...(date ? timesFor(date) : {}) }))
          }}
          aria-invalid={Boolean(dateError)}
          aria-describedby={dateError ? 'reg-date-error' : undefined}
          className={inputClass}
        />
      </Field>

      <div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Check-in" htmlFor="reg-in">
            <input
              id="reg-in"
              type="time"
              value={form.checkIn}
              onChange={(e) => setForm((f) => ({ ...f, checkIn: e.target.value }))}
              aria-invalid={Boolean(timeError)}
              aria-describedby={timeError ? 'reg-time-error' : undefined}
              className={inputClass}
            />
          </Field>
          <Field label="Check-out" htmlFor="reg-out">
            <input
              id="reg-out"
              type="time"
              value={form.checkOut}
              onChange={(e) => setForm((f) => ({ ...f, checkOut: e.target.value }))}
              aria-invalid={Boolean(timeError)}
              aria-describedby={timeError ? 'reg-time-error' : undefined}
              className={inputClass}
            />
          </Field>
        </div>
        {timeError ? (
          <p id="reg-time-error" className="mt-1.5 text-xs font-medium text-bad">
            {timeError}
          </p>
        ) : (
          <p className="mt-1.5 text-xs text-subtle">The times as they should be. They start from what was recorded.</p>
        )}
      </div>

      <Field label="Reason" htmlFor="reg-reason" error={submitted ? reasonError : undefined}>
        <textarea
          id="reg-reason"
          value={form.reason}
          onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
          maxLength={500}
          placeholder="For example, forgot to check out after the client call"
          aria-invalid={submitted && Boolean(reasonError)}
          aria-describedby={submitted && reasonError ? 'reg-reason-error' : undefined}
          className={textareaClass}
        />
      </Field>
    </form>
  )
}
