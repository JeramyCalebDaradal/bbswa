import { useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Section from '../components/layout/Section'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import AccentUnderline from '../components/ui/AccentUnderline'
import { images } from '../assets/images'
import { getPublicArticleBySlug } from '../api/articles'

function formatDate(dateValue) {
  if (!dateValue) return ''
  const d = dateValue instanceof Date ? dateValue : new Date(dateValue)
  if (Number.isNaN(d.getTime())) return String(dateValue)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function ArticlePage() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const urlSlug = String(slug || '').trim()
    if (!urlSlug) return

    const timeoutId = window.setTimeout(async () => {
      setError('')
      setIsLoading(true)
      try {
        const res = await getPublicArticleBySlug(urlSlug)
        setArticle(res?.article || null)
      } catch (err) {
        setError(err?.message || 'Failed to load article')
        setArticle(null)
      } finally {
        setIsLoading(false)
      }
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [slug])

  const heroImage = useMemo(() => {
    const img = String(article?.featured_image || '').trim()
    return img || images.blog?.[0] || ''
  }, [article])

  const publishedDate = useMemo(() => formatDate(article?.publish_date), [article])
  const category = useMemo(() => String(article?.category || '').trim(), [article])
  const tags = useMemo(() => (Array.isArray(article?.tags) ? article.tags.map((t) => String(t || '').trim()).filter(Boolean) : []), [article])

  if (!slug) {
    return <Navigate to="/resources" replace />
  }

  return (
    <>
      <main className="min-h-screen bg-white">
        <section className="relative overflow-hidden bg-black text-white">
          <div className="absolute inset-0">
            <img src={heroImage} alt="" className="h-full w-full object-cover opacity-55" />
            <div className="absolute inset-0 bg-black/25" />
          </div>

          <div className="relative">
            <Header overlay />
            <div className="mx-auto w-full max-w-[1280px] px-5 pb-10 pt-28 sm:px-8 sm:pb-14 sm:pt-32 lg:px-12">
              <h1 className="text-3xl font-bold leading-tight sm:text-5xl">{article?.title || (isLoading ? 'Loading…' : 'Article')}</h1>
              <AccentUnderline className="mt-4 w-24 sm:w-28" />
              <Breadcrumbs
                className="mt-5"
                items={[
                  { label: 'Home', to: '/' },
                  { label: 'Resources', to: '/resources' },
                  { label: 'Articles' },
                ]}
              />
            </div>
          </div>
        </section>

        <Section className="bg-white" containerClassName="pt-10 pb-20 sm:pt-14 sm:pb-24">
          {error ? (
            <section className="rounded-[10px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</section>
          ) : null}

          {isLoading ? (
            <section className="rounded-[10px] border border-gray-200 bg-white p-6 text-sm text-gray-600">Loading article...</section>
          ) : null}

          {!isLoading && !error && !article ? (
            <section className="rounded-[10px] border border-gray-200 bg-white p-6 text-sm text-gray-600">Article not found.</section>
          ) : null}

          {article ? (
            <section className="mx-auto w-full max-w-3xl">
              <section className="flex flex-wrap items-center gap-3 text-sm text-[#6A7282]">
                {category ? (
                  <span className="inline-flex items-center rounded-full bg-[#FFEDD4] px-3 py-1 text-sm leading-5 text-[#CA3500]">
                    {category}
                  </span>
                ) : null}
                {publishedDate ? <span>{publishedDate}</span> : null}
                <span>• 10 min read</span>
              </section>

              {tags.length ? (
                <section className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[#F3F4F6] px-3 py-1 text-xs text-[#4A5565]">
                      {tag}
                    </span>
                  ))}
                </section>
              ) : null}

              <section className="mt-8 overflow-hidden rounded-[14px] border border-gray-200 bg-white shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">
                <img src={heroImage} alt={article.title || ''} className="h-[280px] w-full object-cover sm:h-[360px]" />
              </section>

              <section className="prose prose-slate mt-10 max-w-none">
                <div className="whitespace-pre-wrap text-base leading-7 text-[#101828]">{String(article.content || '')}</div>
              </section>
            </section>
          ) : null}
        </Section>
      </main>
      <Footer />
    </>
  )
}
