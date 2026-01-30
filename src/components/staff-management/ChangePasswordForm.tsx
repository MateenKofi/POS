import { Button, TextInput } from "@/components/custom-components"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import type { PasswordData } from "./types"

interface ChangePasswordFormProps {
  passwordData: PasswordData
  showPassword: boolean
  isPending: boolean
  onDataChange: (data: PasswordData) => void
  onTogglePassword: () => void
  onSubmit: () => void
  onCancel: () => void
}

export function ChangePasswordForm({
  passwordData,
  showPassword,
  isPending,
  onDataChange,
  onTogglePassword,
  onSubmit,
  onCancel
}: ChangePasswordFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="current-password">Current Password</Label>
        <div className="relative">
          <TextInput
            id="current-password"
            type={showPassword ? "text" : "password"}
            value={passwordData.current_password}
            onChange={(e) => onDataChange({ ...passwordData, current_password: e.target.value })}
            placeholder="Enter current password"
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
      </div>
      <div>
        <Label htmlFor="new-password">New Password</Label>
        <div className="relative">
          <TextInput
            id="new-password"
            type={showPassword ? "text" : "password"}
            value={passwordData.new_password}
            onChange={(e) => onDataChange({ ...passwordData, new_password: e.target.value })}
            placeholder="Enter new password"
          />
        </div>
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
            "Update Password"
          )}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
