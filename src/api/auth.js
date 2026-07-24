import { apiRequest } from './client'

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1'

export async function login({ email, password }) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

export async function me() {
  return apiRequest('/auth/me')
}

export async function updateProfile({ id, email, first_name, last_name }) {
  return apiRequest('/auth/profile', {
    method: 'PUT',
    body: { id, email, first_name, last_name },
  })
}

export async function changePassword({ id, email, current_password, new_password }) {
  return apiRequest('/auth/password', {
    method: 'PUT',
    body: { id, email, current_password, new_password },
  })
}

// Entra SSO: verify token with backend and get user info + role
// Uses direct fetch instead of apiRequest because Entra tokens are
// Microsoft-issued JWTs, not legacy backend tokens
export async function entraMe(entraToken) {
  const res = await fetch(`${baseUrl}/auth/entra/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${entraToken}`,
    },
  })

  const payload = await res.json().catch(() => null)

  if (!res.ok) {
    const message = payload?.error?.message || payload?.message || 'Failed to verify Microsoft sign-in'
    const err = new Error(message)
    err.status = res.status
    throw err
  }

  return payload
}