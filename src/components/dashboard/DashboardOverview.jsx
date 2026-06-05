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

export default function DashboardOverview() {
  const monthlyData = [
    { month: 'Jan', appointments: 45, leads: 32 },
    { month: 'Feb', appointments: 52, leads: 41 },
    { month: 'Mar', appointments: 48, leads: 38 },
    { month: 'Apr', appointments: 61, leads: 45 },
    { month: 'May', appointments: 55, leads: 52 },
    { month: 'Jun', appointments: 67, leads: 58 },
  ]

  const statusData = [
    { name: 'Completed', value: 145, color: '#10b981' },
    { name: 'Pending', value: 42, color: '#f59e0b' },
    { name: 'Confirmed', value: 38, color: '#3b82f6' },
    { name: 'Cancelled', value: 15, color: '#ef4444' },
  ]

  const recentInquiries = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      subject: 'Security Assessment Inquiry',
      time: '2 hours ago',
    },
    { id: 2, name: 'Michael Chen', email: 'm.chen@tech.com', subject: 'Penetration Testing Services', time: '5 hours ago' },
    { id: 3, name: 'Emily Rodriguez', email: 'emily.r@startup.io', subject: 'Compliance Consultation', time: '1 day ago' },
    { id: 4, name: 'David Kim', email: 'david@enterprise.com', subject: 'Annual Security Review', time: '1 day ago' },
  ]

  const upcomingEvents = [
    { id: 1, title: 'Cybersecurity Best Practices Webinar', date: 'Jun 15, 2026', attendees: 45 },
    { id: 2, title: 'GDPR Compliance Workshop', date: 'Jun 22, 2026', attendees: 32 },
    { id: 3, title: 'Incident Response Training', date: 'Jul 5, 2026', attendees: 28 },
  ]

  return (
    <section className="space-y-6">
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Appointments" value={240} icon={Calendar} trend="+12% from last month" trendUp color="amber" />
        <StatCard title="New Leads" value={58} icon={Users} trend="+8% from last month" trendUp color="blue" />
        <StatCard title="Newsletter Subscribers" value={1247} icon={Mail} trend="+24% from last month" trendUp color="green" />
        <StatCard title="Published Articles" value={32} icon={FileText} trend="+5 this month" trendUp color="purple" />
      </section>

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
            <h3 className="text-lg font-semibold text-gray-900">Recent Inquiries</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-4">
                <div className="mb-1 flex items-start justify-between">
                  <p className="font-medium text-gray-900">{inquiry.name}</p>
                  <span className="text-xs text-gray-500">{inquiry.time}</span>
                </div>
                <p className="mb-1 text-sm text-gray-600">{inquiry.subject}</p>
                <p className="text-xs text-gray-500">{inquiry.email}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="p-4">
                <p className="mb-2 font-medium text-gray-900">{event.title}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{event.date}</span>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">
                    {event.attendees} attendees
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </section>
  )
}
