import { apiRequest } from './client'

export async function listRoles() {
  return apiRequest('/admin/roles')
}

// Legacy user management (kept for backward compat)
export async function createAdminUser({ firstName, lastName, email, role, status, password }) {
  return apiRequest('/admin/users', {
    method: 'POST',
    body: {
      first_name: firstName,
      last_name: lastName,
      email,
      role,
      status,
      password,
    },
  })
}

export async function updateAdminUser(id, { role, status }) {
  return apiRequest(`/admin/users/${id}`, {
    method: 'PUT',
    body: { role, status },
  })
}

// Entra SSO: read bbs_users directory cache
export async function listBbsUsers({ page = 1, limit = 20, search = '', account_enabled = '' } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))
  if (search) params.set('search', search)
  if (account_enabled !== '') params.set('account_enabled', account_enabled)
  return apiRequest(`/admin/users?${params.toString()}`)
}

export async function getBbsUser(oid) {
  return apiRequest(`/admin/users/${oid}`)
}

// Entra SSO: role config (page access matrix)
export async function listRoleConfigs() {
  return apiRequest('/admin/role-config')
}

export async function updateRoleConfig(roleName, allowedPages) {
  return apiRequest(`/admin/role-config/${encodeURIComponent(roleName)}`, {
    method: 'PUT',
    body: { allowed_pages_json: allowedPages },
  })
}

export async function getAdminSettings() {
  return apiRequest('/admin/settings')
}

export async function updateAdminSettings(payload) {
  return apiRequest('/admin/settings', {
    method: 'PUT',
    body: payload,
  })
}
