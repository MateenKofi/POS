import { TextInput, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/custom-components"
import { Search } from "lucide-react"

interface TransactionFiltersProps {
  startDate: string
  endDate: string
  typeFilter: string
  query: string
  transactionTypeLabels: Record<string, string>
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onTypeFilterChange: (value: string) => void
  onQueryChange: (value: string) => void
}

export const TransactionFilters = ({
  startDate,
  endDate,
  typeFilter,
  query,
  transactionTypeLabels,
  onStartDateChange,
  onEndDateChange,
  onTypeFilterChange,
  onQueryChange,
}: TransactionFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      <div>
        <label className="text-sm text-slate-600">Start Date</label>
        <TextInput type="date" value={startDate} onChange={(e) => onStartDateChange(e.target.value)} />
      </div>
      <div>
        <label className="text-sm text-slate-600">End Date</label>
        <TextInput type="date" value={endDate} onChange={(e) => onEndDateChange(e.target.value)} />
      </div>
      <div>
        <label className="text-sm text-slate-600">Type</label>
        <Select value={typeFilter || 'all'} onValueChange={(v) => onTypeFilterChange(v === 'all' ? '' : v)}>
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {Object.entries(transactionTypeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-2">
        <label className="text-sm text-slate-600">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <TextInput className="pl-10" placeholder="Search by ID, reference, description..." value={query} onChange={(e) => onQueryChange(e.target.value)} />
        </div>
      </div>
    </div>
  )
}
