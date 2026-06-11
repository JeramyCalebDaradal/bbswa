import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Calendar, FileText, TrendingUp, Users } from 'lucide-react'
import { getReports } from '../../api/reports'

export default function Reports() {
  const [report, setReport] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true)
      setError('')
      try {
        const res = await getReports()
        setReport(res?.report || null)
      } catch (err) {
        setError(err?.message || 'Failed to load reports')
        setReport(null)
      } finally {
        setIsLoading(false)
      }
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [])

  const colors = useMemo(() => ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#14b8a6'], [])

  const appointmentData = Array.isArray(report?.appointmentData) ? report.appointmentData : []
  const leadConversionData = Array.isArray(report?.leadConversionData) ? report.leadConversionData : []
  const registrationTrendData = Array.isArray(report?.registrationTrendData) ? report.registrationTrendData : []
  const blogPerformanceData = Array.isArray(report?.blogPerformanceData)
    ? report.blogPerformanceData.map((row, index) => ({ ...row, color: colors[index % colors.length] }))
    : []
  const eventRegistrationData = Array.isArray(report?.eventRegistrationData) ? report.eventRegistrationData : []

  const completionRate = Number(report?.kpis?.completionRate || 0)
  const leadConversionRate = Number(report?.kpis?.leadConversionRate || 0)
  const eventRegistrationsTotal = Number(report?.kpis?.eventRegistrationsTotal || 0)
  const publishedArticlesTotal = Number(report?.kpis?.publishedArticlesTotal || 0)

  return (
    <section className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h2>
        <p className="mt-1 text-gray-600">Track performance metrics and business insights</p>
      </section>

      {error ? (
        <section className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</section>
      ) : null}
      {isLoading ? (
        <section className="rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-600 shadow-sm">Loading reports...</section>
      ) : null}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-xl font-semibold text-gray-900">{Math.round(completionRate)}%</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-600">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Lead Conversion</p>
              <p className="text-xl font-semibold text-gray-900">{Math.round(leadConversionRate)}%</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-green-600">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Event Registrations</p>
              <p className="text-xl font-semibold text-gray-900">{eventRegistrationsTotal.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-purple-600">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Published Articles</p>
              <p className="text-xl font-semibold text-gray-900">{publishedArticlesTotal.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Appointment Report</h3>
            <TrendingUp className="h-5 w-5 text-amber-500" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="completed" fill="#10b981" />
              <Bar dataKey="confirmed" fill="#3b82f6" />
              <Bar dataKey="cancelled" fill="#ef4444" />
              <Bar dataKey="pending" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Lead Conversion Report</h3>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={leadConversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="converted" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Event Registration Trend</h3>
            <Users className="h-5 w-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={registrationTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line type="monotone" dataKey="registered" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Blog Performance</h3>
            <FileText className="h-5 w-5 text-purple-500" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={blogPerformanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, value }) => `${category}: ${value}`}
                outerRadius={80}
                dataKey="value"
              >
                {blogPerformanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Event Registration Report</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={eventRegistrationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="event" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Bar dataKey="registered" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </section>
  )
}
