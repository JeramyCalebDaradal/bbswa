import { useMemo, useState } from 'react'
import { Filter, Mail, Phone, Search, User } from 'lucide-react'

function StatusBadge({ status }) {
  const styles = {
    new: { bg: 'bg-blue-100', text: 'text-blue-700' },
    contacted: { bg: 'bg-purple-100', text: 'text-purple-700' },
    qualified: { bg: 'bg-amber-100', text: 'text-amber-700' },
    converted: { bg: 'bg-green-100', text: 'text-green-700' },
    lost: { bg: 'bg-gray-100', text: 'text-gray-700' },
  }

  const style = styles[status] || styles.new

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${style.bg} ${style.text}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default function Leads() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const leads = useMemo(
    () => [
      {
        id: 1,
        name: 'Alex Thompson',
        email: 'alex.t@corporation.com',
        phone: '+1 (555) 111-2222',
        source: 'Website Contact',
        status: 'new',
        followUpDate: '2026-06-05',
        notes: 'Interested in enterprise security solutions',
      },
      {
        id: 2,
        name: 'Jennifer Martinez',
        email: 'j.martinez@startup.com',
        phone: '+1 (555) 222-3333',
        source: 'Event Registration',
        status: 'contacted',
        followUpDate: '2026-06-08',
        notes: 'Attended cybersecurity webinar, needs compliance help',
      },
      {
        id: 3,
        name: 'Robert Park',
        email: 'robert.p@business.io',
        phone: '+1 (555) 333-4444',
        source: 'Newsletter Signup',
        status: 'qualified',
        followUpDate: '2026-06-10',
        notes: 'Large organization, budget approved for Q3',
      },
      {
        id: 4,
        name: 'Maria Garcia',
        email: 'm.garcia@tech.com',
        phone: '+1 (555) 444-5555',
        source: 'Referral',
        status: 'converted',
        followUpDate: '2026-06-15',
        notes: 'Converted to client - signed annual contract',
      },
      {
        id: 5,
        name: 'James Wilson',
        email: 'james.w@company.net',
        phone: '+1 (555) 555-6666',
        source: 'LinkedIn',
        status: 'lost',
        followUpDate: '',
        notes: 'Chose competitor, budget constraints',
      },
    ],
    []
  )

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const needle = searchTerm.toLowerCase()
      const matchesSearch =
        lead.name.toLowerCase().includes(needle) ||
        lead.email.toLowerCase().includes(needle) ||
        lead.source.toLowerCase().includes(needle)

      const matchesFilter = filterStatus === 'all' || lead.status === filterStatus
      return matchesSearch && matchesFilter
    })
  }, [filterStatus, leads, searchTerm])

  const stats = useMemo(
    () => [
      { label: 'Total Leads', value: leads.length },
      { label: 'New', value: leads.filter((l) => l.status === 'new').length },
      { label: 'Qualified', value: leads.filter((l) => l.status === 'qualified').length },
      { label: 'Converted', value: leads.filter((l) => l.status === 'converted').length },
    ],
    [leads]
  )

  return (
    <section className="space-y-6">
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Leads</h2>
          <p className="mt-1 text-gray-600">Track and manage potential clients</p>
        </div>
        <button
          type="button"
          className="cursor-pointer rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-white shadow-sm transition-all hover:from-amber-600 hover:to-amber-700"
        >
          + Add Lead
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-1 text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Follow-Up
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Notes</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <p className="font-medium text-gray-900">{lead.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{lead.source}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{lead.followUpDate || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="max-w-xs truncate text-sm text-gray-600">{lead.notes}</p>
                  </td>
                  <td className="px-6 py-4">
                    <button type="button" className="text-sm font-medium text-amber-600 hover:text-amber-700">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}

