import { useMemo, useState } from 'react'
import { Calendar, Eye, Save, Upload, X } from 'lucide-react'
import ArticlePreview from './ArticlePreview'
import { createArticle, updateArticle } from '../../api/articles'
import { readUser } from '../../auth/session'

function normalizeSlug(title) {
  return String(title || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function todayYmd() {
  return new Date().toISOString().slice(0, 10)
}

function dateOnly(value) {
  if (!value) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  const v = String(value).trim()
  if (!v) return ''
  if (v.includes('T')) return v.split('T')[0]
  const m = v.match(/^(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : v
}

function normalizeStatusLabel(value) {
  const v = String(value || '').trim().toLowerCase()
  if (v === 'published') return 'Published'
  if (v === 'archived') return 'Archived'
  return 'Published'
}

export default function CreateArticle({ mode = 'create', article, onClose, onSaved }) {
  const categories = useMemo(
    () => ['News', 'Blog', 'Security', 'Events', 'Best Practices', 'Compliance', 'Resources'],
    []
  )
  const availableTags = useMemo(() => ['Cybersecurity', 'AI', 'Cloud', 'Compliance', 'GDPR', 'Ransomware', 'Zero Trust'], [])

  const [title, setTitle] = useState(article?.title || '')
  const [slug, setSlug] = useState(article?.url_slug || '')
  const [category, setCategory] = useState(article?.category || '')
  const [tags, setTags] = useState(Array.isArray(article?.tags) ? article.tags : [])
  const [content, setContent] = useState(article?.content || '')
  const [featuredImage, setFeaturedImage] = useState(article?.featured_image || '')
  const [status, setStatus] = useState(normalizeStatusLabel(article?.article_status))
  const [publishDate, setPublishDate] = useState(dateOnly(article?.publish_date) || todayYmd())
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(Boolean(article?.url_slug))
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const toggleTag = (tag) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setFeaturedImage(String(reader.result || ''))
    reader.readAsDataURL(file)
  }

  const handleSave = async (nextStatus) => {
    setSaveError('')
    setIsSaving(true)
    try {
      const user = readUser()
      const addedBy = user?.id
      if (!addedBy) {
        throw new Error('Missing logged-in user')
      }

      const payload = {
        title,
        url_slug: slug,
        category,
        tags,
        featured_image: featuredImage,
        content,
        article_status: nextStatus,
        publish_date: publishDate,
        added_by: addedBy,
      }

      const res =
        mode === 'edit' && article?.id
          ? await updateArticle(article.id, payload)
          : await createArticle(payload)

      onSaved?.(res.article)
      onClose()
    } catch (err) {
      setSaveError(err?.message || 'Failed to save article')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex h-full w-full flex-col bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">{mode === 'edit' ? 'Edit Article' : 'Create New Article'}</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              onClick={() => handleSave(status)}
              disabled={isSaving}
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              onClick={() => setIsPreviewOpen(true)}
              disabled={isSaving}
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-white transition-all hover:from-amber-600 hover:to-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => handleSave('Published')}
              disabled={isSaving}
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto w-full max-w-4xl space-y-6">
            <section>
              <label className="mb-2 block text-sm font-medium text-gray-700">Article Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  const nextTitle = e.target.value
                  setTitle(nextTitle)
                  if (!isSlugManuallyEdited) {
                    setSlug(normalizeSlug(nextTitle))
                  }
                }}
                placeholder="Enter article title..."
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                maxLength={100}
                disabled={isSaving}
              />
              <div className="mt-1 text-right text-sm text-gray-500">{title.length} / 100</div>
            </section>

            <section>
              <label className="mb-2 block text-sm font-medium text-gray-700">URL Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value)
                    setIsSlugManuallyEdited(true)
                  }}
                  placeholder="article-url-slug"
                  className="w-full flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={isSaving}
                />
              </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={isSaving}
                >
                  <option value="">Select category...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const active = tags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        disabled={isSaving}
                        className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                          active
                            ? 'border-amber-300 bg-amber-100 text-amber-700'
                            : 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>

            <section>
              <label className="mb-2 block text-sm font-medium text-gray-700">Featured Image</label>
              {!featuredImage ? (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-amber-500">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isSaving}
                  />
                  <Upload className="mb-3 h-12 w-12 text-gray-400" />
                  <p className="mb-1 font-medium text-gray-700">Upload Image</p>
                  <p className="text-sm text-gray-500">Drag & drop or click to browse</p>
                </label>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <img src={featuredImage} alt="Featured" className="h-64 w-full object-cover" />
                </div>
              )}
            </section>

            <section>
              <label className="mb-2 block text-sm font-medium text-gray-700">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here..."
                className="min-h-[320px] w-full resize-none rounded-lg border border-gray-200 p-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={isSaving}
              />
            </section>

            <section className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="font-medium text-gray-900">Publishing Settings</h3>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Article Status</label>
                <div className="flex flex-wrap gap-4">
                  {['Published', 'Archived', 'Draft'].map((s) => (
                    <label key={s} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        value={s}
                        checked={status === s}
                        onChange={(e) => setStatus(e.target.value)}
                        className="h-4 w-4 text-amber-600"
                        disabled={isSaving}
                      />
                      <span className="text-gray-700">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Publish Date</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    disabled={isSaving}
                  />
                </div>
              </div>
            </section>

            {saveError ? (
              <section className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {saveError}
              </section>
            ) : null}
          </div>
        </div>
      </div>

      {isPreviewOpen ? (
        <section className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsPreviewOpen(false)}
            aria-label="Close preview"
          />
          <section className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <section className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold text-gray-900">Article Preview</h3>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={() => setIsPreviewOpen(false)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </section>
            <section className="mt-6">
              <ArticlePreview
                article={{
                  title,
                  publish_date: publishDate,
                  featured_image: featuredImage,
                  content,
                  category,
                  tags,
                  article_status: status,
                }}
              />
            </section>
          </section>
        </section>
      ) : null}
    </div>
  )
}
