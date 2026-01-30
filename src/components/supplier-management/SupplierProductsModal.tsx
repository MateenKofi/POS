import { useState } from "react"
import { Modal } from "@/components/modal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/custom-components"
import { Package, Building2, Loader2, BadgeCent } from "lucide-react"
import { useSupplierProductsBySupplier } from "@/hooks/useApi"
import type { Supplier } from "@/lib/api"

interface SupplierProductsModalProps {
  isOpen: boolean
  onClose: () => void
  supplier: Supplier
}

export function SupplierProductsModal({ isOpen, onClose, supplier }: SupplierProductsModalProps) {
  const { data: supplierProducts, isLoading: productsLoading } = useSupplierProductsBySupplier(supplier.supplier_id.toString())

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-green-600" />
          Products Supplied by {supplier.name}
        </div>
      }
      size="full"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Contact: {supplier.contact_info}
          </div>
          <div className="text-sm font-medium text-gray-700">
            Total Products: {supplierProducts?.length || 0}
          </div>
        </div>

        {productsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Loading products...</span>
          </div>
        ) : supplierProducts && supplierProducts.length > 0 ? (
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Supply Price</TableHead>
                  <TableHead>Retail Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Profit Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplierProducts.map((sp) => {
                  const supplyPrice = parseFloat(sp.supply_price)
                  const retailPrice = parseFloat(sp.retail_price)
                  const profitMargin = retailPrice - supplyPrice
                  const profitMarginPercent = ((profitMargin / retailPrice) * 100).toFixed(1)

                  return (
                    <TableRow key={`${sp.supplier_id}-${sp.product_id}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{sp.product_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 max-w-xs truncate">
                        {sp.product_description}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <BadgeCent className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold">GHS {supplyPrice.toFixed(2)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">GHS {retailPrice.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${sp.stock_quantity < 20 ? "text-red-600" : "text-green-600"}`}>
                          {sp.stock_quantity} units
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          GHS {profitMargin.toFixed(2)} ({profitMarginPercent}%)
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No Products Found</h3>
            <p>This supplier doesn't have any products assigned yet.</p>
          </div>
        )}
      </div>
    </Modal>
  )
}
