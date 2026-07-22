import { clearSession, isTokenExpired, readToken } from '../auth/session'

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1'

const rateBuckets = new Map()

// ──────────────────────────────────────────────
//  Access token (new token rotation system)
//  Primary: in-memory (cleared on page refresh).
//  Backup: sessionStorage (survives page refresh, cleared when tab closes).
//  The refresh token (HttpOnly cookie) is the real session — the access token
//  is just a short-lived credential that can always be re-issued via /refresh.
// ──────────────────────────────────────────────
const ACCESS_TOKEN_KEY = '__bbs_at'

function loadStoredToken() {
  try {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY)
  } catch {
    return null
  }
}

function storeToken(token) {
  try {
    if (token) {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
    } else {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY)
    }
  } catch {}
}

let accessToken = loadStoredToken()
let isRefreshing = false
let refreshQueue = []

/**
 * Called after login: store the access token in-memory + sessionStorage.
 */
export function setAccessToken(token) {
  accessToken = token
  storeToken(token)
}

/**
 * Called after logout: clear the in-memory token + sessionStorage.
 */
export function clearAccessToken() {
  accessToken = null
  storeToken(null)
}

// ──────────────────────────────────────────────
//  Token helpers
// ──────────────────────────────────────────────

function base64UrlToString(value) {
  const input = String(value || '').replace(/-/g, '+').replace(/_/g, '/')
  const padded = input.padEnd(Math.ceil(input.length / 4) * 4, '=')
  return window.atob(padded)
}

function decodeJwtPayload(token) {
  const raw = String(token || '').trim()
  if (!raw || raw.startsWith('bbsenc:v1:')) return null
  const parts = raw.split('.')
  if (parts.length !== 3) return null
  try {
    const json = base64UrlToString(parts[1])
    return JSON.parse(json)
  } catch {
    return null
  }
}

function nowMs() {
  return Date.now()
}

function limitFor(method, route) {
  const m = String(method || 'GET').toUpperCase()
  const r = String(route || '')
  if (r === '/auth/login' || r === '/auth/super-admin') {
    return { windowMs: 10_000, max: 10 }
  }
  if (m === 'GET') {
    return { windowMs: 5_000, max: 25 }
  }
  return { windowMs: 5_000, max: 12 }
}

function enforceRateLimit(method, route) {
  const key = `${String(method || 'GET').toUpperCase()}:${String(route || '')}`
  const { windowMs, max } = limitFor(method, route)
  const t = nowMs()
  const bucket = rateBuckets.get(key) || []
  const fresh = bucket.filter((x) => t - x < windowMs)
  if (fresh.length >= max) {
    rateBuckets.set(key, fresh)
    const err = new Error('Too many requests. Please wait and try again.')
    err.status = 429
    err.code = 'RATE_LIMITED'
    throw err
  }
  fresh.push(t)
  rateBuckets.set(key, fresh)
}

/**
 * Determine which token to use for this request.
 * Priority: in-memory access token > legacy localStorage token.
 */
function resolveToken() {
  // New system: in-memory access token
  if (accessToken) return { token: accessToken, type: 'new' }

  // Legacy system: localStorage token
  const legacy = readToken()
  if (legacy) return { token: legacy, type: 'legacy' }

  return { token: null, type: null }
}

/**
 * Decode the payload of a JWT WITHOUT verifying the signature.
 * This works even for expired tokens (which is exactly what we need
 * during the refresh flow).
 */
function decodeExpiredJwt(token) {
  try {
    const parts = String(token || '').split('.')
    if (parts.length !== 3) return null
    const json = base64UrlToString(parts[1])
    return JSON.parse(json)
  } catch {
    return null
  }
}

/**
 * Call the /auth/refresh endpoint to get a new access token.
 * The refresh token is sent automatically as an HttpOnly cookie.
 * The userId is sent in the body (decoded from the expired access token)
 * so the backend can efficiently look up the correct refresh token row.
 */
async function attemptRefresh() {
  // Extract userId from the expired access token (no signature verification needed)
  const payload = decodeExpiredJwt(accessToken)
  const userId = payload?.sub ? Number(payload.sub) : null

  const res = await fetch(`${baseUrl}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  })

  if (!res.ok) {
    throw new Error('Refresh failed')
  }

  const refreshPayload = await res.json()
  if (refreshPayload?.accessToken) {
    accessToken = refreshPayload.accessToken
    return refreshPayload.accessToken
  }

  throw new Error('No access token in refresh response')
}

/**
 * Retry a request with the refreshed token.
 */
async function retryWithRefreshedToken(originalArgs) {
  // If a refresh is already in progress, queue this request
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      refreshQueue.push({ resolve, reject, args: originalArgs })
    })
  }

  isRefreshing = true
  try {
    await attemptRefresh()

    // Replay all queued requests
    const queue = refreshQueue.slice()
    refreshQueue = []
    queue.forEach((item) => {
      item.resolve(apiRequestRaw(item.args.route, item.args.options))
    })

    // Retry the original request
    return apiRequestRaw(originalArgs.route, originalArgs.options)
  } catch (refreshError) {
    // Refresh failed — clear everything, force re-login
    accessToken = null
    refreshQueue = []
    clearSession()
    if (window.location.pathname !== '/login') {
      window.location.assign('/login')
    }
    throw refreshError
  } finally {
    isRefreshing = false
  }
}

/**
 * Low-level fetch wrapper without auto-refresh (used internally).
 */
async function apiRequestRaw(route, options) {
  const method = options?.method || 'GET'
  const body = options?.body

  enforceRateLimit(method, route)
  const resolved = resolveToken()

  const headers = {
    ...(body ? { 'Content-Type': 'application/json' } : null),
    ...(resolved.token ? { Authorization: `Bearer ${resolved.token}` } : null),
  }

  const res = await fetch(`${baseUrl}${route}`, {
    method,
    headers: Object.keys(headers).length ? headers : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include', // sends HttpOnly cookie automatically
  })

  const payload = await res.json().catch(() => null)

  if (!res.ok) {
    const message = payload?.error?.message || payload?.message || 'Request failed'
    const err = new Error(message)
    err.status = res.status
    err.code = payload?.error?.code
    throw err
  }

  return payload
}

// ──────────────────────────────────────────────
//  Main API request function
// ──────────────────────────────────────────────

export async function apiRequest(path, { method = 'GET', body } = {}) {
  const route = String(path || '')
  const token = readToken()
  const requiresAuth =
    route.startsWith('/admin') || route === '/auth/profile' || route === '/auth/password' || route === '/auth/me'
  const isLoginOperation = route === '/auth/login' || route === '/auth/super-admin'

  enforceRateLimit(method, route)

  // Sender validation (legacy token system)
  if (!isLoginOperation && token) {
    const payload = decodeJwtPayload(token)
    const sender = typeof payload?.sender === 'string' ? payload.sender.trim() : ''
    const origin = String(window.location.origin || '').trim()
    if (sender && origin && sender !== origin) {
      clearSession()
      console.warn('Discarded token due to sender mismatch', { sender, origin })
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
      const err = new Error('Session invalid. Please sign in again.')
      err.status = 401
      err.code = 'SENDER_MISMATCH'
      throw err
    }
  }

  // Expiry check for legacy tokens
  if (!isLoginOperation && token && isTokenExpired()) {
    clearSession()
    if (window.location.pathname !== '/login') {
      window.location.assign('/login')
    }
    const err = new Error('Session expired. Please sign in again.')
    err.status = 401
    err.code = 'TOKEN_EXPIRED'
    throw err
  }

  // Auth requirement check
  if (!isLoginOperation && requiresAuth && !token && !accessToken) {
    clearSession()
    if (window.location.pathname !== '/login') {
      window.location.assign('/login')
    }
    const err = new Error('Please sign in to continue.')
    err.status = 401
    err.code = 'UNAUTHORIZED'
    throw err
  }

  try {
    return await apiRequestRaw(route, { method, body })
  } catch (err) {
    // Auto-refresh: only attempt refresh for 401 errors and only when
    // we have an in-memory access token (new system).
    // Legacy tokens get the old behavior (immediate redirect).
    if (err.status === 401 && accessToken && !isLoginOperation) {
      try {
        return await retryWithRefreshedToken({ route, options: { method, body } })
      } catch (refreshErr) {
        throw refreshErr
      }
    }
    throw err
  }
}