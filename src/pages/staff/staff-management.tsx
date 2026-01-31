"use client"

import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import {
  useStaff,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
  useUpdateStaffPassword
} from "@/hooks/useApi"
import { type Staff, type CreateStaffRequest, type UpdateStaffRequest } from "@/lib/api"
import { Button } from "@/components/custom-components"
import { Modal } from "@/components/modal"
import { Plus } from "lucide-react"

// Staff management sub-components
import { StaffTable } from "./StaffTable"
import { StaffForm } from "./StaffForm"
import { ChangePasswordForm } from "./ChangePasswordForm"
import type { PasswordData } from "./types"

const defaultNewStaff: CreateStaffRequest = {
  first_name: "",
  last_name: "",
  email: "",
  username: "",
  password: "",
  contact_info: "",
  role: "cashier",
  hourly_rate: 15.0,
}

const defaultEditStaff: UpdateStaffRequest = {
  first_name: "",
  last_name: "",
  email: "",
  contact_info: "",
  role: "cashier",
  hourly_rate: 15.0,
}

const defaultPasswordData: PasswordData = {
  current_password: "",
  new_password: "",
}

export function StaffManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Forms
  const newStaffForm = useForm<CreateStaffRequest | UpdateStaffRequest>({
    defaultValues: defaultNewStaff,
  })

  const editStaffForm = useForm<CreateStaffRequest | UpdateStaffRequest>({
    defaultValues: defaultEditStaff,
  })

  const passwordForm = useForm<PasswordData>({
    defaultValues: defaultPasswordData,
  })

  // API hooks
  const { data: staffData, isLoading } = useStaff()
  const createStaffMutation = useCreateStaff()
  const updateStaffMutation = useUpdateStaff()
  const deleteStaffMutation = useDeleteStaff()
  const updatePasswordMutation = useUpdateStaffPassword()

  const filteredStaff = useMemo(() => {
    const staffList = Array.isArray(staffData?.salespersons) ? staffData.salespersons : []
    return staffList.filter(
      (member: Staff) =>
        member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [staffData, searchTerm])

  const handleAddStaff = (data: CreateStaffRequest | UpdateStaffRequest) => {
    if (!data.first_name?.trim() || !data.last_name?.trim() || !data.email?.trim() || !data.username?.trim() || !data.password?.trim()) {
      alert("Please fill in all required fields")
      return
    }

    if (data.password && data.password.length < 6) {
      alert("Password must be at least 6 characters long")
      return
    }

    createStaffMutation.mutate(data as CreateStaffRequest, {
      onSuccess: () => {
        setIsAddDialogOpen(false)
        newStaffForm.reset(defaultNewStaff)
      }
    })
  }

  const handleEditStaff = (data: UpdateStaffRequest) => {
    if (!editingStaff) return

    if (!data.first_name?.trim() || !data.last_name?.trim() || !data.email?.trim()) {
      alert("Please fill in all required fields")
      return
    }

    updateStaffMutation.mutate({
      id: editingStaff.salesperson_id.toString(),
      data: data
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false)
        setEditingStaff(null)
        editStaffForm.reset(defaultEditStaff)
      }
    })
  }

  const handleUpdatePassword = (data: PasswordData) => {
    if (!editingStaff) return

    if (!data.current_password.trim() || !data.new_password.trim()) {
      alert("Please fill in all password fields")
      return
    }

    if (data.new_password.length < 6) {
      alert("New password must be at least 6 characters long")
      return
    }

    updatePasswordMutation.mutate({
      id: editingStaff.salesperson_id.toString(),
      data: data
    }, {
      onSuccess: () => {
        setIsPasswordDialogOpen(false)
        passwordForm.reset(defaultPasswordData)
        setEditingStaff(null)
      }
    })
  }

  const handleDeleteStaff = (id: number) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      deleteStaffMutation.mutate(id.toString())
    }
  }

  const openEditDialog = (staff: Staff) => {
    setEditingStaff(staff)
    editStaffForm.reset({
      first_name: staff.first_name,
      last_name: staff.last_name,
      email: staff.email,
      contact_info: staff.contact_info,
      role: staff.role,
      hourly_rate: staff.hourly_rate || 15.0,
    })
    setIsEditDialogOpen(true)
  }

  const openPasswordDialog = (staff: Staff) => {
    setEditingStaff(staff)
    passwordForm.reset(defaultPasswordData)
    setIsPasswordDialogOpen(true)
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Staff Management</h1>
          <p className="text-sm sm:text-base text-slate-600">Manage your team members and their roles</p>
        </div>

        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white gap-2 w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
        >
          <Plus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      <StaffTable
        filteredStaff={filteredStaff}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onEdit={openEditDialog}
        onDelete={handleDeleteStaff}
        onChangePassword={openPasswordDialog}
      />

      {/* Add Staff Modal */}
      {isAddDialogOpen && (
        <Modal
          isOpen={isAddDialogOpen}
          onClose={() => {
            setIsAddDialogOpen(false)
            newStaffForm.reset(defaultNewStaff)
          }}
          title="Add New Staff Member"
          size="md"
        >
          <StaffForm
            form={newStaffForm}
            isPending={createStaffMutation.isPending}
            onSubmit={newStaffForm.handleSubmit(handleAddStaff)}
            onCancel={() => {
              setIsAddDialogOpen(false)
              newStaffForm.reset(defaultNewStaff)
            }}
          />
        </Modal>
      )}

      {/* Edit Staff Modal */}
      {isEditDialogOpen && (
        <Modal
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
            setEditingStaff(null)
          }}
          title="Edit Staff Member"
          size="md"
        >
          <StaffForm
            isEdit
            form={editStaffForm}
            isPending={updateStaffMutation.isPending}
            onSubmit={editStaffForm.handleSubmit(handleEditStaff)}
            onCancel={() => {
              setIsEditDialogOpen(false)
              setEditingStaff(null)
            }}
          />
        </Modal>
      )}

      {/* Change Password Modal */}
      {isPasswordDialogOpen && (
        <Modal
          isOpen={isPasswordDialogOpen}
          onClose={() => {
            setIsPasswordDialogOpen(false)
            passwordForm.reset(defaultPasswordData)
            setEditingStaff(null)
          }}
          title="Change Password"
          size="md"
        >
          <ChangePasswordForm
            form={passwordForm}
            showPassword={showPassword}
            isPending={updatePasswordMutation.isPending}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={passwordForm.handleSubmit(handleUpdatePassword)}
            onCancel={() => {
              setIsPasswordDialogOpen(false)
              passwordForm.reset(defaultPasswordData)
              setEditingStaff(null)
            }}
          />
        </Modal>
      )}
    </div>
  )
}
