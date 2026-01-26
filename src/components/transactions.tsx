"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Search, Eye } from "lucide-react"
import { useSales, useSalesByDateRange } from "@/hooks/useApi"
import type { Sale } from "@/lib/api"

function formatInvoiceId(sale: Sale): string {
  const d = new Date(sale.sale_date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `INV-${y}${m}${day}-${sale.sale_id}`
}

export function Transactions() {
  const [page] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [query, setQuery] = useState<string>("")

  const salesQuery = useSales(page, limit)
  const rangeQuery = useSalesByDateRange(startDate || "1970-01-01", endDate || new Date().toISOString())

  const loading = salesQuery.isLoading || (startDate && endDate ? rangeQuery.isLoading : false)
  const error = salesQuery.error || (startDate && endDate ? rangeQuery.error : null)

  const list = useMemo(() => {
    const base = startDate && endDate ? (rangeQuery.data || []) : (salesQuery.data?.sales || [])
    if (!query) return base
    const q = query.toLowerCase()
    return base.filter((s: Sale) => {
      const invoiceId = formatInvoiceId(s).toLowerCase()
      const name = `${s.first_name || ""} ${s.last_name || ""}`.trim().toLowerCase()
      return (
        invoiceId.includes(q) ||
        name.includes(q) ||
        String(s.sale_id).includes(q)
      )
    })
  }, [startDate, endDate, rangeQuery.data, salesQuery.data, query])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading transactions...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load transactions.</p>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Transactions</h1>
        <p className="text-sm sm:text-base text-slate-600">View all sales transactions</p>
      </div>

      <Card className="border-slate-200 mb-4">
        <CardHeader>
          <CardTitle className="text-slate-800">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="text-sm text-slate-600">Start Date</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-slate-600">End Date</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-600">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input className="pl-10" placeholder="Search by invoice ID, sale ID, or name" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800">All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? (
            <p className="text-slate-500">No transactions found.</p>
          ) : (
            <div className="space-y-3">
              {list.map((s: Sale) => (
                <div key={s.sale_id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-800">{formatInvoiceId(s)}</p>
                      <Badge variant="outline" className="text-xs">
                        {s.method_name || (s.payment_method_id === 1 ? "Cash" : s.payment_method_id === 2 ? "Card" : "Mobile Money")}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 truncate">
                      {new Date(s.sale_date).toLocaleString()} • GH₵{parseFloat(s.total_amount).toFixed(2)} • {s.first_name || "Salesperson"} {s.last_name || ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => {
                      const event = new CustomEvent('navigateToTab', { detail: 'invoices' })
                      window.dispatchEvent(event)
                    }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator className="my-4" />
      <p className="text-xs text-slate-500">Showing {list.length} transactions</p>
    </div>
  )
}
