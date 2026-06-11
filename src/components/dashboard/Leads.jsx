import { useEffect, useMemo, useState } from 'react'
import { Filter, Mail, Phone, Search } from 'lucide-react'
import { createLead, deleteLead, listLeads, updateLead } from '../../api/leads'
import { readUser } from '../../auth/session'
import CreateEditLead from './CreateEditLead'
import { useToast } from '../ui/useToast'

function StatusBadge({ status }) {
  const styles = {
    new: { bg: 'bg-blue-100', text: 'text-blue-700' },
    contacted: { bg: 'bg-purple-100', text: 'text-purple-700' },
    qualified: { bg: 'bg-amber-100', text: 'text-amber-700' },
    converted: { bg: 'bg-green-100', text: 'text-green-700' },
    lost: { bg: 'bg-gray-100', text: 'text-gray-700' },
  }

  const key = String(status || 'new').toLowerCase()
  const style = styles[key] || styles.new

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${style.bg} ${style.text}`}>
      {key.charAt(0).toUpperCase() + key.slice(1)}
    </span>
  )
}

function formatDateOnly(value) {
  if (!value) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  const v = String(value)
  if (v.includes('T')) return v.split('T')[0]
  const m = v.match(/^(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : v
}

function truncateText(value, maxChars = 60) {
  const v = String(value || '')
  if (!v) return ''
  const n = Number(maxChars)
  if (!Number.isFinite(n) || n <= 0) return ''
  if (v.length <= n) return v
  return `${v.slice(0, n).trimEnd()}...`
}

export default function Leads() {
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const [leads, setLeads] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const [isDeleting, setIsDeleting] = useState(false)

  const totalPages = useMemo(() => {
    const t = Number(total || 0)
    const s = Number(pageSize || 20)
    if (!Number.isFinite(t) || t <= 0) return 1
    if (!Number.isFinite(s) || s <= 0) return 1
    return Math.max(1, Math.ceil(t / s))
  }, [pageSize, total])

  const refresh = async ({ nextPage } = {}) => {
    setError('')
    setIsLoading(true)
    try {
      const targetPage = Number.isFinite(Number(nextPage)) && Number(nextPage) > 0 ? Math.trunc(Number(nextPage)) : page
      const res = await listLeads({ page: targetPage, status: filterStatus, q: searchTerm })
      const rows = Array.isArray(res?.leads) ? res.leads : []
      setPage(Number(res?.page || targetPage) || targetPage)
      setPageSize(Number(res?.pageSize || 20) || 20)
      setTotal(Number(res?.total || 0) || 0)
      setLeads(
        rows.map((row) => ({
          id: row.id,
          fullName: row.full_name,
          email: row.email,
          contact: row.contact,
          source: row.source,
          status: String(row.status || 'new').toLowerCase(),
          followUp: formatDateOnly(row.follow_up),
          notes: row.notes || '',
          createdAt: row.created_at,
          addedBy: row.added_by,
        }))
      )
    } catch (err) {
      setError(err?.message || 'Failed to load leads')
      setLeads([])
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      refresh()
    }, searchTerm ? 300 : 0)
    return () => window.clearTimeout(timeoutId)
  }, [filterStatus, page, searchTerm])

  const handleSaveLead = async (leadData) => {
    setIsSaving(true)
    setError('')
    try {
      const payload = {
        full_name: leadData.fullName,
        email: leadData.email,
        contact: leadData.contact,
        source: leadData.source,
        status: leadData.status,
        follow_up: leadData.followUp || null,
        notes: leadData.notes,
      }

      if (editingLead?.id) {
        await updateLead(editingLead.id, payload)
        await refresh()
        toast.success('Lead updated successfully.')
        return
      }

      const user = readUser()
      const addedBy = user?.id
      if (!addedBy) {
        throw new Error('Missing logged-in user')
      }

      await createLead({ ...payload, added_by: addedBy })
      await refresh({ nextPage: 1 })
      toast.success('Lead created successfully.')
    } catch (err) {
      const message = err?.message || 'Failed to save lead'
      toast.error(message)
      throw err
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteEditingLead = async () => {
    if (!editingLead?.id) return
    setIsDeleting(true)
    setError('')
    try {
      await deleteLead(editingLead.id)
      await refresh()
      toast.success('Lead deleted successfully.')
    } catch (err) {
      const message = err?.message || 'Failed to delete lead'
      toast.error(message)
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  const stats = useMemo(
    () => [
      { label: 'Total Leads', value: total },
      { label: 'New', value: leads.filter((l) => l.status === 'new').length },
      { label: 'Qualified', value: leads.filter((l) => l.status === 'qualified').length },
      { label: 'Converted', value: leads.filter((l) => l.status === 'converted').length },
    ],
    [leads, total]
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
          onClick={() => {
            setEditingLead(null)
            setShowModal(true)
          }}
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
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value)
                setPage(1)
              }}
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
        {error ? (
          <section className="border-b border-red-200 bg-red-50 px-6 py-3 text-sm text-red-700">{error}</section>
        ) : null}
        {isLoading ? (
          <section className="border-b border-gray-100 bg-white px-6 py-3 text-sm text-gray-600">Loading leads...</section>
        ) : null}
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
              {leads.map((lead) => (
                <tr key={lead.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{lead.fullName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        {lead.contact}
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
                    <p className="text-sm text-gray-900">{lead.followUp || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{truncateText(lead.notes, 60)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLead(lead)
                        setShowModal(true)
                      }}
                      className="text-sm font-medium text-amber-600 hover:text-amber-700"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages} • {total} total
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, Number(p || 1) - 1))}
            disabled={isLoading || page <= 1}
            className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, Number(p || 1) + 1))}
            disabled={isLoading || page >= totalPages}
            className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </section>
      {showModal ? (
        <CreateEditLead
          mode={editingLead?.id ? 'edit' : 'create'}
          lead={
            editingLead?.id
              ? {
                  id: editingLead.id,
                  fullName: editingLead.fullName,
                  email: editingLead.email,
                  contact: editingLead.contact,
                  source: editingLead.source,
                  status: editingLead.status,
                  followUp: editingLead.followUp,
                  notes: editingLead.notes,
                }
              : null
          }
          isSaving={isSaving}
          isDeleting={isDeleting}
          onClose={() => {
            setShowModal(false)
            setEditingLead(null)
          }}
          onSave={handleSaveLead}
          onDelete={handleDeleteEditingLead}
        />
      ) : null}
    </section>
  )
}
