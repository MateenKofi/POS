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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Plus, Search, Eye, EyeOff, Edit2, Trash2 } from "lucide-react"
import { Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// StaffRow component
function StaffRow({ 
  staff, 
  onEdit, 
  onDelete 
}: { 
  staff: Staff
  onEdit: (staff: Staff) => void
  onDelete: (id: number) => void
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
              {staff.first_name.charAt(0)}{staff.last_name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium">{staff.first_name} {staff.last_name}</p>
            <p className="text-sm text-gray-500">{staff.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          {staff.role}
        </Badge>
      </TableCell>
      <TableCell className="hidden lg:table-cell text-sm text-gray-600">
        {staff.contact_info || 'N/A'}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => onEdit(staff)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            onClick={() => onDelete(staff.salesperson_id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export function StaffManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Form states
  const [newStaff, setNewStaff] = useState<CreateStaffRequest>({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    contact_info: "",
    role: "cashier",
    hourly_rate: 15.0,
  })

  const [editStaff, setEditStaff] = useState<UpdateStaffRequest>({
    first_name: "",
    last_name: "",
    email: "",
    contact_info: "",
    role: "cashier",
    hourly_rate: 15.0,
  })

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
  })

  // API hooks
  const { data: staffData, isLoading } = useStaff()
  const createStaffMutation = useCreateStaff()
  const updateStaffMutation = useUpdateStaff()
  const deleteStaffMutation = useDeleteStaff()
  
  const updatePasswordMutation = useUpdateStaffPassword()

  const handleAddStaff = () => {
    // Basic validation
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
        setNewStaff({
          first_name: "",
          last_name: "",
          email: "",
          username: "",
          password: "",
          contact_info: "",
          role: "cashier",
          hourly_rate: 15.0,
        })
      }
    })
  }

  const handleEditStaff = () => {
    if (!editingStaff) return
    
    // Basic validation
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
        setEditStaff({
          first_name: "",
          last_name: "",
          email: "",
          contact_info: "",
          role: "cashier",
          hourly_rate: 15.0,
        })
      }
    })
  }

  const handleUpdatePassword = () => {
    if (!editingStaff) return
    
    // Basic validation
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

  

  const filteredStaff = useMemo(() => {
    const staffList = Array.isArray(staffData?.salespersons) ? staffData.salespersons : [];
    return staffList.filter(
      (member: Staff) =>
        member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [staffData, searchTerm]);

 

  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Staff Management</h1>
          <p className="text-sm sm:text-base text-slate-600">Manage your team members and their roles</p>
        </div>

        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
        >
          <Plus className="h-4 w-4" />
          Add Staff Member
        </Button>

      {isAddDialogOpen && (
        <Modal
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          title="Add New Staff Member"
          size="md"
        >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={newStaff.first_name}
                    onChange={(e) => setNewStaff({ ...newStaff, first_name: e.target.value })}
                    placeholder="Enter first name"
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={newStaff.last_name}
                    onChange={(e) => setNewStaff({ ...newStaff, last_name: e.target.value })}
                    placeholder="Enter last name"
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    placeholder="Enter email"
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={newStaff.username}
                    onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
                    placeholder="Enter username"
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newStaff.password}
                    onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                    placeholder="Enter password"
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Select value={newStaff.role} onValueChange={(value: "cashier" | "manager" | "admin") => setNewStaff({ ...newStaff, role: value })}>
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
              <div>
                <Label htmlFor="contact_info">Contact Info</Label>
                <Input
                  id="contact_info"
                  value={newStaff.contact_info}
                  onChange={(e) => setNewStaff({ ...newStaff, contact_info: e.target.value })}
                  placeholder="Enter contact information"
                  className="text-sm sm:text-base"
                />
              </div>
              <div>
                <Label htmlFor="hourly_rate">Hourly Rate (GH₵)</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  step="0.01"
                  value={newStaff.hourly_rate}
                  onChange={(e) => setNewStaff({ ...newStaff, hourly_rate: parseFloat(e.target.value) || 0 })}
                  placeholder="15.00"
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={handleAddStaff} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm sm:text-base py-2 sm:py-3"
                  disabled={createStaffMutation.isPending}
                >
                  {createStaffMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Add Staff Member"
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    setNewStaff({
                      first_name: "",
                      last_name: "",
                      email: "",
                      username: "",
                      password: "",
                      contact_info: "",
                      role: "cashier",
                      hourly_rate: 15.0,
                    })
                  }}
                  className="text-sm sm:text-base py-2 sm:py-3"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search staff by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm sm:text-base"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Staff Members 
            {isLoading ? (
              <span className="text-sm font-normal text-gray-500 ml-2">Loading...</span>
            ) : (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredStaff?.length || 0} staff members)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">
                Loading staff members...
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Name</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Role</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Contact</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff?.map((staff: Staff) => (
                    <StaffRow 
                      key={staff.salesperson_id} 
                      staff={staff} 
                      onEdit={openEditDialog} 
                      onDelete={handleDeleteStaff}
                    />
                  ))}
                  {filteredStaff?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500 text-sm sm:text-base">
                        {searchTerm ? "No staff members found matching your search." : "No staff members available."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Staff Modal */}
      {isEditDialogOpen && (
        <Modal
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          title="Edit Staff Member"
          size="md"
        >
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="w-1/2">
                <Label htmlFor="edit-first-name">First Name</Label>
                <Input
                  id="edit-first-name"
                  value={editStaff.first_name}
                  onChange={(e) => setEditStaff({ ...editStaff, first_name: e.target.value })}
                  placeholder="Enter first name"
                />
              </div>
              <div className="w-1/2">
                <Label htmlFor="edit-last-name">Last Name</Label>
                <Input
                  id="edit-last-name"
                  value={editStaff.last_name}
                  onChange={(e) => setEditStaff({ ...editStaff, last_name: e.target.value })}
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editStaff.email}
                onChange={(e) => setEditStaff({ ...editStaff, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="edit-contact">Contact Info</Label>
              <Input
                id="edit-contact"
                value={editStaff.contact_info}
                onChange={(e) => setEditStaff({ ...editStaff, contact_info: e.target.value })}
                placeholder="Enter phone or contact info"
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Role</Label>
              <Select value={editStaff.role} onValueChange={(value: "cashier" | "manager" | "admin") => setEditStaff({ ...editStaff, role: value })}>
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
              <Label htmlFor="edit-hourly-rate">Hourly Rate ($)</Label>
              <Input
                id="edit-hourly-rate"
                type="number"
                step="0.01"
                value={editStaff.hourly_rate || ''}
                onChange={(e) => setEditStaff({ ...editStaff, hourly_rate: parseFloat(e.target.value) || 15.0 })}
                placeholder="15.00"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleEditStaff}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={updateStaffMutation.isPending}
              >
                {updateStaffMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
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
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleUpdatePassword}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={updatePasswordMutation.isPending}
              >
                {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
