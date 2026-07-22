import { useState } from 'react'
import { FileText, Save, Trash2, Upload, X } from 'lucide-react'
import ConfirmModal from '../ui/ConfirmModal'

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

export default function CreateEditDatasheet({
  onClose,
  onSave,
  onDelete,
  datasheet,
  mode,
  isSaving = false,
  isDeleting = false,
}) {
  const canDelete = mode === 'edit'
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    filePath: '',
    fileName: '',
    size: null,
    status: 'active',
    ...(datasheet || {}),
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const next = {}
    if (!String(formData.title || '').trim()) next.title = 'Title is required'
    if (!String(formData.filePath || '').trim()) next.filePath = 'PDF file is required'
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
      setSubmitError(err?.message || 'Failed to save datasheet')
    }
  }

  const confirmDelete = async () => {
    if (!canDelete) return
    setSubmitError('')
    try {
      await onDelete?.()
      onClose()
    } catch (err) {
      setSubmitError(err?.message || 'Failed to delete datasheet')
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
              <h2 className="text-xl font-semibold text-gray-900">{mode === 'create' ? 'Add Datasheet' : 'Edit Datasheet'}</h2>
              <p className="mt-1 text-sm text-gray-500">{mode === 'create' ? 'Upload a new PDF datasheet' : 'Update datasheet details'}</p>
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
              {isSaving ? 'Saving...' : mode === 'create' ? 'Create Datasheet' : 'Update Datasheet'}
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="flex-1 overflow-y-auto p-8">
          {submitError ? (
            <section className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{submitError}</section>
          ) : null}

          <div className="grid grid-cols-1 gap-6">
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                <FileText className="h-5 w-5 text-amber-500" />
                Datasheet Details
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    disabled={isSaving}
                    className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.title ? <p className="mt-1 text-xs text-red-500">{errors.title}</p> : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={String(formData.status || 'active').toLowerCase()}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    disabled={isSaving}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Long description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={isSaving}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Describe what this datasheet contains..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">PDF file *</label>
                  <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Upload className="h-4 w-4" />
                      Select PDF
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        disabled={isSaving}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          const reader = new FileReader()
                          reader.onload = () => {
                            const result = typeof reader.result === 'string' ? reader.result : ''
                            setFormData((prev) => ({
                              ...prev,
                              fileName: file.name,
                              filePath: result,
                              size: Number(file.size || 0) || null,
                            }))
                          }
                          reader.onerror = () => {
                            setFormData((prev) => ({
                              ...prev,
                              fileName: '',
                              filePath: '',
                              size: null,
                            }))
                          }
                          reader.readAsDataURL(file)
                        }}
                      />
                    </label>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-medium text-gray-600">File</label>
                        <input
                          type="text"
                          value={formData.fileName || (String(formData.filePath || '').trim().startsWith('data:') ? '' : formData.filePath)}
                          onChange={(e) => setFormData({ ...formData, fileName: '', filePath: e.target.value })}
                          disabled={isSaving}
                          className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                            errors.filePath ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="Paste a URL or select a PDF"
                        />
                        {errors.filePath ? <p className="mt-1 text-xs text-red-500">{errors.filePath}</p> : null}
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">Size</label>
                        <input
                          type="text"
                          value={formData.size ? formatBytes(formData.size) : ''}
                          disabled
                          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
                          placeholder="—"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </form>
      </div>

      <ConfirmModal
        open={confirmDeleteOpen}
        message={`Delete datasheet "${String(formData.title || '')}"? This action cannot be undone.`}
        onCancel={() => (isDeleting ? null : setConfirmDeleteOpen(false))}
        onConfirm={confirmDelete}
        isConfirming={isDeleting}
        confirmLabel="Yes, delete"
      />
    </div>
  )
}
