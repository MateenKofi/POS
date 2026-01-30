"use client"

import { useState, useMemo } from "react"
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
import { StaffTable } from "./staff-management/StaffTable"
import { StaffForm } from "./staff-management/StaffForm"
import { ChangePasswordForm } from "./staff-management/ChangePasswordForm"
import type { PasswordData } from "./staff-management/types"

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

export function StaffManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Form states
  const [newStaff, setNewStaff] = useState<CreateStaffRequest>(defaultNewStaff)
  const [editStaff, setEditStaff] = useState<UpdateStaffRequest>(defaultEditStaff)
  const [passwordData, setPasswordData] = useState<PasswordData>({
    current_password: "",
    new_password: "",
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

  const handleAddStaff = () => {
    if (!newStaff.first_name.trim() || !newStaff.last_name.trim() || !newStaff.email.trim() || !newStaff.username.trim() || !newStaff.password.trim()) {
      alert("Please fill in all required fields")
      return
    }

    if (newStaff.password.length < 6) {
      alert("Password must be at least 6 characters long")
      return
    }

    createStaffMutation.mutate(newStaff, {
      onSuccess: () => {
        setIsAddDialogOpen(false)
        setNewStaff(defaultNewStaff)
      }
    })
  }

  const handleEditStaff = () => {
    if (!editingStaff) return

    if (!editStaff.first_name?.trim() || !editStaff.last_name?.trim() || !editStaff.email?.trim()) {
      alert("Please fill in all required fields")
      return
    }

    updateStaffMutation.mutate({
      id: editingStaff.salesperson_id.toString(),
      data: editStaff
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false)
        setEditingStaff(null)
        setEditStaff(defaultEditStaff)
      }
    })
  }

  const handleUpdatePassword = () => {
    if (!editingStaff) return

    if (!passwordData.current_password.trim() || !passwordData.new_password.trim()) {
      alert("Please fill in all password fields")
      return
    }

    if (passwordData.new_password.length < 6) {
      alert("New password must be at least 6 characters long")
      return
    }

    updatePasswordMutation.mutate({
      id: editingStaff.salesperson_id.toString(),
      data: passwordData
    }, {
      onSuccess: () => {
        setIsPasswordDialogOpen(false)
        setPasswordData({ current_password: "", new_password: "" })
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
    setEditStaff({
      first_name: staff.first_name,
      last_name: staff.last_name,
      email: staff.email,
      contact_info: staff.contact_info,
      role: staff.role,
      hourly_rate: staff.hourly_rate || 15.0,
    })
    setIsEditDialogOpen(true)
  }

  const resetNewStaff = () => {
    setNewStaff(defaultNewStaff)
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
      />

      {/* Add Staff Modal */}
      {isAddDialogOpen && (
        <Modal
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          title="Add New Staff Member"
          size="md"
        >
          <StaffForm
            data={newStaff}
            isPending={createStaffMutation.isPending}
            onChange={setNewStaff}
            onSubmit={handleAddStaff}
            onCancel={() => {
              setIsAddDialogOpen(false)
              resetNewStaff()
            }}
          />
        </Modal>
      )}

      {/* Edit Staff Modal */}
      {isEditDialogOpen && (
        <Modal
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          title="Edit Staff Member"
          size="md"
        >
          <StaffForm
            isEdit
            data={editStaff}
            isPending={updateStaffMutation.isPending}
            onChange={setEditStaff}
            onSubmit={handleEditStaff}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </Modal>
      )}

      {/* Change Password Modal */}
      {isPasswordDialogOpen && (
        <Modal
          isOpen={isPasswordDialogOpen}
          onClose={() => setIsPasswordDialogOpen(false)}
          title="Change Password"
          size="md"
        >
          <ChangePasswordForm
            passwordData={passwordData}
            showPassword={showPassword}
            isPending={updatePasswordMutation.isPending}
            onDataChange={setPasswordData}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={handleUpdatePassword}
            onCancel={() => setIsPasswordDialogOpen(false)}
          />
        </Modal>
      )}
    </div>
  )
}
