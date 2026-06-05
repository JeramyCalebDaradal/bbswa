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
import { Calendar, FileText, Mail, TrendingUp, Users } from 'lucide-react'

export default function Reports() {
  const appointmentData = [
    { month: 'Jan', completed: 38, cancelled: 5, pending: 8 },
    { month: 'Feb', completed: 45, cancelled: 7, pending: 6 },
    { month: 'Mar', completed: 42, cancelled: 4, pending: 9 },
    { month: 'Apr', completed: 52, cancelled: 6, pending: 7 },
    { month: 'May', completed: 48, cancelled: 5, pending: 10 },
    { month: 'Jun', completed: 55, cancelled: 3, pending: 12 },
  ]

  const leadConversionData = [
    { month: 'Jan', leads: 32, converted: 8 },
    { month: 'Feb', leads: 41, converted: 12 },
    { month: 'Mar', leads: 38, converted: 10 },
    { month: 'Apr', leads: 45, converted: 15 },
    { month: 'May', leads: 52, converted: 18 },
    { month: 'Jun', leads: 58, converted: 22 },
  ]

  const subscriberGrowthData = [
    { month: 'Jan', subscribers: 850 },
    { month: 'Feb', subscribers: 920 },
    { month: 'Mar', subscribers: 1010 },
    { month: 'Apr', subscribers: 1105 },
    { month: 'May', subscribers: 1180 },
    { month: 'Jun', subscribers: 1247 },
  ]

  const blogPerformanceData = [
    { category: 'Best Practices', views: 4230, color: '#f59e0b' },
    { category: 'Compliance', views: 3180, color: '#3b82f6' },
    { category: 'Threat Intel', views: 2890, color: '#10b981' },
    { category: 'Resources', views: 5620, color: '#8b5cf6' },
  ]

  const eventRegistrationData = [
    { event: 'Cybersecurity Webinar', registered: 45, attended: 38 },
    { event: 'GDPR Workshop', registered: 32, attended: 28 },
    { event: 'Incident Response', registered: 28, attended: 25 },
    { event: 'Security Summit', registered: 156, attended: 142 },
  ]

  return (
    <section className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h2>
        <p className="mt-1 text-gray-600">Track performance metrics and business insights</p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-xl font-semibold text-gray-900">89%</p>
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
              <p className="text-xl font-semibold text-gray-900">38%</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-green-600">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Subscriber Growth</p>
              <p className="text-xl font-semibold text-gray-900">+18%</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-purple-600">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Blog Views</p>
              <p className="text-xl font-semibold text-gray-900">1,284</p>
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
            <h3 className="text-lg font-semibold text-gray-900">Subscriber Growth</h3>
            <Mail className="h-5 w-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={subscriberGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line type="monotone" dataKey="subscribers" stroke="#10b981" strokeWidth={3} />
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
                label={({ category, views }) => `${category}: ${views}`}
                outerRadius={80}
                dataKey="views"
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
            <Bar dataKey="attended" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </section>
  )
}

