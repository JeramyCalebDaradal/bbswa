import { apiRequest } from './client'

export async function listLogs({ page = 1, pageSize = 50, role = '', action = '', from = '', to = '', q = '' } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('pageSize', String(pageSize))
  if (role) params.set('role', role)
  if (action) params.set('action', action)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  if (q) params.set('q', q)
  return apiRequest(`/admin/logs?${params.toString()}`)
}

