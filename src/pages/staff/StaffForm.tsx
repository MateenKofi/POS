import { Button, TextInput, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label } from "@/components/custom-components"
import { Loader2 } from "lucide-react"
import type { CreateStaffRequest, UpdateStaffRequest } from "@/lib/api"
import type { StaffRole } from "./types"

interface StaffFormProps {
  isEdit?: boolean
  data: CreateStaffRequest | UpdateStaffRequest
  isPending: boolean
  onChange: (data: CreateStaffRequest | UpdateStaffRequest) => void
  onSubmit: () => void
  onCancel: () => void
}

export function StaffForm({ isEdit = false, data, isPending, onChange, onSubmit, onCancel }: StaffFormProps) {
  const isCreateRequest = (d: CreateStaffRequest | UpdateStaffRequest): d is CreateStaffRequest => {
    return 'username' in d && 'password' in d
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={isEdit ? "edit-first-name" : "first_name"}>
            {isEdit ? "First Name" : "First Name"} *
          </Label>
          <TextInput
            id={isEdit ? "edit-first-name" : "first_name"}
            value={data.first_name}
            onChange={(e) => onChange({ ...data, first_name: e.target.value })}
            placeholder="Enter first name"
            className="text-sm sm:text-base"
          />
        </div>
        <div>
          <Label htmlFor={isEdit ? "edit-last-name" : "last_name"}>
            {isEdit ? "Last Name" : "Last Name"} *
          </Label>
          <TextInput
            id={isEdit ? "edit-last-name" : "last_name"}
            value={data.last_name}
            onChange={(e) => onChange({ ...data, last_name: e.target.value })}
            placeholder="Enter last name"
            className="text-sm sm:text-base"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={isEdit ? "edit-email" : "email"}>Email *</Label>
          <TextInput
            id={isEdit ? "edit-email" : "email"}
            type="email"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            placeholder="Enter email"
            className="text-sm sm:text-base"
          />
        </div>
        {!isEdit && isCreateRequest(data) && (
          <div>
            <Label htmlFor="username">Username *</Label>
            <TextInput
              id="username"
              value={data.username}
              onChange={(e) => onChange({ ...data, username: e.target.value })}
              placeholder="Enter username"
              className="text-sm sm:text-base"
            />
          </div>
        )}
      </div>
      {!isEdit && isCreateRequest(data) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="password">Password *</Label>
            <TextInput
              id="password"
              type="password"
              value={data.password}
              onChange={(e) => onChange({ ...data, password: e.target.value })}
              placeholder="Enter password"
              className="text-sm sm:text-base"
            />
          </div>
          <div>
            <Label htmlFor="role">Role *</Label>
            <Select value={data.role} onValueChange={(value: StaffRole) => onChange({ ...data, role: value })}>
              <SelectTrigger className="text-sm sm:text-base">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cashier">Salesperson</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      {isEdit && (
        <div>
          <Label htmlFor="edit-contact">Contact Info</Label>
          <TextInput
            id="edit-contact"
            value={data.contact_info}
            onChange={(e) => onChange({ ...data, contact_info: e.target.value })}
            placeholder="Enter phone or contact info"
          />
        </div>
      )}
      {!isEdit && isCreateRequest(data) && (
        <>
          <div>
            <Label htmlFor="contact_info">Contact Info</Label>
            <TextInput
              id="contact_info"
              value={data.contact_info}
              onChange={(e) => onChange({ ...data, contact_info: e.target.value })}
              placeholder="Enter contact information"
              className="text-sm sm:text-base"
            />
          </div>
          <div>
            <Label htmlFor="role">Role *</Label>
            <Select value={data.role} onValueChange={(value: StaffRole) => onChange({ ...data, role: value })}>
              <SelectTrigger className="text-sm sm:text-base">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cashier">Salesperson</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      {isEdit && (
        <>
          <div>
            <Label htmlFor="edit-role">Role</Label>
            <Select value={data.role} onValueChange={(value: StaffRole) => onChange({ ...data, role: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cashier">Salesperson</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-hourly-rate">Hourly Rate (GH₵)</Label>
            <TextInput
              id="edit-hourly-rate"
              type="number"
              step="0.01"
              value={data.hourly_rate || ''}
              onChange={(e) => onChange({ ...data, hourly_rate: parseFloat(e.target.value) || 15.0 })}
              placeholder="15.00"
            />
          </div>
        </>
      )}
      {!isEdit && isCreateRequest(data) && (
        <div>
          <Label htmlFor="hourly_rate">Hourly Rate (GH₵)</Label>
          <TextInput
            id="hourly_rate"
            type="number"
            step="0.01"
            value={data.hourly_rate}
            onChange={(e) => onChange({ ...data, hourly_rate: parseFloat(e.target.value) || 0 })}
            placeholder="15.00"
            className="text-sm sm:text-base"
          />
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={onSubmit}
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
