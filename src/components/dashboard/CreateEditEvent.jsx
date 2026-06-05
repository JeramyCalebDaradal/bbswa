import { useState } from 'react'
import { Calendar, DollarSign, MapPin, Save, Tag, X } from 'lucide-react'

export default function CreateEditEvent({ mode, event, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    locationType: 'online',
    location: '',
    description: '',
    category: 'Webinar',
    isPaid: false,
    price: 0,
    maxCapacity: 100,
    registrationOpen: true,
    tags: '',
    contactEmail: 'events@blackbearsecurities.com',
    contactPhone: '+1 (555) 000-0000',
    ...(event || {}),
  })

  const submit = (e) => {
    e?.preventDefault?.()
    const normalized = {
      ...formData,
      tags: Array.isArray(formData.tags) ? formData.tags : String(formData.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      price: Number(formData.price || 0),
      maxCapacity: Number(formData.maxCapacity || 0),
    }
    onSave(normalized)
    onClose()
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
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-white transition-all hover:from-amber-600 hover:to-amber-700"
          >
            <Save className="h-4 w-4" />
            {mode === 'create' ? 'Create Event' : 'Update Event'}
          </button>
        </div>

        <form onSubmit={submit} className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </section>

            <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Location Type</label>
              <div className="flex gap-4">
                {[
                  { id: 'online', label: 'Online' },
                  { id: 'physical', label: 'In Person' },
                ].map((opt) => (
                  <label key={opt.id} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="locationType"
                      value={opt.id}
                      checked={formData.locationType === opt.id}
                      onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                      className="h-4 w-4 text-amber-600"
                    />
                    <span className="text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
              <div className="relative mt-4">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder={formData.locationType === 'online' ? 'Online (Zoom)' : 'Venue address'}
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
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
              <input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Capacity</label>
              <input
                type="number"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Paid Event</label>
                <input
                  type="checkbox"
                  checked={formData.isPaid}
                  onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                  className="h-4 w-4 rounded text-amber-600"
                />
              </div>
              {formData.isPaid ? (
                <div className="relative mt-3">
                  <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              ) : null}
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Tags</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
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

