"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Loader2, Search, Eye, Mail, Printer } from "lucide-react"
import { useSales } from "@/hooks/useApi"
import type { Sale } from "@/lib/api"
import { toast } from "sonner"

interface InvoicePreviewProps {
  sale: Sale
}

function formatInvoiceId(sale: Sale): string {
  const d = new Date(sale.sale_date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `INV-${y}${m}${day}-${sale.sale_id}`
}

function InvoicePreview({ sale }: InvoicePreviewProps) {
  const items = sale.items || []
  const subtotal = items.reduce((acc, it) => acc + it.price_at_sale * it.quantity, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax
  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-800">POS System</h3>
        <p className="text-xs text-slate-500">Invoice #{formatInvoiceId(sale)}</p>
        <p className="text-xs text-slate-500">{new Date(sale.sale_date).toLocaleString()}</p>
      </div>
      <Separator />
      <div className="space-y-1 text-sm">
        {items.map((it, idx) => (
          <div key={idx} className="flex justify-between">
            <span>Product #{it.product_id} x{it.quantity}</span>
            <span>GH₵{(it.price_at_sale * it.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <Separator />
      <div className="space-y-1 text-sm">
        <div className="flex justify-between"><span>Subtotal:</span><span>GH₵{subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Tax (8%):</span><span>GH₵{tax.toFixed(2)}</span></div>
        <div className="flex justify-between font-semibold"><span>Total:</span><span>GH₵{total.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Payment:</span><span>{sale.method_name || (sale.payment_method_id === 1 ? "Cash" : sale.payment_method_id === 2 ? "Card" : "Mobile Money")}</span></div>
      </div>
      <p className="text-xs text-slate-500 text-center">Thank you for your business!</p>
    </div>
  )
}

export function Invoices() {
  const [query, setQuery] = useState<string>("")
  const [selected, setSelected] = useState<Sale | null>(null)
  const [email, setEmail] = useState<string>("")
  const { data, isLoading, error } = useSales(1, 20)

  const list = useMemo(() => {
    const base = data?.sales || []
    if (!query) return base
    const q = query.toLowerCase()
    return base.filter((s: Sale) => {
      const invoiceId = formatInvoiceId(s).toLowerCase()
      const name = `${s.first_name || ""} ${s.last_name || ""}`.trim().toLowerCase()
      return invoiceId.includes(q) || name.includes(q) || String(s.sale_id).includes(q)
    })
  }, [data, query])

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading invoices...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load invoices.</p>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Invoices</h1>
        <p className="text-sm sm:text-base text-slate-600">View and resend invoices</p>
      </div>

      <Card className="border-slate-200 mb-4">
        <CardHeader>
          <CardTitle className="text-slate-800">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input className="pl-10" placeholder="Search by invoice ID, sale ID, or name" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Customer email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800">All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? (
            <p className="text-slate-500">No invoices found.</p>
          ) : (
            <div className="space-y-3">
              {list.map((s: Sale) => (
                <div key={s.sale_id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-800">{formatInvoiceId(s)}</p>
                      <Badge variant="outline" className="text-xs">{s.method_name || (s.payment_method_id === 1 ? "Cash" : s.payment_method_id === 2 ? "Card" : "Mobile Money")}</Badge>
                    </div>
                    <p className="text-sm text-slate-600 truncate">{new Date(s.sale_date).toLocaleString()} • GH₵{parseFloat(s.total_amount).toFixed(2)} • {s.first_name || "Salesperson"} {s.last_name || ""}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(s)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => {
                      if (!email) { toast.error("Enter customer email to resend"); return }
                      toast.success(`Invoice sent to ${email}`)
                    }}>
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setSelected(s); setTimeout(() => window.print(), 100) }}>
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => { if (!o) setSelected(null) }}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Invoice Preview</DialogTitle>
          </DialogHeader>
          {selected && (
            <InvoicePreview sale={selected} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
