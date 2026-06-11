import { useEffect, useMemo, useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Section from '../components/layout/Section'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import AccentUnderline from '../components/ui/AccentUnderline'
import { images } from '../assets/images'
import {
  DatasheetCard,
  MasonryColumns,
  ResourceArticleCard,
  ResourceTypeTab,
  VideoCard,
} from '../components/ui/ResourcesComponents'
import { listPublicArticles } from '../api/articles'
import { listPublicDatasheets } from '../api/datasheets'
import { listPublicInfoVideos } from '../api/infoVideos'

function formatDate(dateValue) {
  if (!dateValue) return ''
  const d = dateValue instanceof Date ? dateValue : new Date(dateValue)
  if (Number.isNaN(d.getTime())) return String(dateValue)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function makeExcerpt(content, maxLen = 150) {
  const v = String(content || '').replace(/\s+/g, ' ').trim()
  if (!v) return ''
  if (v.length <= maxLen) return v
  return `${v.slice(0, maxLen - 1).trim()}…`
}

function formatMonthYear(dateValue) {
  if (!dateValue) return ''
  const d = dateValue instanceof Date ? dateValue : new Date(dateValue)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function formatBytes(value) {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let size = n
  let idx = 0
  while (size >= 1024 && idx < units.length - 1) {
    size /= 1024
    idx += 1
  }
  const digits = idx === 0 ? 0 : size >= 10 ? 1 : 2
  return `${size.toFixed(digits)} ${units[idx]}`
}

export default function ResourcesPage() {
  const [activeType, setActiveType] = useState('articles')
  const [articles, setArticles] = useState([])
  const [isLoadingArticles, setIsLoadingArticles] = useState(false)
  const [articlesError, setArticlesError] = useState('')
  const [articlesPage, setArticlesPage] = useState(1)
  const [articlesPageSize, setArticlesPageSize] = useState(20)
  const [articlesTotal, setArticlesTotal] = useState(0)
  const [datasheets, setDatasheets] = useState([])
  const [isLoadingDatasheets, setIsLoadingDatasheets] = useState(false)
  const [datasheetsError, setDatasheetsError] = useState('')
  const [datasheetsPage, setDatasheetsPage] = useState(1)
  const [datasheetsPageSize, setDatasheetsPageSize] = useState(20)
  const [datasheetsTotal, setDatasheetsTotal] = useState(0)
  const [videos, setVideos] = useState([])
  const [isLoadingVideos, setIsLoadingVideos] = useState(false)
  const [videosError, setVideosError] = useState('')
  const [videosPage, setVideosPage] = useState(1)
  const [videosPageSize, setVideosPageSize] = useState(20)
  const [videosTotal, setVideosTotal] = useState(0)

  const resourceTypes = useMemo(
    () => [
      { key: 'articles', label: 'Articles', icon: images.resourcesPage.iconArticles },
      { key: 'datasheets', label: 'Datasheets', icon: images.resourcesPage.iconDatasheets },
      {
        key: 'videos',
        label: 'Informational Videos',
        icon: images.resourcesPage.iconVideos,
        iconMaskSize: '120% 120%',
      },
    ],
    []
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(async () => {
      setArticlesError('')
      setIsLoadingArticles(true)
      try {
        const res = await listPublicArticles({ page: 1 })
        setArticles(Array.isArray(res?.articles) ? res.articles : [])
        setArticlesPage(Number(res?.page || 1) || 1)
        setArticlesPageSize(Number(res?.pageSize || 20) || 20)
        setArticlesTotal(Number(res?.total || 0) || 0)
      } catch (err) {
        setArticlesError(err?.message || 'Failed to load articles')
        setArticles([])
        setArticlesTotal(0)
      } finally {
        setIsLoadingArticles(false)
      }

      setDatasheetsError('')
      setIsLoadingDatasheets(true)
      try {
        const res = await listPublicDatasheets({ page: 1 })
        const list = Array.isArray(res?.datasheets) ? res.datasheets : []
        setDatasheets(
          list.map((d) => ({
            id: d.id,
            icon: images.resourcesPage.datasheets.enterpriseIcon,
            title: d.title,
            description: d.description || '—',
            size: formatBytes(d.size) || '—',
            month: formatMonthYear(d.date_created) || '—',
            filePath: d.file_path,
          }))
        )
        setDatasheetsPage(Number(res?.page || 1) || 1)
        setDatasheetsPageSize(Number(res?.pageSize || 20) || 20)
        setDatasheetsTotal(Number(res?.total || 0) || 0)
      } catch (err) {
        setDatasheetsError(err?.message || 'Failed to load datasheets')
        setDatasheets([])
        setDatasheetsTotal(0)
      } finally {
        setIsLoadingDatasheets(false)
      }

      setVideosError('')
      setIsLoadingVideos(true)
      try {
        const res = await listPublicInfoVideos({ page: 1 })
        const list = Array.isArray(res?.videos) ? res.videos : []
        setVideos(
          list.map((v) => ({
            id: v.id,
            thumbnail: images.resourcesPage.videos.gettingStartedThumb,
            duration: '',
            title: v.title,
            description: v.description || '—',
          }))
        )
        setVideosPage(Number(res?.page || 1) || 1)
        setVideosPageSize(Number(res?.pageSize || 20) || 20)
        setVideosTotal(Number(res?.total || 0) || 0)
      } catch (err) {
        setVideosError(err?.message || 'Failed to load videos')
        setVideos([])
        setVideosTotal(0)
      } finally {
        setIsLoadingVideos(false)
      }
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [])

  const loadMoreArticles = async () => {
    if (isLoadingArticles) return
    const nextPage = articlesPage + 1
    if (articles.length >= articlesTotal) return

    setArticlesError('')
    setIsLoadingArticles(true)
    try {
      const res = await listPublicArticles({ page: nextPage })
      const list = Array.isArray(res?.articles) ? res.articles : []
      setArticles((prev) => [...prev, ...list])
      setArticlesPage(Number(res?.page || nextPage) || nextPage)
      setArticlesPageSize(Number(res?.pageSize || articlesPageSize) || articlesPageSize)
      setArticlesTotal(Number(res?.total || articlesTotal) || articlesTotal)
    } catch (err) {
      setArticlesError(err?.message || 'Failed to load articles')
    } finally {
      setIsLoadingArticles(false)
    }
  }

  const loadMoreDatasheets = async () => {
    if (isLoadingDatasheets) return
    const nextPage = datasheetsPage + 1
    if (datasheets.length >= datasheetsTotal) return

    setDatasheetsError('')
    setIsLoadingDatasheets(true)
    try {
      const res = await listPublicDatasheets({ page: nextPage })
      const list = Array.isArray(res?.datasheets) ? res.datasheets : []
      setDatasheets((prev) => [
        ...prev,
        ...list.map((d) => ({
          id: d.id,
          icon: images.resourcesPage.datasheets.enterpriseIcon,
          title: d.title,
          description: d.description || '—',
          size: formatBytes(d.size) || '—',
          month: formatMonthYear(d.date_created) || '—',
          filePath: d.file_path,
        })),
      ])
      setDatasheetsPage(Number(res?.page || nextPage) || nextPage)
      setDatasheetsPageSize(Number(res?.pageSize || datasheetsPageSize) || datasheetsPageSize)
      setDatasheetsTotal(Number(res?.total || datasheetsTotal) || datasheetsTotal)
    } catch (err) {
      setDatasheetsError(err?.message || 'Failed to load datasheets')
    } finally {
      setIsLoadingDatasheets(false)
    }
  }

  const loadMoreVideos = async () => {
    if (isLoadingVideos) return
    const nextPage = videosPage + 1
    if (videos.length >= videosTotal) return

    setVideosError('')
    setIsLoadingVideos(true)
    try {
      const res = await listPublicInfoVideos({ page: nextPage })
      const list = Array.isArray(res?.videos) ? res.videos : []
      setVideos((prev) => [
        ...prev,
        ...list.map((v) => ({
          id: v.id,
          thumbnail: images.resourcesPage.videos.gettingStartedThumb,
          duration: '',
          title: v.title,
          description: v.description || '—',
        })),
      ])
      setVideosPage(Number(res?.page || nextPage) || nextPage)
      setVideosPageSize(Number(res?.pageSize || videosPageSize) || videosPageSize)
      setVideosTotal(Number(res?.total || videosTotal) || videosTotal)
    } catch (err) {
      setVideosError(err?.message || 'Failed to load videos')
    } finally {
      setIsLoadingVideos(false)
    }
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <section className="relative h-[507px] overflow-hidden bg-black text-white">
          <div className="absolute inset-0">
            <img
              src={images.resourcesPage.heroBg}
              alt=""
              className="h-full w-full object-cover object-center opacity-70"
            />
          </div>

          <div className="relative flex h-full flex-col">
            <Header overlay />
            <div className="flex flex-1 items-center justify-center">
              <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-5 sm:px-8 lg:px-12">
                <h1 className="text-4xl font-bold sm:text-[51px] sm:leading-[71px]">Resources</h1>
                <AccentUnderline className="mt-3 w-24 sm:w-28" />
                <Breadcrumbs
                  className="mt-4"
                  items={[
                    { label: 'Home', to: '/' },
                    { label: 'Resources' },
                  ]}
                />
              </div>
            </div>
          </div>
          </section>

          <Section
            className="min-h-[max(50vh,calc(100vh-507px))] bg-white"
            containerClassName="py-12 pb-30 sm:pb-80"
          >
          <div className="flex flex-wrap items-center gap-8">
            {resourceTypes.map((type) => (
              <ResourceTypeTab
                key={type.key}
                active={activeType === type.key}
                icon={type.icon}
                label={type.label}
                iconClassName={type.iconClassName}
                iconMaskSize={type.iconMaskSize}
                onClick={() => setActiveType(type.key)}
              />
            ))}
          </div>

          {activeType === 'datasheets' ? (
            <div className="mt-10">
              {datasheetsError ? (
                <section className="rounded-[10px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {datasheetsError}
                </section>
              ) : null}

              {isLoadingDatasheets ? (
                <section className="rounded-[10px] border border-gray-200 bg-white p-6 text-sm text-gray-600">
                  Loading datasheets...
                </section>
              ) : null}

              {!isLoadingDatasheets && !datasheetsError && datasheets.length === 0 ? (
                <section className="rounded-[10px] border border-gray-200 bg-white p-6 text-sm text-gray-600">
                  No datasheets yet.
                </section>
              ) : null}

              <MasonryColumns className="mt-6">
                {datasheets.map((sheet) => (
                  <DatasheetCard key={sheet.id ?? sheet.title} {...sheet} />
                ))}
              </MasonryColumns>

              {datasheets.length < datasheetsTotal ? (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={loadMoreDatasheets}
                    disabled={isLoadingDatasheets}
                    className="rounded-[10px] border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-[#101828] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoadingDatasheets ? 'Loading...' : 'Load more'}
                  </button>
                </div>
              ) : null}
            </div>
          ) : activeType === 'videos' ? (
            <div className="mt-10">
              {videosError ? (
                <section className="rounded-[10px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {videosError}
                </section>
              ) : null}

              {isLoadingVideos ? (
                <section className="rounded-[10px] border border-gray-200 bg-white p-6 text-sm text-gray-600">
                  Loading videos...
                </section>
              ) : null}

              {!isLoadingVideos && !videosError && videos.length === 0 ? (
                <section className="rounded-[10px] border border-gray-200 bg-white p-6 text-sm text-gray-600">
                  No videos yet.
                </section>
              ) : null}

              <MasonryColumns className="mt-6">
                {videos.map((video) => (
                  <VideoCard key={video.id ?? video.title} {...video} />
                ))}
              </MasonryColumns>

              {videos.length < videosTotal ? (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={loadMoreVideos}
                    disabled={isLoadingVideos}
                    className="rounded-[10px] border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-[#101828] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoadingVideos ? 'Loading...' : 'Load more'}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-10 flex flex-col gap-6">
              {articlesError ? (
                <section className="rounded-[10px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {articlesError}
                </section>
              ) : null}

              {isLoadingArticles ? (
                <section className="rounded-[10px] border border-gray-200 bg-white p-6 text-sm text-gray-600">
                  Loading articles...
                </section>
              ) : null}

              {!isLoadingArticles && !articlesError && articles.length === 0 ? (
                <section className="rounded-[10px] border border-gray-200 bg-white p-6 text-sm text-gray-600">
                  No articles yet.
                </section>
              ) : null}

              {articles.map((article) => (
                <ResourceArticleCard
                  key={article.id}
                  tag={article.category}
                  date={formatDate(article.publish_date) || '—'}
                  readTime="• 10 min read"
                  title={article.title}
                  description={makeExcerpt(article.content) || '—'}
                  to={`/resources/articles/${article.url_slug}`}
                />
              ))}

              {articles.length < articlesTotal ? (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={loadMoreArticles}
                    disabled={isLoadingArticles}
                    className="rounded-[10px] border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-[#101828] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoadingArticles ? 'Loading...' : 'Load more'}
                  </button>
                </div>
              ) : null}
            </div>
          )}
          </Section>
        </main>
        <Footer />
      </div>
    </>
  )
}
