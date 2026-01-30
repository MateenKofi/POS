import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button, TextInput } from "@/components/custom-components"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Modal } from "@/components/modal"
import type { Supplier, Product, CreateSupplierProductRequest } from "@/lib/api"

interface SupplierProductFormProps {
  isOpen: boolean
  onClose: () => void
  data: CreateSupplierProductRequest
  suppliers?: Supplier[]
  products?: Product[]
  isPending: boolean
  onChange: (data: CreateSupplierProductRequest) => void
  onSubmit: () => void
}

export function SupplierProductForm({
  isOpen,
  onClose,
  data,
  suppliers = [],
  products = [],
  isPending,
  onChange,
  onSubmit
}: SupplierProductFormProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Supplier Product Relationship"
      size="md"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="supplier">Supplier *</Label>
          <Select
            value={data.supplier_id.toString()}
            onValueChange={(value) => onChange({ ...data, supplier_id: parseInt(value) })}
          >
            <SelectTrigger className="w-full text-gray-900">
              <SelectValue placeholder="Select a supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.supplier_id} value={supplier.supplier_id.toString()}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="product">Product *</Label>
          <Select
            value={data.product_id.toString()}
            onValueChange={(value) => onChange({ ...data, product_id: parseInt(value) })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.product_id} value={product.product_id.toString()}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="supply-price">Supply Price ($) *</Label>
          <TextInput
            id="supply-price"
            type="number"
            step="0.01"
            value={data.supply_price}
            onChange={(e) => onChange({ ...data, supply_price: e.target.value })}
            placeholder="0.00"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onSubmit}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              "Add Relationship"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}
