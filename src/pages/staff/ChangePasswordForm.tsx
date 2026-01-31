import { Button } from "@/components/custom-components"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import type { PasswordData } from "./types"
import type { UseFormReturn } from "react-hook-form"

interface ChangePasswordFormProps {
  form: UseFormReturn<PasswordData>
  showPassword: boolean
  isPending: boolean
  onTogglePassword: () => void
  onSubmit: () => void
  onCancel: () => void
}

export const ChangePasswordForm = ({
  form,
  showPassword,
  isPending,
  onTogglePassword,
  onSubmit,
  onCancel
}: ChangePasswordFormProps) => {
  const { register, formState: { errors }, handleSubmit } = form

  const onFormSubmit = () => {
    handleSubmit(() => {
      onSubmit()
    })()
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onFormSubmit(); }} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Current Password
        </label>
        <div className="relative">
          <input
            id="current-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter current password"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register('current_password')}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={onTogglePassword}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {errors.current_password && (
          <p className="text-sm font-medium text-destructive">{errors.current_password.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          New Password
        </label>
        <input
          id="new-password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter new password"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          {...register('new_password')}
        />
        {errors.new_password && (
          <p className="text-sm font-medium text-destructive">{errors.new_password.message}</p>
        )}
      </div>
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
            "Update Password"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
