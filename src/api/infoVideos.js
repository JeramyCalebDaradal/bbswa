import { apiRequest } from './client'

export async function listInfoVideos({ page = 1, status = 'all', q = '' } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  if (status && status !== 'all') params.set('status', String(status))
  if (q) params.set('q', String(q))
  const qs = params.toString()
  return apiRequest(`/admin/info-videos${qs ? `?${qs}` : ''}`)
}

export async function createInfoVideo(body) {
  return apiRequest('/admin/info-videos', { method: 'POST', body })
}

export async function updateInfoVideo(id, body) {
  return apiRequest(`/admin/info-videos/${id}`, { method: 'PUT', body })
}

export async function deleteInfoVideo(id) {
  return apiRequest(`/admin/info-videos/${id}`, { method: 'DELETE' })
}

export async function listPublicInfoVideos({ page = 1, q = '' } = {}) {
  return listPublicInfoVideosPaged({ page, q })
}

export async function listPublicInfoVideosPaged({ page = 1, q = '' } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  if (q) params.set('q', String(q))
  const qs = params.toString()
  return apiRequest(`/info-videos${qs ? `?${qs}` : ''}`)
}
