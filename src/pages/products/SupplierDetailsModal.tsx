import { Modal } from "@/components/modal"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Truck, Copy } from "lucide-react"
import { toast } from "sonner"
import type { Product } from "@/lib/api"

interface SupplierDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export const SupplierDetailsModal = ({ isOpen, onClose, product }: SupplierDetailsModalProps) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Contact information copied to clipboard!")
    } catch {
      toast.error("Failed to copy to clipboard")
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Supplier Details - ${product?.name || ''}`}
      size="xl"
    >
      {product && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Product Name</Label>
              <p className="text-sm text-gray-900">{product.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Current Stock</Label>
              <p className="text-sm text-gray-900">{product.stock_quantity} units</p>
            </div>
          </div>

          {product.suppliers && product.suppliers.length > 0 ? (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Suppliers</Label>
              <div className="space-y-3">
                {product.suppliers.map((supplier) => (
                  <div key={supplier.supplier_id} className="p-3 border rounded-lg bg-gray-50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Supplier Name:</span>
                        <p className="text-sm text-gray-900">{supplier.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Supply Price:</span>
                        <p className="text-sm text-gray-900">GH₵{supplier.supply_price}</p>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Contact Info:</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(supplier.contact_info)}
                            title="Copy contact information"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-900 break-all">{supplier.contact_info}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm font-medium text-gray-700">Profit Margin:</span>
                        <p className="text-sm text-green-600 font-medium">
                          {(() => {
                            const retailPrice = parseFloat(product.price)
                            const supplyPrice = parseFloat(supplier.supply_price)
                            return `${((retailPrice - supplyPrice) / retailPrice * 100).toFixed(1)}%`
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <Truck className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No suppliers assigned to this product</p>
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
