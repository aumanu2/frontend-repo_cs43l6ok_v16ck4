export function StatCard({ label, value, hint, icon: Icon, tone='indigo' }) {
  const tones = {
    indigo: 'from-indigo-500 to-blue-500',
    emerald: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-500 to-orange-500',
    fuchsia: 'from-fuchsia-500 to-pink-500'
  }
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-neutral-500">{label}</div>
          <div className="text-2xl font-semibold mt-1">{value}</div>
          {hint && <div className="text-xs text-neutral-400 mt-1">{hint}</div>}
        </div>
        {Icon && (
          <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${tones[tone]} text-white grid place-items-center`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  )
}

export function Card({ children, className='' }) {
  return (
    <div className={`rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm ${className}`}>
      {children}
    </div>
  )
}
