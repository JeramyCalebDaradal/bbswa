import { Bell, Calendar, Globe, Save, Users as UsersIcon, Zap } from 'lucide-react'

function Toggle({ defaultChecked = false }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" className="peer sr-only" defaultChecked={defaultChecked} />
      <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300" />
    </label>
  )
}

function SettingsCard({ icon: Icon, iconGradient, title, children }) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${iconGradient}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </section>
  )
}

export default function Settings() {
  return (
    <section className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
        <p className="mt-1 text-gray-600">Configure your dashboard and application settings</p>
      </section>

      <section className="space-y-6">
        <SettingsCard icon={Globe} iconGradient="from-amber-400 to-amber-600" title="Website Information">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                defaultValue="Black Bear Securities"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Website URL</label>
              <input
                type="text"
                defaultValue="https://coruscating-marigold-4e5c17.netlify.app/"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Contact Email</label>
              <input
                type="email"
                defaultValue="info@blackbearsecurities.com"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                defaultValue="+1 (555) 000-0000"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard icon={UsersIcon} iconGradient="from-blue-400 to-blue-600" title="Admin Users">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-700">
                  <span className="text-sm font-medium text-white">AD</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Admin User</p>
                  <p className="text-sm text-gray-600">admin@blackbear.com</p>
                </div>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">Owner</span>
            </div>
            <button
              type="button"
              className="w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 px-4 py-2 text-gray-600 transition-colors hover:border-amber-500 hover:text-amber-600"
            >
              + Add Admin User
            </button>
          </div>
        </SettingsCard>

        <SettingsCard icon={Bell} iconGradient="from-green-400 to-green-600" title="Email Notification Settings">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="font-medium text-gray-900">New Appointment Notifications</p>
                <p className="text-sm text-gray-600">Receive emails when new appointments are booked</p>
              </div>
              <Toggle defaultChecked />
            </div>
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="font-medium text-gray-900">New Lead Notifications</p>
                <p className="text-sm text-gray-600">Get notified about new leads</p>
              </div>
              <Toggle defaultChecked />
            </div>
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="font-medium text-gray-900">Newsletter Subscription Notifications</p>
                <p className="text-sm text-gray-600">Alert on new newsletter subscribers</p>
              </div>
              <Toggle />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard icon={Calendar} iconGradient="from-purple-400 to-purple-600" title="Booking Settings">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Default Appointment Duration (minutes)</label>
              <input
                type="number"
                defaultValue="60"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Business Hours</label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  defaultValue="09:00"
                  className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="time"
                  defaultValue="17:00"
                  className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="font-medium text-gray-900">Allow Weekend Bookings</p>
                <p className="text-sm text-gray-600">Enable appointments on Saturdays and Sundays</p>
              </div>
              <Toggle />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard icon={Zap} iconGradient="from-red-400 to-red-600" title="Lead Automation Settings">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="font-medium text-gray-900">Auto-create Lead from Appointment</p>
                <p className="text-sm text-gray-600">Automatically create a lead when a user books an appointment</p>
              </div>
              <Toggle defaultChecked />
            </div>
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="font-medium text-gray-900">Auto Follow-up Reminders</p>
                <p className="text-sm text-gray-600">Send automatic follow-up reminders for leads</p>
              </div>
              <Toggle defaultChecked />
            </div>
          </div>
        </SettingsCard>

        <div className="flex justify-end">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-white shadow-sm transition-all hover:from-amber-600 hover:to-amber-700"
          >
            <Save className="h-5 w-5" />
            Save All Changes
          </button>
        </div>
      </section>
    </section>
  )
}

