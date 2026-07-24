const AUTH_EVENT = 'bbs_auth_change'
const TOKEN_KEY = 'bbs_token'
const TOKEN_EXPIRES_AT_KEY = 'bbs_token_expires_at'
let memoryUser = null

export function readUser() {
  if (memoryUser && typeof memoryUser === 'object') return memoryUser
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    memoryUser = parsed
    return parsed
  } catch {
    return null
  }
}

export function readToken() {
  const raw = localStorage.getItem(TOKEN_KEY)
  return raw ? String(raw) : ''
}

export function readTokenExpiresAt() {
  const raw = localStorage.getItem(TOKEN_EXPIRES_AT_KEY)
  return raw ? String(raw) : ''
}

export function isTokenExpired() {
  const expiresAt = readTokenExpiresAt()
  if (!expiresAt) return true
  const t = new Date(expiresAt).getTime()
  if (!Number.isFinite(t) || t <= 0) return true
  return Date.now() >= t
}

export function isAuthenticated() {
  if (localStorage.getItem('isAuthenticated') !== 'true') return false
  const token = readToken()
  if (!token) return false
  return !isTokenExpired()
}

export function setSession(user, token, tokenExpiresAt) {
  localStorage.setItem('isAuthenticated', 'true')
  memoryUser = user && typeof user === 'object' ? user : null
  localStorage.removeItem('user')
  if (typeof token === 'string' && token.trim()) {
    localStorage.setItem(TOKEN_KEY, token.trim())
  }
  if (typeof tokenExpiresAt === 'string' && tokenExpiresAt.trim()) {
    localStorage.setItem(TOKEN_EXPIRES_AT_KEY, tokenExpiresAt.trim())
  }
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function clearSession() {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('user')
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(TOKEN_EXPIRES_AT_KEY)
  memoryUser = null
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function subscribeAuthChange(handler) {
  window.addEventListener(AUTH_EVENT, handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener(AUTH_EVENT, handler)
    window.removeEventListener('storage', handler)
  }
}

// Pages always accessible regardless of role
const ALWAYS_ALLOWED = new Set(['overview', 'profile-settings'])

// Default access map (frontend fallback — authoritative access is enforced by the backend via bbs_role_config)
// These must match the Entra App Role values exactly (PascalCase)
const ROLE_ACCESS_MAP = {
  Administrator: new Set(['blog', 'datasheets', 'info-videos', 'newsletter', 'events', 'leads', 'appointments', 'reports', 'logs', 'api-logs', 'settings', 'users', 'role-config']),
  ContentManager: new Set(['blog', 'datasheets', 'info-videos', 'newsletter', 'events']),
  Analyst: new Set(['reports', 'logs', 'api-logs']),
  // Legacy role names kept for backward compat during transition
  'Super Admin': new Set(['blog', 'datasheets', 'info-videos', 'newsletter', 'events', 'leads', 'appointments', 'reports', 'logs', 'api-logs', 'settings', 'users', 'role-config']),
  'Content Manager': new Set(['blog', 'datasheets', 'info-videos', 'newsletter', 'events']),
  'Sales Agent': new Set(['leads', 'appointments']),
  'Event Coordinator': new Set(['events', 'appointments']),
}

export function roleAllowsDashboardSection(role, sectionId) {
  const r = String(role || '').trim()
  const s = String(sectionId || '').trim()
  if (!s) return false
  if (ALWAYS_ALLOWED.has(s)) return true
  // Default role and unrecognized roles get no page access
  if (!r || r === 'Default') return false
  return Boolean(ROLE_ACCESS_MAP[r]?.has(s))
}
