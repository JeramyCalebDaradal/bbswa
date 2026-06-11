import { clearSession, isTokenExpired, readToken } from '../auth/session'

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1'

const rateBuckets = new Map()

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

export async function apiRequest(path, { method = 'GET', body } = {}) {
  const route = String(path || '')
  const token = readToken()
  const requiresAuth =
    route.startsWith('/admin') || route === '/auth/profile' || route === '/auth/password' || route === '/auth/me'
  const isLoginOperation = route === '/auth/login' || route === '/auth/super-admin'

  enforceRateLimit(method, route)

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

  if (!isLoginOperation && requiresAuth && !token) {
    clearSession()
    if (window.location.pathname !== '/login') {
      window.location.assign('/login')
    }
    const err = new Error('Please sign in to continue.')
    err.status = 401
    err.code = 'UNAUTHORIZED'
    throw err
  }

  const headers = {
    ...(body ? { 'Content-Type': 'application/json' } : null),
    ...(token ? { Authorization: `Bearer ${token}` } : null),
  }

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: Object.keys(headers).length ? headers : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  const payload = await res.json().catch(() => null)
  if (!res.ok) {
    const message = payload?.error?.message || payload?.message || 'Request failed'
    const err = new Error(message)
    err.status = res.status
    err.code = payload?.error?.code
    if (res.status === 401) {
      clearSession()
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }
    throw err
  }

  return payload
}
