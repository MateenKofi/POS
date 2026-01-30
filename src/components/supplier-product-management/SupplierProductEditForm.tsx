import { Button, TextInput } from "@/components/custom-components"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Modal } from "@/components/modal"
import type { SupplierProductWithDetails } from "@/lib/api"

interface SupplierProductEditFormProps {
  isOpen: boolean
  onClose: () => void
  data: SupplierProductWithDetails | null
  isPending: boolean
  onChange: (data: SupplierProductWithDetails) => void
  onSubmit: () => void
}

export function SupplierProductEditForm({
  isOpen,
  onClose,
  data,
  isPending,
  onChange,
  onSubmit
}: SupplierProductEditFormProps) {
  if (!data) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Supply Price"
      size="md"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="edit-supplier">Supplier</Label>
          <TextInput
            id="edit-supplier"
            value={data.supplier_name}
            disabled
            className="bg-gray-50"
          />
        </div>
        <div>
          <Label htmlFor="edit-product">Product</Label>
          <TextInput
            id="edit-product"
            value={data.product_name}
            disabled
            className="bg-gray-50"
          />
        </div>
        <div>
          <Label htmlFor="edit-supply-price">Supply Price ($) *</Label>
          <TextInput
            id="edit-supply-price"
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
                Updating...
              </>
            ) : (
              "Update Price"
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
