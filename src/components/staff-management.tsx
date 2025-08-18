"use client"

import { useState, useMemo } from "react"
import { 
  useStaff, 
  useCreateStaff, 
  useUpdateStaff, 
  useDeleteStaff, 
  useToggleStaffStatus, 
  useUpdateStaffRole,
  useUpdateStaffPassword
} from "@/hooks/useApi"
import { type Staff, type CreateStaffRequest, type UpdateStaffRequest } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Plus, Search, Edit, Trash2, User, Clock, Eye, EyeOff } from "lucide-react"

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
    role: "salesperson",
    hourly_rate: 15.0,
  })

  const [editStaff, setEditStaff] = useState<UpdateStaffRequest>({
    first_name: "",
    last_name: "",
    email: "",
    contact_info: "",
    role: "salesperson",
    hourly_rate: 15.0,
  })

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
  })

  // API hooks
  const { data: staffData, isLoading, error } = useStaff()
  const createStaffMutation = useCreateStaff()
  const updateStaffMutation = useUpdateStaff()
  const deleteStaffMutation = useDeleteStaff()
  const updateRoleMutation = useUpdateStaffRole()
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
          role: "salesperson",
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
          role: "salesperson",
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
      hourly_rate: staff.hourly_rate,
    })
    setIsEditDialogOpen(true)
  }

  const handleRoleUpdate = (staffId: number, newRole: "salesperson" | "manager" | "admin") => {
    updateRoleMutation.mutate({
      id: staffId.toString(),
      data: { role: newRole }
    })
  }

  const openPasswordDialog = (staff: Staff) => {
    setEditingStaff(staff)
    setIsPasswordDialogOpen(true)
  }

  const filteredStaff = useMemo(() => {
    const staffList = Array.isArray(staffData?.salespersons) ? staffData.salespersons : [];
    return staffList.filter(
      (member) =>
        member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [staffData, searchTerm]);



  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "manager":
        return "bg-blue-600"
      case "salesperson":
        return "bg-slate-600"
      case "admin":
        return "bg-pink-600"
      default:
        return "bg-slate-600"
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "manager":
        return "Manager"
      case "salesperson":
        return "Salesperson"
      case "admin":
        return "Admin"
      default:
        return role.charAt(0).toUpperCase() + role.slice(1)
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Staff Management</h1>
          <p className="text-slate-600">Manage your team members and their roles</p>
        </div>

        {/* Add Staff Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus className="h-4 w-4" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="w-1/2">
                  <Label htmlFor="staff-first-name">First Name</Label>
                  <Input
                    id="staff-first-name"
                    value={newStaff.first_name}
                    onChange={(e) => setNewStaff({ ...newStaff, first_name: e.target.value })}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="w-1/2">
                  <Label htmlFor="staff-last-name">Last Name</Label>
                  <Input
                    id="staff-last-name"
                    value={newStaff.last_name}
                    onChange={(e) => setNewStaff({ ...newStaff, last_name: e.target.value })}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="staff-email">Email</Label>
                <Input
                  id="staff-email"
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="staff-username">Username</Label>
                <Input
                  id="staff-username"
                  value={newStaff.username}
                  onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="staff-password">Password</Label>
                <Input
                  id="staff-password"
                  type="password"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>
              <div>
                <Label htmlFor="staff-contact">Contact Info</Label>
                <Input
                  id="staff-contact"
                  value={newStaff.contact_info}
                  onChange={(e) => setNewStaff({ ...newStaff, contact_info: e.target.value })}
                  placeholder="Enter phone or contact info"
                />
              </div>
              <div>
                <Label htmlFor="staff-role">Role</Label>
                <Select value={newStaff.role} onValueChange={(value: "salesperson" | "manager" | "admin") => setNewStaff({ ...newStaff, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salesperson">Salesperson</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
                <Input
                  id="hourly-rate"
                  type="number"
                  step="0.01"
                  value={newStaff.hourly_rate}
                  onChange={(e) => setNewStaff({ ...newStaff, hourly_rate: parseFloat(e.target.value) || 15.0 })}
                  placeholder="15.00"
                />
              </div>
              <Button
                onClick={handleAddStaff}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={createStaffMutation.isPending}
              >
                {createStaffMutation.isPending ? "Adding..." : "Add Staff Member"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search staff members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Staff List */}
      {isLoading ? (
        <div className="text-center text-slate-500 py-10">Loading staff...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">Failed to load staff</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member) => (
            <Card key={member.salesperson_id} className="border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-800">
                        {member.first_name} {member.last_name}
                      </CardTitle>
                      <p className="text-sm text-slate-600">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => openEditDialog(member)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteStaff(member.salesperson_id)}
                      disabled={deleteStaffMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge className={`${getRoleBadgeColor(member.role)} text-white`}>
                    {getRoleDisplayName(member.role)}
                  </Badge>
        
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">Contact: {member.contact_info}</p>
                  <div className="flex gap-2">
      
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => openPasswordDialog(member)}
                    >
                      Change Password
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Select 
                      value={member.role} 
                      onValueChange={(value: "salesperson" | "manager" | "admin") => 
                        handleRoleUpdate(member.salesperson_id, value)
                      }
                      disabled={updateRoleMutation.isPending}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salesperson">Salesperson</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
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
              <Select value={editStaff.role} onValueChange={(value: "salesperson" | "manager" | "admin") => setEditStaff({ ...editStaff, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salesperson">Salesperson</SelectItem>
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
                value={editStaff.hourly_rate}
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
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>
    </div>
  )
}
