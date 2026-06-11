import { apiRequest } from './client'

export async function listArticles({ page = 1, q = '' } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  if (q) params.set('q', String(q))
  const qs = params.toString()
  return apiRequest(`/admin/articles${qs ? `?${qs}` : ''}`)
}

export async function createArticle(payload) {
  return apiRequest('/admin/articles', { method: 'POST', body: payload })
}

export async function updateArticle(id, payload) {
  return apiRequest(`/admin/articles/${id}`, { method: 'PUT', body: payload })
}

export async function deleteArticle(id) {
  return apiRequest(`/admin/articles/${id}`, { method: 'DELETE' })
}

export async function listPublicArticles({ page = 1, q = '' } = {}) {
  return listPublicArticlesPaged({ page, q })
}

export async function listPublicArticlesPaged({ page = 1, q = '' } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  if (q) params.set('q', String(q))
  const qs = params.toString()
  return apiRequest(`/articles${qs ? `?${qs}` : ''}`)
}

export async function getPublicArticleBySlug(slug) {
  return apiRequest(`/articles/${slug}`)
}
