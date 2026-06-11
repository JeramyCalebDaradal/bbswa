import { apiRequest } from './client'

export async function listAppointments({ page = 1, status = 'all', q = '' } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  if (status && status !== 'all') params.set('status', String(status))
  if (q) params.set('q', String(q))
  const qs = params.toString()
  return apiRequest(`/admin/appointments${qs ? `?${qs}` : ''}`)
}

export async function createAppointment(payload) {
  return apiRequest('/admin/appointments', { method: 'POST', body: payload })
}

export async function updateAppointment(id, payload) {
  return apiRequest(`/admin/appointments/${id}`, { method: 'PUT', body: payload })
}
