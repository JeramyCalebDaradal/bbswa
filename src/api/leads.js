import { apiRequest } from './client'

export async function listLeads({ page = 1, status = 'all', q = '' } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  if (status && status !== 'all') params.set('status', String(status))
  if (q) params.set('q', String(q))
  const qs = params.toString()
  return apiRequest(`/admin/leads${qs ? `?${qs}` : ''}`)
}

export async function createLead(payload) {
  return apiRequest('/admin/leads', { method: 'POST', body: payload })
}

export async function updateLead(id, payload) {
  return apiRequest(`/admin/leads/${id}`, { method: 'PUT', body: payload })
}

export async function deleteLead(id) {
  return apiRequest(`/admin/leads/${id}`, { method: 'DELETE' })
}
