import { apiRequest } from './client'

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
