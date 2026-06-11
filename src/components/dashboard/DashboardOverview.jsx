import { useEffect, useMemo, useState } from 'react'
import { Calendar, Users, Mail, FileText, TrendingUp, Clock } from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts'
import StatCard from './StatCard'
import { listEvents } from '../../api/events'
import { listArticles } from '../../api/articles'
import { getReports } from '../../api/reports'

function formatDate(dateString) {
  const date = dateString instanceof Date ? dateString : new Date(dateString)
  if (Number.isNaN(date.getTime())) return String(dateString || '')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function normalizeArticleStatus(status) {
  return String(status || '').trim().toLowerCase()
}

export default function DashboardOverview() {
  const [events, setEvents] = useState([])
  const [articles, setArticles] = useState([])
  const [report, setReport] = useState(null)
  const [isContentLoading, setIsContentLoading] = useState(false)
  const [contentError, setContentError] = useState('')

  const monthlyData = useMemo(() => {
    const appts = Array.isArray(report?.appointmentData) ? report.appointmentData : []
    const leads = Array.isArray(report?.leadConversionData) ? report.leadConversionData : []
    const len = Math.max(appts.length, leads.length)
    const rows = []

    for (let i = 0; i < len; i += 1) {
      const month = appts[i]?.month || leads[i]?.month || ''
      const a = appts[i] || {}
      const appointmentTotal =
        Number(a.completed || 0) + Number(a.cancelled || 0) + Number(a.pending || 0) + Number(a.confirmed || 0)
      const leadTotal = Number(leads[i]?.leads || 0)
      if (!month) continue
      rows.push({ month, appointments: appointmentTotal, leads: leadTotal })
    }

    return rows
  }, [report])

  const statusData = useMemo(() => {
    const appts = Array.isArray(report?.appointmentData) ? report.appointmentData : []
    const last = appts.length ? appts[appts.length - 1] : {}
    return [
      { name: 'Completed', value: Number(last?.completed || 0), color: '#10b981' },
      { name: 'Pending', value: Number(last?.pending || 0), color: '#f59e0b' },
      { name: 'Confirmed', value: Number(last?.confirmed || 0), color: '#3b82f6' },
      { name: 'Cancelled', value: Number(last?.cancelled || 0), color: '#ef4444' },
    ]
  }, [report])

  useEffect(() => {
    const timeoutId = window.setTimeout(async () => {
      setContentError('')
      setIsContentLoading(true)
      try {
        const results = await Promise.allSettled([listEvents(), listArticles(), getReports()])

        const eventsRes = results[0]?.status === 'fulfilled' ? results[0].value : null
        const articlesRes = results[1]?.status === 'fulfilled' ? results[1].value : null
        const reportsRes = results[2]?.status === 'fulfilled' ? results[2].value : null

        if (results.some((r) => r.status === 'rejected')) {
          const firstError = results.find((r) => r.status === 'rejected')?.reason
          setContentError(firstError?.message || 'Failed to load overview content')
        }

        setEvents(Array.isArray(eventsRes?.events) ? eventsRes.events : [])
        setArticles(Array.isArray(articlesRes?.articles) ? articlesRes.articles : [])
        setReport(reportsRes?.report || null)
      } catch (err) {
        setContentError(err?.message || 'Failed to load overview content')
      } finally {
        setIsContentLoading(false)
      }
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [])

  const upcomingEvents = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return events
      .filter((evt) => {
        const d = new Date(evt?.date)
        if (Number.isNaN(d.getTime())) return false
        d.setHours(0, 0, 0, 0)
        return d >= today
      })
      .sort((a, b) => {
        const ad = new Date(a?.date).getTime()
        const bd = new Date(b?.date).getTime()
        if (ad !== bd) return ad - bd
        return String(a?.time || '').localeCompare(String(b?.time || ''))
      })
      .slice(0, 4)
  }, [events])

  const publishedArticles = useMemo(() => {
    return articles
      .filter((a) => normalizeArticleStatus(a?.article_status) === 'published')
      .sort((a, b) => {
        const ap = a?.publish_date ? new Date(a.publish_date).getTime() : 0
        const bp = b?.publish_date ? new Date(b.publish_date).getTime() : 0
        if (ap !== bp) return bp - ap
        return Number(b?.id || 0) - Number(a?.id || 0)
      })
      .slice(0, 4)
  }, [articles])

  const publishedArticlesCount = useMemo(() => {
    return articles.filter((a) => normalizeArticleStatus(a?.article_status) === 'published').length
  }, [articles])

  const newLeadsCount = useMemo(() => {
    const rows = Array.isArray(report?.leadConversionData) ? report.leadConversionData : []
    const last = rows.length ? rows[rows.length - 1] : null
    return Number(last?.leads || 0)
  }, [report])

  return (
    <section className="space-y-6">
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Upcoming Events" value={upcomingEvents.length} icon={Calendar} color="amber" />
        <StatCard title="New Leads" value={newLeadsCount} icon={Users} color="blue" />
        <StatCard title="Newsletter Subscribers" value={0} icon={Mail} color="green" />
        <StatCard title="Published Articles" value={publishedArticlesCount} icon={FileText} color="purple" />
      </section>

      {contentError ? (
        <section className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{contentError}</section>
      ) : null}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
            <TrendingUp className="h-5 w-5 text-amber-500" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line type="monotone" dataKey="appointments" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Appointment Status</h3>
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900">Published Articles</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {isContentLoading ? (
              <section className="p-4 text-sm text-gray-600">Loading articles...</section>
            ) : publishedArticles.length ? (
              publishedArticles.map((article) => (
                <section key={article.id} className="p-4">
                  <p className="font-medium text-gray-900">{article.title}</p>
                  <section className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                    {article.category ? <span>{article.category}</span> : null}
                    {article.category && article.publish_date ? <span className="text-gray-400">•</span> : null}
                    {article.publish_date ? <span>{formatDate(article.publish_date)}</span> : null}
                  </section>
                </section>
              ))
            ) : (
              <section className="p-4 text-sm text-gray-600">No published articles yet.</section>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {isContentLoading ? (
              <section className="p-4 text-sm text-gray-600">Loading events...</section>
            ) : upcomingEvents.length ? (
              upcomingEvents.map((event) => (
                <section key={event.id} className="p-4">
                  <p className="mb-2 font-medium text-gray-900">{event.title}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm text-gray-600">{formatDate(event.date)}</span>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">
                      {event.location_type === 'online' ? 'Virtual' : 'In-Person'}
                    </span>
                  </div>
                </section>
              ))
            ) : (
              <section className="p-4 text-sm text-gray-600">No upcoming events yet.</section>
            )}
          </div>
        </section>
      </section>
    </section>
  )
}
