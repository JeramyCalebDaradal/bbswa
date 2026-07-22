import { useState } from 'react'
import { Calendar, MapPin, Save, Tag, Upload, X, ImageIcon } from 'lucide-react'
import { useToast } from '../ui/useToast'

export default function CreateEditEvent({ mode, event, onClose, onSave, isSaving }) {
  const toast = useToast()
  const [formData, setFormData] = useState({
    title: '',
    preview_image: '',
    date: '',
    time: '',
    location_type: 'online',
    location_address: '',
    description: '',
    category: 'Webinar',
    capacity: 100,
    paid_event: false,
    tags: '',
    ...(event || {}),
  })
  const [submitError, setSubmitError] = useState('')

  const handlePreviewImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setFormData((prev) => ({ ...prev, preview_image: String(reader.result || '') }))
    reader.readAsDataURL(file)
  }

  const submit = async (e) => {
    e?.preventDefault?.()
    setSubmitError('')
    const normalized = {
      ...formData,
      tags: Array.isArray(formData.tags)
        ? formData.tags
        : String(formData.tags || '')
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
      capacity: Number(formData.capacity || 0),
      paid_event: Boolean(formData.paid_event),
    }
    try {
      await onSave(normalized)
      onClose()
    } catch (err) {
      const message = err?.message || 'Failed to save event'
      setSubmitError(message)
      toast.error(message)
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
              <h2 className="text-xl font-semibold text-gray-900">{mode === 'create' ? 'New Event' : 'Edit Event'}</h2>
              <p className="mt-1 text-sm text-gray-500">{mode === 'create' ? 'Create a new event' : 'Update event details'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={isSaving}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-white transition-all hover:from-amber-600 hover:to-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {isSaving ? (mode === 'create' ? 'Creating...' : 'Updating...') : mode === 'create' ? 'Create Event' : 'Update Event'}
          </button>
        </div>

        <form onSubmit={submit} className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={isSaving}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </section>

            <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Preview image</label>
              {!formData.preview_image ? (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-amber-500">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePreviewImageUpload}
                    className="hidden"
                    disabled={isSaving}
                  />
                  <Upload className="mb-3 h-12 w-12 text-gray-400" />
                  <p className="mb-1 font-medium text-gray-700">Attach image</p>
                  <p className="text-sm text-gray-500">Click to upload a preview image</p>
                </label>
              ) : (
                <div className="group relative overflow-hidden rounded-lg border border-gray-200">
                  <img src={formData.preview_image} alt="Preview" className="h-56 w-full object-cover" loading="lazy" width="800" height="225" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                    <label className="hidden cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all group-hover:inline-flex hover:bg-gray-100">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePreviewImageUpload}
                        className="hidden"
                        disabled={isSaving}
                      />
                      <ImageIcon className="h-4 w-4" />
                      Change Image
                    </label>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  disabled={isSaving}
                  className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                disabled={isSaving}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </section>

            <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Location Type</label>
              <div className="flex gap-4">
                {[
                  { id: 'online', label: 'Online' },
                  { id: 'in person', label: 'In Person' },
                ].map((opt) => (
                  <label key={opt.id} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="locationType"
                      value={opt.id}
                      checked={formData.location_type === opt.id}
                      onChange={(e) => setFormData({ ...formData, location_type: e.target.value })}
                      disabled={isSaving}
                      className="h-4 w-4 text-amber-600"
                    />
                    <span className="text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
              <div className="relative mt-4">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={formData.location_address}
                  onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                  disabled={isSaving}
                  placeholder={formData.location_type === 'online' ? 'Meeting link or platform' : 'Venue address'}
                  className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </section>

            <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                disabled={isSaving}
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
              <input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={isSaving}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                disabled={isSaving}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Paid Event</label>
                <input
                  type="checkbox"
                  checked={formData.paid_event}
                  onChange={(e) => setFormData({ ...formData, paid_event: e.target.checked })}
                  disabled={isSaving}
                  className="h-4 w-4 rounded text-amber-600"
                />
              </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Tags</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  disabled={isSaving}
                  placeholder="Cybersecurity, Training"
                  className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </section>
          </div>

          {submitError ? (
            <section className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </section>
          ) : null}
        </form>
      </div>
    </div>
  )
}
