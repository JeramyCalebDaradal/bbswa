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

// Entra SSO: read users directly from Microsoft Graph
export async function listBbsUsers({ page = 1, limit = 20, search = '' } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))
  if (search) params.set('search', search)
  const query = params.toString()
  return apiRequest(query ? `/admin/users?${query}` : '/admin/users')
}

// Entra SSO: role config (page access matrix)
export async function listRoleConfigs() {
  return apiRequest('/admin/role-config')
}

export async function updateRoleConfig(roleName, { allowedPages, description } = {}) {
  return apiRequest(`/admin/role-config/${encodeURIComponent(roleName)}`, {
    method: 'PUT',
    body: { allowed_pages_json: allowedPages, description },
  })
}

export async function deleteRoleConfig(roleName) {
  return apiRequest(`/admin/role-config/${encodeURIComponent(roleName)}`, {
    method: 'DELETE',
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
