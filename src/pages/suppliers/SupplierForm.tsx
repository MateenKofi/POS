import { Button, TextInput } from "@/components/custom-components"
import { Loader2 } from "lucide-react"
import type { CreateSupplierRequest, Supplier } from "@/lib/api"
import type { UseFormReturn } from "react-hook-form"

interface SupplierFormProps {
  form: UseFormReturn<CreateSupplierRequest | Supplier>
  isEdit?: boolean
  isPending: boolean
  onSubmit: () => void
  onCancel: () => void
}

export function SupplierForm({ form, isEdit = false, isPending, onSubmit, onCancel }: SupplierFormProps) {
  const { register, formState: { errors } } = form

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <TextInput
        id="name"
        label="Supplier Name *"
        placeholder="Enter supplier name"
        className="text-sm sm:text-base"
        error={errors.name?.message}
        {...register('name')}
      />
      <TextInput
        id="contact_info"
        label="Contact Information *"
        placeholder="Enter contact information"
        className="text-sm sm:text-base"
        error={errors.contact_info?.message}
        {...register('contact_info')}
      />
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
            isEdit ? "Update Supplier" : "Add Supplier"
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
