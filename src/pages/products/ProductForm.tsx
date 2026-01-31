import { Button, TextInput, Label } from "@/components/custom-components"
import { Loader2 } from "lucide-react"
import type { Product, CreateProductRequest } from "@/lib/api"
import type { UseFormReturn } from "react-hook-form"

interface ProductFormProps {
  form: UseFormReturn<CreateProductRequest | Product>
  isEdit?: boolean
  isPending: boolean
  onSubmit: () => void
  onCancel: () => void
}

export const ProductForm = ({ form, isEdit = false, isPending, onSubmit, onCancel }: ProductFormProps) => {
  const { register, watch, formState: { errors } } = form
  const unitType = watch('unit_type')

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <TextInput
          id={isEdit ? "edit-name" : "name"}
          label="Product Name *"
          placeholder="Enter product name"
          className="text-sm sm:text-base"
          error={errors.name?.message}
          {...register('name')}
        />
      </div>
      <div>
        <TextInput
          id={isEdit ? "edit-description" : "description"}
          label="Description *"
          placeholder="Enter product description"
          className="text-sm sm:text-base"
          error={errors.description?.message}
          {...register('description')}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TextInput
          id={isEdit ? "edit-price" : "price"}
          type="number"
          step="0.01"
          label="Retail Price (GH₵) *"
          placeholder="0.00"
          className="text-sm sm:text-base"
          error={errors.price?.message}
          {...register('price')}
        />
        <TextInput
          id={isEdit ? "edit-cost-price" : "cost-price"}
          type="number"
          step="0.01"
          label="Cost Price (GH₵) *"
          placeholder="0.00"
          className="text-sm sm:text-base"
          error={errors.cost_price?.message}
          {...register('cost_price')}
        />
        <TextInput
          id={isEdit ? "edit-stock" : "stock"}
          type="number"
          label="Stock Quantity (kg) *"
          placeholder="0"
          className="text-sm sm:text-base"
          error={errors.stock_quantity?.message}
          {...register('stock_quantity', { valueAsNumber: true })}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={isEdit ? "edit-unit-type" : "unit-type"}>Unit Type *</Label>
          <select
            id={isEdit ? "edit-unit-type" : "unit-type"}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...register('unit_type')}
          >
            <option value="loose">Per kg (Loose)</option>
            <option value="bag">Per Bag</option>
          </select>
          {errors.unit_type && (
            <p className="text-sm font-medium text-destructive mt-1">{errors.unit_type.message}</p>
          )}
        </div>
        <TextInput
          id={isEdit ? "edit-weight-per-bag" : "weight-per-bag"}
          type="number"
          step="0.1"
          label="Weight per Bag (kg)"
          placeholder="50"
          disabled={unitType !== 'bag'}
          className="text-sm sm:text-base"
          error={errors.weight_per_bag?.message}
          {...register('weight_per_bag', { valueAsNumber: true, disabled: unitType !== 'bag' })}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          id={isEdit ? "edit-category" : "category"}
          label="Category"
          placeholder="e.g., Poultry Feed"
          className="text-sm sm:text-base"
          {...register('category')}
        />
        <TextInput
          id={isEdit ? "edit-manufacturer" : "manufacturer"}
          label="Manufacturer"
          placeholder="e.g., AgriFeeds Ghana"
          className="text-sm sm:text-base"
          {...register('manufacturer')}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TextInput
          id={isEdit ? "edit-barcode" : "barcode"}
          label="Barcode"
          placeholder="e.g., LM-050"
          className="text-sm sm:text-base"
          {...register('barcode')}
        />
        <TextInput
          id={isEdit ? "edit-batch-number" : "batch-number"}
          label="Batch Number"
          placeholder="e.g., BATCH-2025-001"
          className="text-sm sm:text-base"
          {...register('batch_number')}
        />
        <TextInput
          id={isEdit ? "edit-expiry-date" : "expiry-date"}
          type="date"
          label="Expiry Date"
          className="text-sm sm:text-base"
          {...register('expiry_date')}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          id={isEdit ? "edit-reorder-level" : "reorder-level"}
          type="number"
          label="Reorder Level"
          placeholder="10"
          className="text-sm sm:text-base"
          {...register('reorder_level', { valueAsNumber: true })}
        />
        <TextInput
          id={isEdit ? "edit-supplier" : "supplier"}
          label="Default Supplier"
          placeholder="Supplier name"
          className="text-sm sm:text-base"
          {...register('supplier')}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          type="submit"
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
          type="button"
          variant="outline"
          onClick={onCancel}
          className="text-sm sm:text-base py-2 sm:py-3"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
