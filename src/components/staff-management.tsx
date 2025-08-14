"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, User, Clock } from "lucide-react"

interface Staff {
  id: string
  name: string
  email: string
  phone: string
  role: "manager" | "cashier" | "supervisor"
  status: "active" | "inactive"
  hireDate: string
  hourlyRate: number
  hoursWorked: number
}

export function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@store.com",
      phone: "+1 (555) 123-4567",
      role: "manager",
      status: "active",
      hireDate: "2023-01-15",
      hourlyRate: 25.0,
      hoursWorked: 160,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@store.com",
      phone: "+1 (555) 987-6543",
      role: "cashier",
      status: "active",
      hireDate: "2023-03-20",
      hourlyRate: 18.0,
      hoursWorked: 140,
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@store.com",
      phone: "+1 (555) 456-7890",
      role: "supervisor",
      status: "active",
      hireDate: "2023-02-10",
      hourlyRate: 22.0,
      hoursWorked: 155,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    hourlyRate: "",
  })

  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.email && newStaff.role) {
      const staffMember: Staff = {
        id: Date.now().toString(),
        name: newStaff.name,
        email: newStaff.email,
        phone: newStaff.phone,
        role: newStaff.role as "manager" | "cashier" | "supervisor",
        status: "active",
        hireDate: new Date().toISOString().split("T")[0],
        hourlyRate: Number.parseFloat(newStaff.hourlyRate) || 15.0,
        hoursWorked: 0,
      }
      setStaff([...staff, staffMember])
      setNewStaff({ name: "", email: "", phone: "", role: "", hourlyRate: "" })
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter((s) => s.id !== id))
  }

  const toggleStaffStatus = (id: string) => {
    setStaff(
      staff.map((member) =>
        member.id === id ? { ...member, status: member.status === "active" ? "inactive" : "active" } : member,
      ),
    )
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "manager":
        return "bg-purple-600"
      case "supervisor":
        return "bg-blue-600"
      case "cashier":
        return "bg-green-600"
      default:
        return "bg-slate-600"
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Staff Management</h1>
          <p className="text-slate-600">Manage your team members and their roles</p>
        </div>

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
              <div>
                <Label htmlFor="staff-name">Full Name</Label>
                <Input
                  id="staff-name"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="Enter full name"
                />
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
                <Label htmlFor="staff-phone">Phone</Label>
                <Input
                  id="staff-phone"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="staff-role">Role</Label>
                <Select value={newStaff.role} onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cashier">Cashier</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
                <Input
                  id="hourly-rate"
                  type="number"
                  step="0.01"
                  value={newStaff.hourlyRate}
                  onChange={(e) => setNewStaff({ ...newStaff, hourlyRate: e.target.value })}
                  placeholder="15.00"
                />
              </div>
              <Button onClick={handleAddStaff} className="w-full bg-blue-600 hover:bg-blue-700">
                Add Staff Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <Card key={member.id} className="border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-800">{member.name}</CardTitle>
                    <p className="text-sm text-slate-600">{member.email}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteStaff(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className={`${getRoleBadgeColor(member.role)} text-white`}>{member.role}</Badge>
                <Badge
                  variant={member.status === "active" ? "default" : "secondary"}
                  className={member.status === "active" ? "bg-green-600 text-white" : ""}
                >
                  {member.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="text-slate-600">Phone: {member.phone}</p>
                </div>
                <div className="text-sm">
                  <p className="text-slate-600">Hire Date: {new Date(member.hireDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">{member.hoursWorked}h this month</span>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Hourly Rate:</span>
                    <span className="font-semibold text-slate-800">${member.hourlyRate.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => toggleStaffStatus(member.id)}
                >
                  {member.status === "active" ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
