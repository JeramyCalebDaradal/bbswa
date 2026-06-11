import { apiRequest } from './client'

export async function listDatasheets({ page = 1, status = 'all', q = '' } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  if (status && status !== 'all') params.set('status', String(status))
  if (q) params.set('q', String(q))
  const qs = params.toString()
  return apiRequest(`/admin/datasheets${qs ? `?${qs}` : ''}`)
}

export async function createDatasheet(body) {
  return apiRequest('/admin/datasheets', { method: 'POST', body })
}

export async function updateDatasheet(id, body) {
  return apiRequest(`/admin/datasheets/${id}`, { method: 'PUT', body })
}

export async function deleteDatasheet(id) {
  return apiRequest(`/admin/datasheets/${id}`, { method: 'DELETE' })
}

export async function listPublicDatasheets({ page = 1, q = '' } = {}) {
  return listPublicDatasheetsPaged({ page, q })
}

export async function listPublicDatasheetsPaged({ page = 1, q = '' } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  if (q) params.set('q', String(q))
  const qs = params.toString()
  return apiRequest(`/datasheets${qs ? `?${qs}` : ''}`)
}
