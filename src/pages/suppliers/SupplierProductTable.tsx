import { Card, CardContent, CardHeader, CardTitle, Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TextInput } from "@/components/custom-components"
import { Search, Edit, Trash2, Loader2, Building2, Package, BadgeCent } from "lucide-react"
import type { SupplierProductWithDetails } from "@/lib/api"

interface SupplierProductTableProps {
  filteredSupplierProducts: SupplierProductWithDetails[]
  isLoading: boolean
  searchTerm: string
  onSearchChange: (value: string) => void
  onEdit: (item: SupplierProductWithDetails) => void
  onDelete: (supplierId: number, productId: number) => void
  isDeletePending: boolean
}

export const SupplierProductTable = ({
  filteredSupplierProducts,
  isLoading,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  isDeletePending
}: SupplierProductTableProps) => {
  return (
    <>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <TextInput
            placeholder="Search by supplier name or product name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Supplier Product Relationships
            {isLoading ? (
              <span className="text-sm font-normal text-gray-500 ml-2">Loading...</span>
            ) : (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredSupplierProducts?.length} relationships)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">Loading supplier product relationships...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Supply Price</TableHead>
                  <TableHead>Retail Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Profit Margin</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSupplierProducts?.map((sp) => {
                  const supplyPrice = parseFloat(sp.supply_price)
                  const retailPrice = parseFloat(sp.retail_price)
                  const profitMargin = retailPrice - supplyPrice
                  const profitMarginPercent = ((profitMargin / retailPrice) * 100).toFixed(1)

                  return (
                    <TableRow key={`${sp.supplier_id}-${sp.product_id}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{sp.supplier_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-green-600" />
                          <div>
                            <div className="font-medium">{sp.product_name}</div>
                            <div className="text-sm text-gray-500">{sp.product_description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <BadgeCent className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold">GH {supplyPrice.toFixed(2)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">GH {retailPrice.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-gray-600">
                          {sp.stock_quantity || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          GH {profitMargin.toFixed(2)} ({profitMarginPercent}%)
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => onEdit(sp)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => onDelete(sp.supplier_id, sp.product_id)}
                            disabled={isDeletePending}
                          >
                            {isDeletePending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredSupplierProducts?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {searchTerm ? "No supplier product relationships found matching your search." : "No supplier product relationships available."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  )
}
