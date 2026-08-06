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
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!String(formData.title || '').trim()) nextErrors.title = 'Title is required'
    if (!formData.date) nextErrors.date = 'Date is required'
    if (!formData.time) nextErrors.time = 'Time is required'
    if (!String(formData.location_address || '').trim()) {
      nextErrors.location_address = formData.location_type === 'online' ? 'Meeting link or platform is required' : 'Venue address is required'
    }
    if (!String(formData.description || '').trim()) nextErrors.description = 'Description is required'
    if (!String(formData.category || '').trim()) nextErrors.category = 'Category is required'
    if (formData.capacity === '' || !Number.isFinite(Number(formData.capacity)) || Number(formData.capacity) < 0) {
      nextErrors.capacity = 'Capacity must be zero or greater'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setSubmitError('Please fill in all required fields before continuing.')
      return false
    }
    return true
  }

  const handlePreviewImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => updateField('preview_image', String(reader.result || ''))
    reader.readAsDataURL(file)
  }

  const submit = async (e) => {
    e?.preventDefault?.()
    setSubmitError('')
    if (!validate()) return

    const normalized = {
      ...formData,
      title: String(formData.title).trim(),
      location_address: String(formData.location_address).trim(),
      description: String(formData.description).trim(),
      category: String(formData.category).trim(),
      tags: Array.isArray(formData.tags)
        ? formData.tags
        : String(formData.tags || '')
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
      capacity: Number(formData.capacity),
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

  const inputClass = (field) =>
    `w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors[field] ? 'border-red-500' : 'border-gray-200'}`

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

        <form onSubmit={submit} className="flex-1 overflow-y-auto p-8" noValidate>
          <p className="mb-6 text-sm text-gray-500"><span className="text-red-500">*</span> Required fields</p>

          {submitError ? (
            <section className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {submitError}
            </section>
          ) : null}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
              <label htmlFor="event-title" className="mb-2 block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
              <input
                id="event-title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                disabled={isSaving}
                required
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? 'event-title-error' : undefined}
                className={inputClass('title')}
              />
              {errors.title ? <p id="event-title-error" className="mt-1 text-xs text-red-500">{errors.title}</p> : null}
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">Preview image</label>
              {!formData.preview_image ? (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-amber-500">
                  <input type="file" accept="image/*" onChange={handlePreviewImageUpload} className="hidden" disabled={isSaving} />
                  <Upload className="mb-3 h-12 w-12 text-gray-400" />
                  <p className="mb-1 font-medium text-gray-700">Attach image</p>
                  <p className="text-sm text-gray-500">Click to upload a preview image</p>
                </label>
              ) : (
                <div className="group relative overflow-hidden rounded-lg border border-gray-200">
                  <img src={formData.preview_image} alt="Preview" className="h-56 w-full object-cover" loading="lazy" width="800" height="225" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                    <label className="hidden cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all group-hover:inline-flex hover:bg-gray-100">
                      <input type="file" accept="image/*" onChange={handlePreviewImageUpload} className="hidden" disabled={isSaving} />
                      <ImageIcon className="h-4 w-4" />
                      Change Image
                    </label>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <label htmlFor="event-date" className="mb-2 block text-sm font-medium text-gray-700">Date <span className="text-red-500">*</span></label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="event-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  disabled={isSaving}
                  required
                  aria-invalid={Boolean(errors.date)}
                  className={`w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.date ? 'border-red-500' : 'border-gray-200'}`}
                />
              </div>
              {errors.date ? <p className="mt-1 text-xs text-red-500">{errors.date}</p> : null}
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <label htmlFor="event-time" className="mb-2 block text-sm font-medium text-gray-700">Time <span className="text-red-500">*</span></label>
              <input
                id="event-time"
                type="time"
                value={formData.time}
                onChange={(e) => updateField('time', e.target.value)}
                disabled={isSaving}
                required
                aria-invalid={Boolean(errors.time)}
                className={inputClass('time')}
              />
              {errors.time ? <p className="mt-1 text-xs text-red-500">{errors.time}</p> : null}
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">Location Type <span className="text-red-500">*</span></label>
              <div className="flex gap-4">
                {[
                  { id: 'online', label: 'Online' },
                  { id: 'in person', label: 'In Person' },
                ].map((option) => (
                  <label key={option.id} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="locationType"
                      value={option.id}
                      checked={formData.location_type === option.id}
                      onChange={(e) => updateField('location_type', e.target.value)}
                      disabled={isSaving}
                      required
                      className="h-4 w-4 text-amber-600"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
              <label htmlFor="event-location" className="mb-2 mt-4 block text-sm font-medium text-gray-700">
                {formData.location_type === 'online' ? 'Meeting link or platform' : 'Venue address'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="event-location"
                  value={formData.location_address}
                  onChange={(e) => updateField('location_address', e.target.value)}
                  disabled={isSaving}
                  required
                  aria-invalid={Boolean(errors.location_address)}
                  placeholder={formData.location_type === 'online' ? 'Meeting link or platform' : 'Venue address'}
                  className={`w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.location_address ? 'border-red-500' : 'border-gray-200'}`}
                />
              </div>
              {errors.location_address ? <p className="mt-1 text-xs text-red-500">{errors.location_address}</p> : null}
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
              <label htmlFor="event-description" className="mb-2 block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
              <textarea
                id="event-description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
                disabled={isSaving}
                required
                aria-invalid={Boolean(errors.description)}
                className={`${inputClass('description')} resize-none`}
              />
              {errors.description ? <p className="mt-1 text-xs text-red-500">{errors.description}</p> : null}
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <label htmlFor="event-category" className="mb-2 block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
              <input
                id="event-category"
                value={formData.category}
                onChange={(e) => updateField('category', e.target.value)}
                disabled={isSaving}
                required
                aria-invalid={Boolean(errors.category)}
                className={inputClass('category')}
              />
              {errors.category ? <p className="mt-1 text-xs text-red-500">{errors.category}</p> : null}
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <label htmlFor="event-capacity" className="mb-2 block text-sm font-medium text-gray-700">Capacity <span className="text-red-500">*</span></label>
              <input
                id="event-capacity"
                type="number"
                min="0"
                value={formData.capacity}
                onChange={(e) => updateField('capacity', e.target.value)}
                disabled={isSaving}
                required
                aria-invalid={Boolean(errors.capacity)}
                className={inputClass('capacity')}
              />
              {errors.capacity ? <p className="mt-1 text-xs text-red-500">{errors.capacity}</p> : null}
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Paid Event</label>
                <input
                  type="checkbox"
                  checked={formData.paid_event}
                  onChange={(e) => updateField('paid_event', e.target.checked)}
                  disabled={isSaving}
                  className="h-4 w-4 rounded text-amber-600"
                />
              </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <label htmlFor="event-tags" className="mb-2 block text-sm font-medium text-gray-700">Tags</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="event-tags"
                  value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                  onChange={(e) => updateField('tags', e.target.value)}
                  disabled={isSaving}
                  placeholder="Cybersecurity, Training"
                  className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  )
}
