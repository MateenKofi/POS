import { Button, TextInput } from "@/components/custom-components"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type { CreateSupplierRequest, Supplier } from "@/lib/api"

interface SupplierFormProps {
  isEdit?: boolean
  data: CreateSupplierRequest | Supplier
  isPending: boolean
  onChange: (data: CreateSupplierRequest | Supplier) => void
  onSubmit: () => void
  onCancel: () => void
}

export function SupplierForm({ isEdit = false, data, isPending, onChange, onSubmit, onCancel }: SupplierFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Supplier Name *</Label>
        <TextInput
          id="name"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="Enter supplier name"
          className="text-sm sm:text-base"
        />
      </div>
      <div>
        <Label htmlFor="contact_info">Contact Information *</Label>
        <TextInput
          id="contact_info"
          value={data.contact_info}
          onChange={(e) => onChange({ ...data, contact_info: e.target.value })}
          placeholder="Enter contact information"
          className="text-sm sm:text-base"
        />
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
            isEdit ? "Update Supplier" : "Add Supplier"
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
