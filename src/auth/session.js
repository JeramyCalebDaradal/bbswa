import { getMsalInstance } from './msal'

const AUTH_EVENT = 'bbs_auth_change'

// In-memory user object (cleared on logout, rebuilt from MSAL on restore)
let memoryUser = null
let authInitialized = false
let initPromise = null

/**
 * Read current user from memory or MSAL
 */
export function readUser() {
  if (memoryUser && typeof memoryUser === 'object') return memoryUser
  return null
}

/**
 * Check if user has an active MSAL session
 */
export function isAuthenticated() {
  try {
    const instance = getMsalInstance()
    return instance.getAllAccounts().length > 0
  } catch {
    return false
  }
}

/**
 * Set user session after successful authentication
 */
export function setSession(user, token, tokenExpiresAt) {
  memoryUser = user && typeof user === 'object' ? user : null
  authInitialized = true
  window.dispatchEvent(new Event(AUTH_EVENT))
}

/**
 * Clear user session
 */
export function clearSession() {
  memoryUser = null
  authInitialized = true
  window.dispatchEvent(new Event(AUTH_EVENT))
}

/**
 * Subscribe to auth state changes
 */
export function subscribeAuthChange(handler) {
  window.addEventListener(AUTH_EVENT, handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener(AUTH_EVENT, handler)
    window.removeEventListener('storage', handler)
  }
}

/**
 * Legacy token getters - kept for backward compatibility
 * No longer used with MSAL-only flow
 */
export function readToken() {
  return null
}

export function readTokenExpiresAt() {
  return null
}

/**
 * Initialization state getters
 */
export function getAuthInitialized() {
  return authInitialized
}

export function getInitPromise() {
  return initPromise
}

export function setInitPromise(promise) {
  initPromise = promise
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