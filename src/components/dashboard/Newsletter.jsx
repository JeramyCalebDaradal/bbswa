import { useMemo, useState } from 'react'
import {
  Bold,
  Calendar,
  Download,
  Eye,
  Image as ImageIcon,
  Italic,
  Link,
  List,
  ListOrdered,
  Mail,
  Save,
  Search,
  Send,
  Underline,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react'

function StatusBadge({ status }) {
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
        <UserCheck className="h-3 w-3" />
        Active
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
      <UserX className="h-3 w-3" />
      Unsubscribed
    </span>
  )
}

export default function Newsletter() {
  const [activeTab, setActiveTab] = useState('subscribers')
  const [searchTerm, setSearchTerm] = useState('')

  const subscribers = useMemo(
    () => [
      { id: 1, email: 'john.doe@company.com', name: 'John Doe', dateSubscribed: '2026-05-15', status: 'active', source: 'Website Footer' },
      { id: 2, email: 'jane.smith@business.com', name: 'Jane Smith', dateSubscribed: '2026-05-20', status: 'active', source: 'Blog Post' },
      { id: 3, email: 'robert.johnson@tech.io', name: 'Robert Johnson', dateSubscribed: '2026-05-18', status: 'active', source: 'Event Registration' },
      { id: 4, email: 'emily.brown@startup.com', name: 'Emily Brown', dateSubscribed: '2026-04-10', status: 'unsubscribed', source: 'Website Footer' },
      { id: 5, email: 'michael.wilson@enterprise.com', name: 'Michael Wilson', dateSubscribed: '2026-05-25', status: 'active', source: 'Webinar' },
    ],
    []
  )

  const filteredSubscribers = useMemo(() => {
    const needle = searchTerm.toLowerCase()
    return subscribers.filter((sub) => sub.email.toLowerCase().includes(needle) || sub.name.toLowerCase().includes(needle))
  }, [searchTerm, subscribers])

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Date Subscribed', 'Status', 'Source'],
      ...subscribers.map((sub) => [sub.name, sub.email, sub.dateSubscribed, sub.status, sub.source]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'newsletter-subscribers.csv'
    a.click()
  }

  const [emailSubject, setEmailSubject] = useState('')
  const [emailPreheader, setEmailPreheader] = useState('')
  const [emailContent, setEmailContent] = useState('')
  const [scheduleDate, setScheduleDate] = useState('')
  const [selectedSegment, setSelectedSegment] = useState('all')

  const recipientCount =
    selectedSegment === 'all' ? '2,341' : selectedSegment === 'active' ? '2,180' : selectedSegment === 'new' ? '247' : '892'

  return (
    <section className="space-y-6">
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Newsletter</h2>
          <p className="mt-1 text-gray-600">Manage subscribers and create email campaigns</p>
        </div>
        {activeTab === 'subscribers' ? (
          <button
            type="button"
            onClick={exportToCSV}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-white shadow-sm transition-all hover:from-amber-600 hover:to-amber-700"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        ) : null}
      </section>

      <section className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('subscribers')}
            className={`border-b-2 px-1 pb-3 transition-colors ${
              activeTab === 'subscribers' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="font-medium">Subscribers</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`border-b-2 px-1 pb-3 transition-colors ${
              activeTab === 'create' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <span className="font-medium">Create Email</span>
            </div>
          </button>
        </div>
      </section>

      {activeTab === 'subscribers' ? (
        <section className="space-y-6">
          <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="mb-1 text-sm text-gray-600">Total Subscribers</p>
              <p className="text-2xl font-semibold text-gray-900">{subscribers.length}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="mb-1 text-sm text-gray-600">Active</p>
              <p className="text-2xl font-semibold text-gray-900">{subscribers.filter((s) => s.status === 'active').length}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="mb-1 text-sm text-gray-600">Unsubscribed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {subscribers.filter((s) => s.status === 'unsubscribed').length}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="mb-1 text-sm text-gray-600">Growth Rate</p>
              <p className="text-2xl font-semibold text-gray-900">+18%</p>
            </div>
          </section>

          <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search subscribers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Subscriber</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Date Subscribed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200">
                            <Mail className="h-5 w-5 text-amber-600" />
                          </div>
                          <p className="font-medium text-gray-900">{subscriber.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{subscriber.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{subscriber.dateSubscribed}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{subscriber.source}</p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={subscriber.status} />
                      </td>
                      <td className="px-6 py-4">
                        <button type="button" className="text-sm font-medium text-amber-600 hover:text-amber-700">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      ) : null}

      {activeTab === 'create' ? (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2">
            <section className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">Email Details</h3>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Subject Line</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Your email subject line..."
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="mt-1 text-xs text-gray-500">Keep it under 50 characters for best results</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Preheader Text</label>
                <input
                  type="text"
                  value={emailPreheader}
                  onChange={(e) => setEmailPreheader(e.target.value)}
                  placeholder="Preview text that appears after subject..."
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Recipient Segment</label>
                <select
                  value={selectedSegment}
                  onChange={(e) => setSelectedSegment(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">All Subscribers (2,341)</option>
                  <option value="active">Active Subscribers (2,180)</option>
                  <option value="new">New Subscribers (Last 30 days) (247)</option>
                  <option value="engaged">Highly Engaged (892)</option>
                </select>
              </div>
            </section>

            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">Email Content</h3>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Choose Template</label>
                <div className="grid grid-cols-3 gap-3">
                  <button type="button" className="rounded-lg border-2 border-amber-500 bg-amber-50 p-3 text-sm">
                    <div className="mb-2 flex aspect-video items-center justify-center rounded bg-white">
                      <Mail className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="font-medium text-gray-900">Newsletter</p>
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-gray-200 p-3 text-sm transition-colors hover:border-amber-500 hover:bg-amber-50"
                  >
                    <div className="mb-2 flex aspect-video items-center justify-center rounded bg-gray-100">
                      <Send className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="font-medium text-gray-700">Announcement</p>
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-gray-200 p-3 text-sm transition-colors hover:border-amber-500 hover:bg-amber-50"
                  >
                    <div className="mb-2 flex aspect-video items-center justify-center rounded bg-gray-100">
                      <Calendar className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="font-medium text-gray-700">Event</p>
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
                  <button type="button" className="rounded p-2 transition-colors hover:bg-gray-200" title="Bold">
                    <Bold className="h-4 w-4" />
                  </button>
                  <button type="button" className="rounded p-2 transition-colors hover:bg-gray-200" title="Italic">
                    <Italic className="h-4 w-4" />
                  </button>
                  <button type="button" className="rounded p-2 transition-colors hover:bg-gray-200" title="Underline">
                    <Underline className="h-4 w-4" />
                  </button>
                  <div className="mx-1 w-px bg-gray-300" />
                  <button type="button" className="rounded p-2 transition-colors hover:bg-gray-200" title="Bullet List">
                    <List className="h-4 w-4" />
                  </button>
                  <button type="button" className="rounded p-2 transition-colors hover:bg-gray-200" title="Numbered List">
                    <ListOrdered className="h-4 w-4" />
                  </button>
                  <div className="mx-1 w-px bg-gray-300" />
                  <button type="button" className="rounded p-2 transition-colors hover:bg-gray-200" title="Link">
                    <Link className="h-4 w-4" />
                  </button>
                  <button type="button" className="rounded p-2 transition-colors hover:bg-gray-200" title="Image">
                    <ImageIcon className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Write your email content here..."
                  className="min-h-[400px] w-full resize-none p-4 focus:outline-none"
                />
              </div>
            </section>

            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">Email Footer</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="company-info" className="h-4 w-4 rounded text-amber-600" defaultChecked />
                  <label htmlFor="company-info" className="text-sm text-gray-700">
                    Include company information
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="social-links" className="h-4 w-4 rounded text-amber-600" defaultChecked />
                  <label htmlFor="social-links" className="text-sm text-gray-700">
                    Include social media links
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="unsubscribe" className="h-4 w-4 rounded text-amber-600" defaultChecked disabled />
                  <label htmlFor="unsubscribe" className="text-sm text-gray-700">
                    Include unsubscribe link (Required)
                  </label>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">Schedule & Send</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Send Time</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="send-time" value="now" defaultChecked className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-gray-700">Send Immediately</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="send-time" value="schedule" className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-gray-700">Schedule for Later</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Schedule Date & Time</label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Save className="h-4 w-4" />
                    Save Draft
                  </button>
                  <button
                    type="button"
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </button>
                  <button
                    type="button"
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-white transition-all hover:from-amber-600 hover:to-amber-700"
                  >
                    <Send className="h-4 w-4" />
                    Send Email
                  </button>
                </div>
              </div>
            </section>
          </section>

          <section className="lg:col-span-1">
            <div className="sticky top-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">Email Preview</h3>

              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="border-b border-gray-200 bg-gray-50 p-3">
                  <p className="mb-1 text-xs text-gray-500">From: Black Bear Securities</p>
                  <p className="truncate text-sm font-medium text-gray-900">{emailSubject || 'Email Subject Line'}</p>
                  {emailPreheader ? <p className="mt-1 truncate text-xs text-gray-600">{emailPreheader}</p> : null}
                </div>

                <div className="bg-white p-4">
                  <div className="mb-4">
                    <div className="mb-4 flex h-16 w-full items-center justify-center rounded bg-gradient-to-r from-amber-500 to-amber-600">
                      <span className="font-semibold text-white">Black Bear Securities</span>
                    </div>
                  </div>

                  <div className="max-w-none">
                    <p className="whitespace-pre-wrap text-sm text-gray-700">{emailContent || 'Your email content will appear here...'}</p>
                  </div>

                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <div className="mb-3 flex justify-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-gray-200" />
                      <div className="h-6 w-6 rounded-full bg-gray-200" />
                      <div className="h-6 w-6 rounded-full bg-gray-200" />
                    </div>
                    <p className="text-center text-xs text-gray-500">© 2026 Black Bear Securities</p>
                    <p className="mt-1 text-center text-xs text-gray-400">
                      <a href="#" className="underline">
                        Unsubscribe
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Recipients:</span>
                  <span className="font-medium text-gray-900">{recipientCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Estimated Open Rate:</span>
                  <span className="font-medium text-gray-900">24-28%</span>
                </div>
              </div>
            </div>
          </section>
        </section>
      ) : null}
    </section>
  )
}

