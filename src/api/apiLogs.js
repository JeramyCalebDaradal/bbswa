import { apiRequest } from './client'

export async function listApiLogs({ page = 1, pageSize = 50, from = '', to = '', status = '', url = '', ip = '', q = '' } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('pageSize', String(pageSize))
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  if (status) params.set('status', String(status))
  if (url) params.set('url', url)
  if (ip) params.set('ip', ip)
  if (q) params.set('q', q)
  return apiRequest(`/admin/api-logs?${params.toString()}`)
}