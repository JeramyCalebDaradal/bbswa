import { isAuthenticated, clearSession } from '../auth/session'
import { getAccessToken, addEventCallback, EventType } from '../auth/msal'

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1'

const rateBuckets = new Map()

// In-memory access token (MSAL-managed, refreshed silently)
let accessToken = null
let isRefreshing = false
let refreshQueue = []

/**
 * Set the access token after successful MSAL token acquisition
 */
export function setAccessToken(token) {
  accessToken = token
}

/**
 * Clear the access token on logout
 */
export function clearAccessToken() {
  accessToken = null
}

function base64UrlToString(value) {
  const input = String(value || '').replace(/-/g, '+').replace(/_/g, '/')
  const padded = input.padEnd(Math.ceil(input.length / 4) * 4, '=')
  return window.atob(padded)
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
 * Get a valid access token from MSAL (acquires silently if needed)
 */
async function getValidAccessToken() {
  // Return cached token if we have one
  if (accessToken) return accessToken

  // Not authenticated at all
  if (!isAuthenticated()) {
    throw new Error('Not authenticated')
  }

  // Acquire token silently from MSAL
  const token = await getAccessToken(['User.Read'])
  accessToken = token
  return token
}

/**
 * Retry a request with a fresh token
 */
async function retryWithFreshToken(originalArgs) {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      refreshQueue.push({ resolve, reject, args: originalArgs })
    })
  }

  isRefreshing = true
  try {
    // Force fresh token acquisition
    accessToken = null
    await getValidAccessToken()

    // Replay queued requests
    const queue = refreshQueue.slice()
    refreshQueue = []
    queue.forEach((item) => {
      item.resolve(apiRequestRaw(item.args.route, item.args.options))
    })

    // Retry the original request
    return apiRequestRaw(originalArgs.route, originalArgs.options)
  } catch (err) {
    // Token acquisition failed — clear session, force re-login
    accessToken = null
    refreshQueue = []
    clearSession()
    if (window.location.pathname !== '/login') {
      window.location.assign('/login')
    }
    throw err
  } finally {
    isRefreshing = false
  }
}

/**
 * Low-level fetch wrapper
 */
async function apiRequestRaw(route, options) {
  const method = options?.method || 'GET'
  const body = options?.body

  enforceRateLimit(method, route)

  let token
  try {
    token = await getValidAccessToken()
  } catch {
    // If we can't get a token, proceed without it (will 401)
    token = null
  }

  const headers = {
    ...(options?.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  if (body && !(body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${baseUrl}${route}`, {
    method,
    headers,
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
    credentials: 'include',
  })

  // 401 — token expired or invalid, try to get fresh token and retry once
  if (res.status === 401 && token) {
    return retryWithFreshToken({ route, options })
  }

  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}`
    let errorData = null
    try {
      errorData = await res.json()
      errorMessage = errorData?.error || errorData?.message || errorMessage
    } catch {
      // ignore parse errors
    }
    const err = new Error(errorMessage)
    err.status = res.status
    err.code = errorData?.code || 'API_ERROR'
    err.data = errorData
    throw err
  }

  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return res.json()
  }
  return res.text()
}

/**
 * Public API request function
 */
export async function apiRequest(route, options = {}) {
  return apiRequestRaw(route, options)
}

/**
 * Set up MSAL event listener for logout
 */
addEventCallback((message) => {
  if (message.eventType === EventType.LOGOUT_SUCCESS) {
    console.log('[API] MSAL logout detected, clearing session')
    clearSession()
    clearAccessToken()
    if (window.location.pathname !== '/login') {
      window.location.assign('/login')
    }
  }
})

export { baseUrl }