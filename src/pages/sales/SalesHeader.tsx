import { CreditCard, Clock } from "lucide-react"

export function SalesHeader() {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/25">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Sales Terminal
            </h1>
            <p className="text-sm sm:text-base text-slate-500">Streamline your checkout process</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200">
          <Clock className="h-4 w-4" />
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>
    </div>
  )
}
