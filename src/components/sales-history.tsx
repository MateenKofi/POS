"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Download } from "lucide-react"

interface Sale {
  id: string
  date: string
  time: string
  items: number
  total: number
  paymentMethod: string
  cashier: string
}

const salesData: Sale[] = [
  {
    id: "TXN-001",
    date: "2024-01-15",
    time: "14:30",
    items: 3,
    total: 45.97,
    paymentMethod: "Credit Card",
    cashier: "John Doe",
  },
  {
    id: "TXN-002",
    date: "2024-01-15",
    time: "14:15",
    items: 1,
    total: 24.99,
    paymentMethod: "Cash",
    cashier: "Jane Smith",
  },
  {
    id: "TXN-003",
    date: "2024-01-15",
    time: "13:45",
    items: 5,
    total: 78.45,
    paymentMethod: "Credit Card",
    cashier: "John Doe",
  },
  {
    id: "TXN-004",
    date: "2024-01-15",
    time: "13:20",
    items: 2,
    total: 12.98,
    paymentMethod: "Cash",
    cashier: "Jane Smith",
  },
  {
    id: "TXN-005",
    date: "2024-01-15",
    time: "12:55",
    items: 4,
    total: 56.23,
    paymentMethod: "Debit Card",
    cashier: "John Doe",
  },
]

export function SalesHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("")

  const filteredSales = salesData.filter((sale) => {
    const matchesSearch =
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.cashier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = !selectedDate || sale.date === selectedDate
    return matchesSearch && matchesDate
  })

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0)
  const totalTransactions = filteredSales.length

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Quick Access to Sales Data</h1>
        <p className="text-slate-600">View and analyze your transaction history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">${totalSales.toFixed(2)}</div>
            <p className="text-xs text-green-600">+12.5% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalTransactions}</div>
            <p className="text-xs text-green-600">+8.1% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Average Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              ${totalTransactions > 0 ? (totalSales / totalTransactions).toFixed(2) : "0.00"}
            </div>
            <p className="text-xs text-green-600">+5.4% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search by transaction ID or cashier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full sm:w-auto"
        />
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Sales Table */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Transaction ID</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Date & Time</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Items</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Payment</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Cashier</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-800">{sale.id}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {sale.date} at {sale.time}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{sale.items} items</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">${sale.total.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <Badge variant={sale.paymentMethod === "Cash" ? "default" : "secondary"}>
                        {sale.paymentMethod}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{sale.cashier}</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
