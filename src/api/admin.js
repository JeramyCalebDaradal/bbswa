import { apiRequest } from './client'

export async function listRoles() {
  return apiRequest('/admin/roles')
}

export async function listUsers() {
  return apiRequest('/admin/users')
}

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
