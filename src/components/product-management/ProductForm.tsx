import { Button, TextInput } from "@/components/custom-components"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type { Product, CreateProductRequest } from "@/lib/api"


interface ProductFormProps {
  product: CreateProductRequest | Product
  isEdit?: boolean
  isPending: boolean
  onChange: (product: CreateProductRequest | Product) => void
  onSubmit: () => void
  onCancel: () => void
}

export function ProductForm({ product, isEdit = false, isPending, onChange, onSubmit, onCancel }: ProductFormProps) {


  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={isEdit ? "edit-name" : "name"}>Product Name *</Label>
        <TextInput
          id={isEdit ? "edit-name" : "name"}
          value={product.name}
          onChange={(e) => onChange({ ...product, name: e.target.value })}
          placeholder="Enter product name"
          className="text-sm sm:text-base"
        />
      </div>
      <div>
        <Label htmlFor={isEdit ? "edit-description" : "description"}>Description *</Label>
        <TextInput
          id={isEdit ? "edit-description" : "description"}
          value={product.description}
          onChange={(e) => onChange({ ...product, description: e.target.value })}
          placeholder="Enter product description"
          className="text-sm sm:text-base"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor={isEdit ? "edit-price" : "price"}>Retail Price (GH₵) *</Label>
          <TextInput
            id={isEdit ? "edit-price" : "price"}
            type="number"
            step="0.01"
            value={product.price}
            onChange={(e) => onChange({ ...product, price: e.target.value })}
            placeholder="0.00"
            className="text-sm sm:text-base"
          />
        </div>
        <div>
          <Label htmlFor={isEdit ? "edit-cost-price" : "cost-price"}>Cost Price (GH₵) *</Label>
          <TextInput
            id={isEdit ? "edit-cost-price" : "cost-price"}
            type="number"
            step="0.01"
            value={product.cost_price}
            onChange={(e) => onChange({ ...product, cost_price: e.target.value })}
            placeholder="0.00"
            className="text-sm sm:text-base"
          />
        </div>
        <div>
          <Label htmlFor={isEdit ? "edit-stock" : "stock"}>Stock Quantity (kg) *</Label>
          <TextInput
            id={isEdit ? "edit-stock" : "stock"}
            type="number"
            value={product.stock_quantity}
            onChange={(e) => onChange({ ...product, stock_quantity: parseInt(e.target.value) || 0 })}
            placeholder="0"
            className="text-sm sm:text-base"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={isEdit ? "edit-unit-type" : "unit-type"}>Unit Type *</Label>
          <select
            id={isEdit ? "edit-unit-type" : "unit-type"}
            value={product.unit_type}
            onChange={(e) => onChange({ ...product, unit_type: e.target.value as 'bag' | 'loose' })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="loose">Per kg (Loose)</option>
            <option value="bag">Per Bag</option>
          </select>
        </div>
        <div>
          <Label htmlFor={isEdit ? "edit-weight-per-bag" : "weight-per-bag"}>Weight per Bag (kg)</Label>
          <TextInput
            id={isEdit ? "edit-weight-per-bag" : "weight-per-bag"}
            type="number"
            step="0.1"
            value={product.weight_per_bag || ''}
            onChange={(e) => onChange({ ...product, weight_per_bag: e.target.value ? parseFloat(e.target.value) : undefined })}
            placeholder="50"
            disabled={product.unit_type !== 'bag'}
            className="text-sm sm:text-base"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={isEdit ? "edit-category" : "category"}>Category</Label>
          <TextInput
            id={isEdit ? "edit-category" : "category"}
            value={product.category || ''}
            onChange={(e) => onChange({ ...product, category: e.target.value })}
            placeholder="e.g., Poultry Feed"
            className="text-sm sm:text-base"
          />
        </div>
        <div>
          <Label htmlFor={isEdit ? "edit-manufacturer" : "manufacturer"}>Manufacturer</Label>
          <TextInput
            id={isEdit ? "edit-manufacturer" : "manufacturer"}
            value={product.manufacturer || ''}
            onChange={(e) => onChange({ ...product, manufacturer: e.target.value })}
            placeholder="e.g., AgriFeeds Ghana"
            className="text-sm sm:text-base"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor={isEdit ? "edit-barcode" : "barcode"}>Barcode</Label>
          <TextInput
            id={isEdit ? "edit-barcode" : "barcode"}
            value={product.barcode || ''}
            onChange={(e) => onChange({ ...product, barcode: e.target.value })}
            placeholder="e.g., LM-050"
            className="text-sm sm:text-base"
          />
        </div>
        <div>
          <Label htmlFor={isEdit ? "edit-batch-number" : "batch-number"}>Batch Number</Label>
          <TextInput
            id={isEdit ? "edit-batch-number" : "batch-number"}
            value={product.batch_number || ''}
            onChange={(e) => onChange({ ...product, batch_number: e.target.value })}
            placeholder="e.g., BATCH-2025-001"
            className="text-sm sm:text-base"
          />
        </div>
        <div>
          <Label htmlFor={isEdit ? "edit-expiry-date" : "expiry-date"}>Expiry Date</Label>
          <TextInput
            id={isEdit ? "edit-expiry-date" : "expiry-date"}
            type="date"
            value={product.expiry_date || ''}
            onChange={(e) => onChange({ ...product, expiry_date: e.target.value })}
            className="text-sm sm:text-base"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={isEdit ? "edit-reorder-level" : "reorder-level"}>Reorder Level</Label>
          <TextInput
            id={isEdit ? "edit-reorder-level" : "reorder-level"}
            type="number"
            value={product.reorder_level || ''}
            onChange={(e) => onChange({ ...product, reorder_level: parseInt(e.target.value) || 0 })}
            placeholder="10"
            className="text-sm sm:text-base"
          />
        </div>
        <div>
          <Label htmlFor={isEdit ? "edit-supplier" : "supplier"}>Default Supplier</Label>
          <TextInput
            id={isEdit ? "edit-supplier" : "supplier"}
            value={product.supplier || ''}
            onChange={(e) => onChange({ ...product, supplier: e.target.value })}
            placeholder="Supplier name"
            className="text-sm sm:text-base"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={onSubmit}
          className="flex-1 bg-green-600 hover:bg-green-700 text-sm sm:text-base py-2 sm:py-3"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : (
            isEdit ? "Update Product" : "Add Product"
          )}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          className="text-sm sm:text-base py-2 sm:py-3"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
