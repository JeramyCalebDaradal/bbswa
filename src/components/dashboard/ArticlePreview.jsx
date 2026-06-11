function formatDate(dateValue) {
  if (!dateValue) return ''
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue)
  if (Number.isNaN(date.getTime())) return String(dateValue)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ArticlePreview({ article }) {
  const title = String(article?.title || '')
  const category = String(article?.category || '').trim()
  const tags = Array.isArray(article?.tags) ? article.tags.map((t) => String(t || '').trim()).filter(Boolean) : []
  const status = String(article?.article_status || '').trim()
  const isPublished = status.toLowerCase() === 'published'
  const dateCreated = formatDate(article?.date_created || article?.dateCreated)
  const publishDate = formatDate(article?.publish_date)
  const image = String(article?.featured_image || '').trim()
  const content = String(article?.content || '')

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <section className="space-y-3">
        <section className="flex flex-wrap items-center gap-2">
          {category ? (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
              {category}
            </span>
          ) : null}
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {isPublished ? 'Published' : 'Not Published'}
          </span>
        </section>

        <h1 className="text-3xl font-semibold leading-tight text-gray-900 sm:text-4xl">{title || 'Untitled'}</h1>

        <section className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600">
          {publishDate ? <span>Published {publishDate}</span> : null}
          {publishDate && dateCreated ? <span className="text-gray-400">•</span> : null}
          {dateCreated ? <span>Created {dateCreated}</span> : null}
        </section>

        {tags.length ? (
          <section className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700"
              >
                {tag}
              </span>
            ))}
          </section>
        ) : null}
      </section>

      {image ? (
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <img src={image} alt={title || 'Article image'} className="h-64 w-full object-cover sm:h-80" />
        </section>
      ) : null}

      <section className="rounded-xl border border-gray-100 bg-white p-6 text-sm leading-7 text-gray-800 shadow-sm">
        <section className="whitespace-pre-wrap">{content || 'No content'}</section>
      </section>
    </section>
  )
}
