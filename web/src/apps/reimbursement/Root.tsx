import { FlaskConical, LogOut } from 'lucide-react'
import { useState } from 'react'
import { Outlet } from 'react-router'
import { Card } from '@/shared/ui/Card'
import { Avatar } from '@/shared/ui/primitives'
import { ErrorNote, SkeletonRows } from './components/ui'
import { get } from './lib/api'
import { AuthProvider, roleOf, useAuth } from './lib/auth'
import { initials } from './lib/format'
import type { UserBrief } from './lib/types'
import { useLoad } from './lib/useLoad'

/** Wraps every Reimbursement page: provides the API session, or asks to sign in. */
export function Root() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}

function Gate() {
  const { me, loading, signOut } = useAuth()
  if (loading) {
    return (
      <Card>
        <SkeletonRows />
      </Card>
    )
  }
  if (!me) return <DevSignIn />
  return (
    <>
      {/* TEMPORARY until portal login: shows which test user you are and lets you switch. */}
      <div className="mb-5 flex justify-end">
        <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-surface py-1 pr-1 pl-1.5 text-xs shadow-card">
          <Avatar initials={initials(me.name)} size="xs" />
          <span className="min-w-0 truncate text-muted">
            Test user <span className="font-semibold text-fg">{me.name}</span> · {roleOf(me)}
          </span>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 font-medium text-fg transition-colors hover:bg-border"
          >
            <LogOut className="size-3" aria-hidden /> Switch
          </button>
        </div>
      </div>
      <Outlet />
    </>
  )
}

type DevUser = UserBrief & { role: string }

function DevSignIn() {
  const { signIn } = useAuth()
  const { data: users, error: loadError } = useLoad(() => get<DevUser[]>('/auth/dev-users'))
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function go(email: string) {
    setBusy(email)
    setError(null)
    try {
      await signIn(email)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted uppercase">
        <FlaskConical className="size-4" aria-hidden /> Test sign-in
      </div>
      <h2 className="mt-3 font-brand text-xl font-semibold tracking-tight">
        Choose who you want to be
      </h2>
      <p className="mt-1 max-w-xl text-sm text-muted">
        Portal login isn't built yet. Pick a test user to see the app as an employee, manager,
        Accounts or admin.
      </p>
      <div className="mt-5">
        <ErrorNote
          error={
            error ??
            (loadError && `Can't reach the Reimbursement API on port 8000 (${loadError}).`)
          }
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {(users ?? []).map((u) => (
          <button
            key={u.id}
            type="button"
            disabled={busy !== null}
            onClick={() => go(u.email)}
            className="flex items-center gap-3 rounded-md border border-border bg-surface px-3 py-2.5 text-left transition hover:bg-surface-2 disabled:opacity-60"
          >
            <Avatar initials={initials(u.name)} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{u.name}</div>
              <div className="truncate text-xs text-muted">{u.role}</div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  )
}
