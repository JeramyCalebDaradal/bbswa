import { useState } from 'react'
import { Save, Trash2, Upload, Video, X } from 'lucide-react'
import ConfirmModal from '../ui/ConfirmModal'

export default function CreateEditInfoVideo({
  onClose,
  onSave,
  onDelete,
  video,
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
    status: 'active',
    ...(video || {}),
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const next = {}
    if (!String(formData.title || '').trim()) next.title = 'Title is required'
    if (!String(formData.filePath || '').trim()) next.filePath = 'Video file is required'
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
      setSubmitError(err?.message || 'Failed to save informational video')
    }
  }

  const confirmDelete = async () => {
    if (!canDelete) return
    setSubmitError('')
    try {
      await onDelete?.()
      onClose()
    } catch (err) {
      setSubmitError(err?.message || 'Failed to delete informational video')
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
              <h2 className="text-xl font-semibold text-gray-900">{mode === 'create' ? 'Add Informational Video' : 'Edit Informational Video'}</h2>
              <p className="mt-1 text-sm text-gray-500">{mode === 'create' ? 'Upload a new video file' : 'Update video details'}</p>
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
              {isSaving ? 'Saving...' : mode === 'create' ? 'Create Video' : 'Update Video'}
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
                <Video className="h-5 w-5 text-amber-500" />
                Video Details
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
                    placeholder="Describe what this video is about..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Video file *</label>
                  <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Upload className="h-4 w-4" />
                      Select video
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        disabled={isSaving}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setFormData((prev) => ({
                            ...prev,
                            filePath: file.name,
                          }))
                        }}
                      />
                    </label>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">File path</label>
                      <input
                        type="text"
                        value={formData.filePath}
                        onChange={(e) => setFormData({ ...formData, filePath: e.target.value })}
                        disabled={isSaving}
                        className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                          errors.filePath ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="example.mp4"
                      />
                      {errors.filePath ? <p className="mt-1 text-xs text-red-500">{errors.filePath}</p> : null}
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
        message={`Delete informational video "${String(formData.title || '')}"? This action cannot be undone.`}
        onCancel={() => (isDeleting ? null : setConfirmDeleteOpen(false))}
        onConfirm={confirmDelete}
        isConfirming={isDeleting}
        confirmLabel="Yes, delete"
      />
    </div>
  )
}
