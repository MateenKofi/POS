"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, ArrowUp, ArrowDown, Package, ShoppingCart, RefreshCw, Undo, AlertTriangle } from "lucide-react"
import { useStockMovements, useProducts } from "@/hooks/useApi"
import { type StockMovement as StockMovementType } from "@/lib/api"
import { Loader2 } from "lucide-react"

// Movement type icons and colors
const MOVEMENT_TYPES = {
  sale: { icon: ShoppingCart, color: "text-red-600", bgColor: "bg-red-100", label: "Sale" },
  purchase: { icon: Package, color: "text-green-600", bgColor: "bg-green-100", label: "Purchase" },
  adjustment: { icon: RefreshCw, color: "text-blue-600", bgColor: "bg-blue-100", label: "Adjustment" },
  return: { icon: Undo, color: "text-orange-600", bgColor: "bg-orange-100", label: "Return" },
  expiry: { icon: AlertTriangle, color: "text-purple-600", bgColor: "bg-purple-100", label: "Expired" },
} as const

export function StockMovements() {
  const [searchTerm, setSearchTerm] = useState("")
  const [movementTypeFilter, setMovementTypeFilter] = useState<string>("all")
  const [productFilter, setProductFilter] = useState<string>("all")

  const { data: movementsData, isLoading } = useStockMovements()
  const { data: productsData } = useProducts(1, 1000)

  const movements = Array.isArray(movementsData) ? movementsData : []
  const products = Array.isArray(productsData) ? productsData : []

  // Filter movements
  const filteredMovements = movements.filter((movement: StockMovementType) => {
    const product = products.find(p => p.product_id === movement.product_id)
    const productName = product?.name.toLowerCase() || ""

    const matchesSearch =
      productName.includes(searchTerm.toLowerCase()) ||
      movement.movement_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.batch_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.notes?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = movementTypeFilter === "all" || movement.movement_type === movementTypeFilter
    const matchesProduct = productFilter === "all" || movement.product_id.toString() === productFilter

    return matchesSearch && matchesType && matchesProduct
  })

  const getMovementTypeConfig = (type: keyof typeof MOVEMENT_TYPES) => {
    return MOVEMENT_TYPES[type] || MOVEMENT_TYPES.adjustment
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Stock Movements</h1>
        <p className="text-sm sm:text-base text-slate-600">Track all stock changes and history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search movements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={movementTypeFilter} onValueChange={setMovementTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(MOVEMENT_TYPES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={productFilter} onValueChange={setProductFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            {products.map((product) => (
              <SelectItem key={product.product_id} value={product.product_id.toString()}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Movement History
            {isLoading ? (
              <span className="text-sm font-normal text-gray-500 ml-2">Loading...</span>
            ) : (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredMovements.length} records)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading stock movements...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Date/Time</TableHead>
                    <TableHead className="text-xs sm:text-sm">Product</TableHead>
                    <TableHead className="text-xs sm:text-sm">Type</TableHead>
                    <TableHead className="text-xs sm:text-sm text-right">Quantity</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Batch</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">Reference</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements.map((movement: StockMovementType) => {
                    const product = products.find(p => p.product_id === movement.product_id)
                    const config = getMovementTypeConfig(movement.movement_type as keyof typeof MOVEMENT_TYPES)
                    const Icon = config.icon
                    const isNegative = movement.quantity < 0

                    return (
                      <TableRow key={movement.movement_id}>
                        <TableCell className="text-xs sm:text-sm">
                          {formatDate(movement.created_at)}
                        </TableCell>
                        <TableCell className="font-medium text-xs sm:text-sm">
                          {product?.name || `Product #${movement.product_id}`}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${config.bgColor} ${config.color} border-0`}>
                            <Icon className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right font-medium text-xs sm:text-sm ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
                          <div className="flex items-center justify-end gap-1">
                            {isNegative ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
                            <span>{Math.abs(movement.quantity).toFixed(2)} {movement.unit}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          {movement.batch_number || '-'}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                          {movement.reference_type ? (
                            <span className="text-slate-600">
                              {movement.reference_type} #{movement.reference_id}
                            </span>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell max-w-xs truncate">
                          {movement.notes || '-'}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {filteredMovements.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500 text-sm sm:text-base">
                        {searchTerm || movementTypeFilter !== "all" || productFilter !== "all"
                          ? "No stock movements found matching your filters."
                          : "No stock movements recorded yet."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
