import { Button, TextInput, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/custom-components"
import { Controller } from "react-hook-form"
import { Loader2 } from "lucide-react"
import type { CreateStaffRequest, UpdateStaffRequest } from "@/lib/api"
import type { UseFormReturn } from "react-hook-form"

interface StaffFormProps {
  form: UseFormReturn<CreateStaffRequest | UpdateStaffRequest>
  isEdit?: boolean
  isPending: boolean
  onSubmit: () => void
  onCancel: () => void
}

export function StaffForm({ form, isEdit = false, isPending, onSubmit, onCancel }: StaffFormProps) {
  const { register, control, formState: { errors } } = form

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          id={isEdit ? "edit-first-name" : "first_name"}
          label="First Name *"
          placeholder="Enter first name"
          className="text-sm sm:text-base"
          error={errors.first_name?.message}
          {...register('first_name')}
        />
        <TextInput
          id={isEdit ? "edit-last-name" : "last_name"}
          label="Last Name *"
          placeholder="Enter last name"
          className="text-sm sm:text-base"
          error={errors.last_name?.message}
          {...register('last_name')}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          id={isEdit ? "edit-email" : "email"}
          type="email"
          label="Email *"
          placeholder="Enter email"
          className="text-sm sm:text-base"
          error={errors.email?.message}
          {...register('email')}
        />
        {!isEdit && (
          <TextInput
            id="username"
            label="Username *"
            placeholder="Enter username"
            className="text-sm sm:text-base"
            error={errors.username?.message}
            {...register('username')}
          />
        )}
      </div>
      {!isEdit && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            id="password"
            type="password"
            label="Password *"
            placeholder="Enter password"
            className="text-sm sm:text-base"
            error={errors.password?.message}
            {...register('password')}
          />
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
              Role *
            </label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cashier">Salesperson</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className="text-sm font-medium text-destructive mt-1">{errors.role.message}</p>
            )}
          </div>
        </div>
      )}
      <TextInput
        id={isEdit ? "edit-contact" : "contact_info"}
        label="Contact Info"
        placeholder="Enter contact information"
        className="text-sm sm:text-base"
        error={errors.contact_info?.message}
        {...register('contact_info')}
      />
      {isEdit && (
        <>
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
              Role
            </label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cashier">Salesperson</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className="text-sm font-medium text-destructive mt-1">{errors.role.message}</p>
            )}
          </div>
          <TextInput
            id={isEdit ? "edit-hourly-rate" : "hourly_rate"}
            type="number"
            step="0.01"
            label="Hourly Rate (GH₵)"
            placeholder="15.00"
            className="text-sm sm:text-base"
            error={errors.hourly_rate?.message}
            {...register('hourly_rate', { valueAsNumber: true })}
          />
        </>
      )}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          type="submit"
          className="flex-1 bg-green-600 hover:bg-green-700 text-sm sm:text-base py-2 sm:py-3"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {isEdit ? "Saving..." : "Creating..."}
            </>
          ) : (
            isEdit ? "Save Changes" : "Add Staff Member"
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
