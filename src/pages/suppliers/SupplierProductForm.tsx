import { Button, TextInput, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label } from "@/components/custom-components"
import { Controller } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { Modal } from "@/components/modal"
import type { Supplier, Product, CreateSupplierProductRequest } from "@/lib/api"
import type { UseFormReturn } from "react-hook-form"

interface SupplierProductFormProps {
  isOpen: boolean
  onClose: () => void
  form: UseFormReturn<CreateSupplierProductRequest>
  suppliers?: Supplier[]
  products?: Product[]
  isPending: boolean
  onSubmit: () => void
}

export function SupplierProductForm({
  isOpen,
  onClose,
  form,
  suppliers = [],
  products = [],
  isPending,
  onSubmit
}: SupplierProductFormProps) {
  const { register, control, formState: { errors }, handleSubmit } = form

  const onFormSubmit = () => {
    handleSubmit(() => {
      onSubmit()
    })()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Supplier Product Relationship"
      size="md"
    >
      <form onSubmit={(e) => { e.preventDefault(); onFormSubmit(); }} className="space-y-4">
        <div>
          <Label htmlFor="supplier">Supplier *</Label>
          <Controller
            control={control}
            name="supplier_id"
            render={({ field }) => (
              <Select
                value={field.value?.toString()}
                onValueChange={(value) => field.onChange(parseInt(value))}
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
            )}
          />
          {errors.supplier_id && (
            <p className="text-sm font-medium text-destructive mt-1">{errors.supplier_id.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="product">Product *</Label>
          <Controller
            control={control}
            name="product_id"
            render={({ field }) => (
              <Select
                value={field.value?.toString()}
                onValueChange={(value) => field.onChange(parseInt(value))}
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
            )}
          />
          {errors.product_id && (
            <p className="text-sm font-medium text-destructive mt-1">{errors.product_id.message}</p>
          )}
        </div>
        <TextInput
          id="supply-price"
          type="number"
          step="0.01"
          label="Supply Price ($) *"
          placeholder="0.00"
          error={errors.supply_price?.message}
          {...register('supply_price')}
        />
        <div className="flex gap-2">
          <Button
            type="submit"
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
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
