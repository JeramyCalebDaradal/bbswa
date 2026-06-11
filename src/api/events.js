import { apiRequest } from './client'

export async function listEvents({ page = 1, q = '' } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  if (q) params.set('q', String(q))
  const qs = params.toString()
  return apiRequest(`/admin/events${qs ? `?${qs}` : ''}`)
}

export async function createEvent(payload) {
  return apiRequest('/admin/events', { method: 'POST', body: payload })
}

export async function updateEvent(id, payload) {
  return apiRequest(`/admin/events/${id}`, { method: 'PUT', body: payload })
}

export async function getEventAttendees(id) {
  return apiRequest(`/admin/events/${id}/attendees`)
}

export async function listPublicEvents() {
  return apiRequest('/events')
}

export async function registerForEvent(eventId, payload) {
  return apiRequest(`/events/${eventId}/register`, { method: 'POST', body: payload })
}
