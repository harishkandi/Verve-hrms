import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { get, getToken, post, setToken } from './api'
import type { Me } from './types'

/**
 * Who is signed in to the Reimbursement API.
 *
 * TEMPORARY: the portal's login (Phase 1) isn't built yet, so this app signs in
 * with the API's dev-only `/auth/dev-login`. When portal login lands, replace this
 * with the portal session and delete the dev sign-in screen.
 */
interface AuthState {
  me: Me | null
  loading: boolean
  signIn: (email: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null)
  const [loading, setLoading] = useState(Boolean(getToken()))

  useEffect(() => {
    if (!getToken()) return
    get<Me>('/auth/me')
      .then(setMe)
      .catch(() => setMe(null))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    // api.ts fires this when the server rejects the token.
    const onSignedOut = () => setMe(null)
    window.addEventListener('reimb:signed-out', onSignedOut)
    return () => window.removeEventListener('reimb:signed-out', onSignedOut)
  }, [])

  const signIn = useCallback(async (email: string) => {
    const res = await post<{ access_token: string; user: Me }>('/auth/dev-login', { email })
    setToken(res.access_token)
    setMe(res.user)
  }, [])

  const signOut = useCallback(() => {
    setToken(null)
    setMe(null)
  }, [])

  return (
    <AuthContext.Provider value={{ me, loading, signIn, signOut }}>{children}</AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth outside AuthProvider')
  return ctx
}

/** The signed-in user; only call inside pages rendered after sign-in. */
export function useMe(): Me {
  const { me } = useAuth()
  if (!me) throw new Error('useMe without a signed-in user')
  return me
}

export function roleOf(me: Me): string {
  if (me.is_admin) return 'Admin'
  if (me.can_verify || me.can_pay) return 'Accounts'
  if (me.is_approver) return 'Manager'
  return 'Employee'
}
