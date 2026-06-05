export default function StatCard({ title, value, icon: Icon, trend, trendUp, color = 'amber' }) {
  const colorClasses = {
    amber: 'from-amber-400 to-amber-600',
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600',
    red: 'from-red-400 to-red-600',
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-sm text-gray-600">{title}</p>
          <h3 className="text-3xl font-semibold text-gray-900">{value}</h3>
          {trend ? (
            <p className={`mt-2 text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          ) : null}
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${
            colorClasses[color] || colorClasses.amber
          }`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}

