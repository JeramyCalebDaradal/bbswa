import { useMemo, useState } from 'react'
import { Calendar, Clock, Mail, MapPin, Save, User, X } from 'lucide-react'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function CreateEditAppointment({ onClose, onSave, appointment, mode, isSaving = false }) {
  const services = useMemo(
    () => [
      'Security Assessment',
      'Penetration Testing',
      'Compliance Consultation',
      'Annual Security Review',
      'Risk Assessment',
    ],
    []
  )

  const durations = useMemo(() => [15, 30, 45, 60, 90, 120], [])

  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    date: mode === 'create' ? todayISO() : '',
    time: '',
    status: 'pending',
    service: '',
    notes: '',
    location: 'Office - Black Bear Securities',
    duration: 60,
    ...(appointment || {}),
  })

  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  const validate = () => {
    const next = {}
    if (!formData.clientName.trim()) next.clientName = 'Client name is required'
    if (!formData.email.trim()) next.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) next.email = 'Invalid email address'
    if (!formData.phone.trim()) next.phone = 'Phone number is required'
    if (!formData.date) next.date = 'Appointment date is required'
    if (!formData.time) next.time = 'Appointment time is required'
    if (!formData.service) next.service = 'Service type is required'
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
      setSubmitError(err?.message || 'Failed to save appointment')
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
              <h2 className="text-xl font-semibold text-gray-900">{mode === 'create' ? 'New Appointment' : 'Edit Appointment'}</h2>
              <p className="mt-1 text-sm text-gray-500">{mode === 'create' ? 'Schedule a new appointment with a client' : 'Update appointment details'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={isSaving}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-white transition-all hover:from-amber-600 hover:to-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : mode === 'create' ? 'Create Appointment' : 'Update Appointment'}
          </button>
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
                Client Information
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Client Name *</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    disabled={isSaving}
                    className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.clientName ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.clientName ? <p className="mt-1 text-xs text-red-500">{errors.clientName}</p> : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Email Address *</label>
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
                  <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={isSaving}
                    className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.phone ? <p className="mt-1 text-xs text-red-500">{errors.phone}</p> : null}
                </div>
              </div>
            </section>

            <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                <Calendar className="h-5 w-5 text-amber-500" />
                Appointment Details
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Service Type *</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    disabled={isSaving}
                    className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.service ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select a service...</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                  {errors.service ? <p className="mt-1 text-xs text-red-500">{errors.service}</p> : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    disabled={isSaving}
                    className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.date ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.date ? <p className="mt-1 text-xs text-red-500">{errors.date}</p> : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Time *</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      disabled={isSaving}
                      className={`w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.time ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.time ? <p className="mt-1 text-xs text-red-500">{errors.time}</p> : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Duration</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value, 10) })}
                    disabled={isSaving}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {durations.map((duration) => (
                      <option key={duration} value={duration}>
                        {duration} minutes
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={isSaving}
                      className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
                  <div className="flex flex-wrap gap-4">
                    {['pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
                      <label key={s} className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="status"
                          value={s}
                          checked={formData.status === s}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          disabled={isSaving}
                          className="h-4 w-4 text-amber-600"
                        />
                        <span className="capitalize text-gray-700">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                disabled={isSaving}
                rows={4}
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </section>
          </div>
        </form>
      </div>
    </div>
  )
}
