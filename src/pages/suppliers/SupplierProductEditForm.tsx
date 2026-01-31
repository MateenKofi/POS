import { Button, TextInput } from "@/components/custom-components"
import { Loader2 } from "lucide-react"
import { Modal } from "@/components/modal"
import type { SupplierProductWithDetails } from "@/lib/api"
import type { UseFormReturn } from "react-hook-form"

interface SupplierProductEditFormProps {
  isOpen: boolean
  onClose: () => void
  data: SupplierProductWithDetails | null
  form: UseFormReturn<SupplierProductWithDetails>
  isPending: boolean
  onSubmit: () => void
}

export function SupplierProductEditForm({
  isOpen,
  onClose,
  data,
  form,
  isPending,
  onSubmit
}: SupplierProductEditFormProps) {
  const { register, formState: { errors }, handleSubmit } = form

  if (!data) return null

  const onFormSubmit = () => {
    handleSubmit(() => {
      onSubmit()
    })()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Supply Price"
      size="md"
    >
      <form onSubmit={(e) => { e.preventDefault(); onFormSubmit(); }} className="space-y-4">
        <TextInput
          id="edit-supplier"
          label="Supplier"
          value={data.supplier_name}
          disabled
          className="bg-gray-50"
        />
        <TextInput
          id="edit-product"
          label="Product"
          value={data.product_name}
          disabled
          className="bg-gray-50"
        />
        <TextInput
          id="edit-supply-price"
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
                Updating...
              </>
            ) : (
              "Update Price"
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
