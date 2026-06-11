import { useEffect, useMemo, useState } from 'react'
import { Edit, Eye, FileText, Search, Trash2 } from 'lucide-react'
import CreateArticle from './CreateArticle'
import ArticlePreview from './ArticlePreview'
import ConfirmModal from '../ui/ConfirmModal'
import { deleteArticle, listArticles } from '../../api/articles'

function StatusBadge({ status }) {
  const v = String(status || '').trim().toLowerCase()
  if (v === 'published') {
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
        Published
      </span>
    )
  }

  if (v === 'archived') {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
        Archived
      </span>
    )
  }

  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
      Draft
    </span>
  )
}

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateArticle, setShowCreateArticle] = useState(false)
  const [articles, setArticles] = useState([])
  const [editingArticle, setEditingArticle] = useState(null)
  const [previewArticle, setPreviewArticle] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmingDelete, setConfirmingDelete] = useState(null)
  const [error, setError] = useState('')

  function formatDateOnly(value) {
    if (!value) return ''
    if (value instanceof Date) return value.toISOString().slice(0, 10)
    const v = String(value)
    if (v.includes('T')) return v.split('T')[0]
    const m = v.match(/^(\d{4}-\d{2}-\d{2})/)
    return m ? m[1] : v
  }

  const totalPages = useMemo(() => {
    const t = Number(total || 0)
    const s = Number(pageSize || 20)
    if (!Number.isFinite(t) || t <= 0) return 1
    if (!Number.isFinite(s) || s <= 0) return 1
    return Math.max(1, Math.ceil(t / s))
  }, [pageSize, total])

  const refresh = async ({ nextPage } = {}) => {
    setError('')
    setIsLoading(true)
    try {
      const targetPage = Number.isFinite(Number(nextPage)) && Number(nextPage) > 0 ? Math.trunc(Number(nextPage)) : page
      const res = await listArticles({ page: targetPage, q: searchTerm })
      setArticles(Array.isArray(res?.articles) ? res.articles : [])
      setPage(Number(res?.page || targetPage) || targetPage)
      setPageSize(Number(res?.pageSize || 20) || 20)
      setTotal(Number(res?.total || 0) || 0)
    } catch (err) {
      setError(err?.message || 'Failed to load articles')
      setArticles([])
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      refresh()
    }, searchTerm ? 300 : 0)
    return () => window.clearTimeout(timeoutId)
  }, [page, searchTerm])

  const openDeleteConfirm = (article) => {
    if (!article?.id) return
    if (deletingId) return
    setConfirmingDelete(article)
  }

  const confirmDelete = async () => {
    if (!confirmingDelete?.id) return
    if (deletingId) return

    setError('')
    setDeletingId(confirmingDelete.id)
    try {
      await deleteArticle(confirmingDelete.id)
      setPreviewArticle((prev) => (prev?.id === confirmingDelete.id ? null : prev))
      setConfirmingDelete(null)
      await refresh()
    } catch (err) {
      setError(err?.message || 'Failed to delete article')
    } finally {
      setDeletingId(null)
    }
  }

  const totals = useMemo(() => {
    return {
      total,
      published: articles.filter((p) => String(p.article_status || '').trim().toLowerCase() === 'published').length,
      drafts: articles.filter((p) => String(p.article_status || '').trim().toLowerCase() === 'draft').length,
    }
  }, [articles, total])

  return (
    <>
      <section className="space-y-6">
        <section className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Blog / Articles</h2>
            <p className="mt-1 text-gray-600">Create and manage your blog content</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingArticle(null)
              setShowCreateArticle(true)
            }}
            className="cursor-pointer rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-white shadow-sm transition-all hover:from-amber-600 hover:to-amber-700"
          >
            + New Article
          </button>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-1 text-sm text-gray-600">Total Articles</p>
            <p className="text-2xl font-semibold text-gray-900">{totals.total}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-1 text-sm text-gray-600">Published</p>
            <p className="text-2xl font-semibold text-gray-900">{totals.published}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-1 text-sm text-gray-600">Drafts</p>
            <p className="text-2xl font-semibold text-gray-900">{totals.drafts}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-1 text-sm text-gray-600">Refresh</p>
            <button
              type="button"
              className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={refresh}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Reload'}
            </button>
          </div>
        </section>

        {error ? (
          <section className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</section>
        ) : null}

        <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Article</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Publish Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {articles.map((post) => (
                  <tr key={post.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-amber-200">
                          <FileText className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{post.title}</p>
                          <p className="mt-1 text-xs text-gray-500">/{post.url_slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{post.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={post.article_status} />
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{formatDateOnly(post.publish_date) || 'Not published'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="text-gray-600 hover:text-gray-700"
                          aria-label="Preview"
                          onClick={() => setPreviewArticle(post)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-700"
                          aria-label="Edit"
                          onClick={() => {
                            setEditingArticle(post)
                            setShowCreateArticle(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label="Delete"
                          onClick={() => openDeleteConfirm(post)}
                          disabled={deletingId === post.id}
                        >
                          {deletingId === post.id ? (
                            <span className="text-xs font-medium">Deleting...</span>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            Page {page} of {totalPages} • {total} total
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, Number(p || 1) - 1))}
              disabled={isLoading || page <= 1}
              className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, Number(p || 1) + 1))}
              disabled={isLoading || page >= totalPages}
              className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Next
            </button>
          </div>
        </section>
      </section>

      <ConfirmModal
        open={Boolean(confirmingDelete)}
        message={
          confirmingDelete?.title ? `Delete "${confirmingDelete.title}"? This cannot be undone.` : 'Delete this article?'
        }
        onCancel={() => setConfirmingDelete(null)}
        onConfirm={confirmDelete}
        isConfirming={Boolean(confirmingDelete?.id) && deletingId === confirmingDelete?.id}
        confirmingLabel="Deleting..."
      />

      {showCreateArticle ? (
        <CreateArticle
          mode={editingArticle ? 'edit' : 'create'}
          article={editingArticle || undefined}
          onClose={() => setShowCreateArticle(false)}
          onSaved={async () => {
            await refresh()
          }}
        />
      ) : null}

      {previewArticle ? (
        <section className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setPreviewArticle(null)}
            aria-label="Close preview"
          />
          <section className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <section className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold text-gray-900">Article Preview</h3>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={() => setPreviewArticle(null)}
                aria-label="Close"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </section>
            <section className="mt-6">
              <ArticlePreview article={previewArticle} />
            </section>
          </section>
        </section>
      ) : null}
    </>
  )
}
