/**
 * Talks to the Reimbursement API.
 *
 * Until this app's API moves into verve-hrms (`/api/v1/reimbursement`), it runs
 * as its own FastAPI server on :8000 and serves everything under `/api`.
 * Change BASE in one place when that move happens.
 */
import { isPreview } from '@/shared/lib/env'
import { previewRespond } from './previewApi'

const BASE = '/api'
const TOKEN_KEY = 'reimb_token'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Storage can be blocked (private mode); the session then lasts until reload.
  }
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function errorFrom(res: Response): Promise<ApiError> {
  let message = `Request failed (${res.status})`
  try {
    const body = await res.json()
    if (typeof body.detail === 'string') message = body.detail
    // FastAPI validation errors come back as a list.
    else if (Array.isArray(body.detail) && body.detail[0]?.msg) {
      const first = body.detail[0]
      const field = Array.isArray(first.loc) ? first.loc[first.loc.length - 1] : ''
      message = field ? `${field}: ${first.msg}` : first.msg
    }
  } catch {
    /* not JSON */
  }
  if (res.status === 401) {
    setToken(null)
    window.dispatchEvent(new Event('reimb:signed-out'))
  }
  return new ApiError(res.status, message)
}

export async function api<T>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const { json, headers, ...rest } = init
  if (isPreview) {
    const r = previewRespond(path, (rest.method ?? 'GET').toUpperCase(), json, getToken())
    if (r.status >= 400) {
      if (r.status === 401) {
        setToken(null)
        window.dispatchEvent(new Event('reimb:signed-out'))
      }
      throw new ApiError(r.status, (r.body as { detail: string }).detail)
    }
    return r.body as T
  }
  const res = await fetch(BASE + path, {
    ...rest,
    headers: {
      ...authHeaders(),
      ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(headers as Record<string, string>),
    },
    body: json !== undefined ? JSON.stringify(json) : init.body,
  })
  if (!res.ok) throw await errorFrom(res)
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const get = <T>(path: string) => api<T>(path)
export const post = <T>(path: string, json?: unknown) =>
  api<T>(path, { method: 'POST', json: json ?? {} })
export const put = <T>(path: string, json: unknown) => api<T>(path, { method: 'PUT', json })
export const del = <T>(path: string) => api<T>(path, { method: 'DELETE' })

export async function upload<T>(path: string, file: File): Promise<T> {
  const form = new FormData()
  form.append('file', file)
  return api<T>(path, { method: 'POST', body: form })
}

/** Fetches a protected file (bills, exports) with the auth header. */
export async function fetchBlob(path: string): Promise<Blob> {
  if (isPreview) throw new ApiError(404, 'Files aren’t available in the preview.')
  const res = await fetch(BASE + path, { headers: authHeaders() })
  if (!res.ok) throw await errorFrom(res)
  return res.blob()
}
