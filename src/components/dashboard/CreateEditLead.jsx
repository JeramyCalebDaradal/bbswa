import { useMemo, useState } from 'react'
import { Mail, Phone, Save, Trash2, User, X } from 'lucide-react'
import ConfirmModal from '../ui/ConfirmModal'

export default function CreateEditLead({ onClose, onSave, onDelete, lead, mode, isSaving = false, isDeleting = false }) {
  const sources = useMemo(
    () => ['Website contact', 'Event Registration', 'Newsletter signup', 'Referral', 'LinkedIn'],
    []
  )

  const canDelete = mode === 'edit'

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contact: '',
    source: '',
    status: 'new',
    followUp: '',
    notes: '',
    ...(lead || {}),
  })

  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const validate = () => {
    const next = {}

    if (!formData.fullName.trim()) next.fullName = 'Full name is required'
    if (!formData.email.trim()) next.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) next.email = 'Invalid email address'
    if (!formData.contact.trim()) next.contact = 'Contact is required'
    if (!formData.source) next.source = 'Source is required'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (e) => {
    e?.preventDefault?.()
    if (!validate()) return
    setSubmitError('')
    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      setSubmitError(err?.message || 'Failed to save lead')
    }
  }

  const confirmDelete = async () => {
    if (!canDelete) return
    setSubmitError('')
    try {
      await onDelete?.()
      onClose()
    } catch (err) {
      setSubmitError(err?.message || 'Failed to delete lead')
    } finally {
      setConfirmDeleteOpen(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-amber-50 to-white px-8 py-4">
          <div className="flex items-center gap-4">
            <button type="button" onClick={onClose} className="rounded-lg p-2 transition-colors hover:bg-gray-100" aria-label="Close">
              <X className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{mode === 'create' ? 'Add Lead' : 'Edit Lead'}</h2>
              <p className="mt-1 text-sm text-gray-500">{mode === 'create' ? 'Create a new lead' : 'Update lead details'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {canDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDeleteOpen(true)}
                disabled={isSaving || isDeleting}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            ) : null}
            <button
              type="button"
              onClick={submit}
              disabled={isSaving || isDeleting}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-white transition-all hover:from-amber-600 hover:to-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : mode === 'create' ? 'Create Lead' : 'Update Lead'}
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="flex-1 overflow-y-auto p-8">
          {submitError ? (
            <section className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {submitError}
            </section>
          ) : null}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                <User className="h-5 w-5 text-amber-500" />
                Lead Information
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    disabled={isSaving}
                    className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.fullName ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.fullName ? <p className="mt-1 text-xs text-red-500">{errors.fullName}</p> : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isSaving}
                      className={`w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.email ? <p className="mt-1 text-xs text-red-500">{errors.email}</p> : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Contact *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      disabled={isSaving}
                      className={`w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.contact ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.contact ? <p className="mt-1 text-xs text-red-500">{errors.contact}</p> : null}
                </div>
              </div>
            </section>

            <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 font-semibold text-gray-900">Lead Details</h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Source *</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    disabled={isSaving}
                    className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.source ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select a source...</option>
                    {sources.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.source ? <p className="mt-1 text-xs text-red-500">{errors.source}</p> : null}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
                  <div className="flex flex-wrap gap-4">
                    {['new', 'contacted', 'qualified', 'converted', 'lost'].map((s) => (
                      <label key={s} className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="status"
                          value={s}
                          checked={String(formData.status || 'new').toLowerCase() === s}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          disabled={isSaving}
                          className="h-4 w-4 text-amber-600"
                        />
                        <span className="capitalize text-gray-700">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Follow-up</label>
                  <input
                    type="date"
                    value={formData.followUp || ''}
                    onChange={(e) => setFormData({ ...formData, followUp: e.target.value })}
                    disabled={isSaving}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </section>

            <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                disabled={isSaving}
                rows={5}
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Add notes about this lead..."
              />
            </section>
          </div>
        </form>
      </div>
      <ConfirmModal
        open={confirmDeleteOpen}
        message={`Delete lead "${formData.fullName || ''}"? This action cannot be undone.`}
        onCancel={() => (isDeleting ? null : setConfirmDeleteOpen(false))}
        onConfirm={confirmDelete}
        isConfirming={isDeleting}
        confirmLabel="Yes, delete"
      />
    </div>
  )
}
