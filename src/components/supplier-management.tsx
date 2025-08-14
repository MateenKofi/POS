"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, Phone, Mail } from "lucide-react"

interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  address: string
  status: "active" | "inactive"
  productsSupplied: number
}

export function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "1",
      name: "Coffee Co.",
      contact: "John Smith",
      email: "john@coffeeco.com",
      phone: "+1 (555) 123-4567",
      address: "123 Coffee St, Bean City, BC 12345",
      status: "active",
      productsSupplied: 15,
    },
    {
      id: "2",
      name: "Fresh Farms",
      contact: "Mary Johnson",
      email: "mary@freshfarms.com",
      phone: "+1 (555) 987-6543",
      address: "456 Farm Rd, Dairy Valley, DV 67890",
      status: "active",
      productsSupplied: 8,
    },
    {
      id: "3",
      name: "Local Bakery",
      contact: "Bob Wilson",
      email: "bob@localbakery.com",
      phone: "+1 (555) 456-7890",
      address: "789 Bread Ave, Flour Town, FT 13579",
      status: "inactive",
      productsSupplied: 12,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
  })

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSupplier = () => {
    if (newSupplier.name && newSupplier.contact) {
      const supplier: Supplier = {
        id: Date.now().toString(),
        name: newSupplier.name,
        contact: newSupplier.contact,
        email: newSupplier.email,
        phone: newSupplier.phone,
        address: newSupplier.address,
        status: "active",
        productsSupplied: 0,
      }
      setSuppliers([...suppliers, supplier])
      setNewSupplier({ name: "", contact: "", email: "", phone: "", address: "" })
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter((s) => s.id !== id))
  }

  const toggleSupplierStatus = (id: string) => {
    setSuppliers(
      suppliers.map((supplier) =>
        supplier.id === id ? { ...supplier, status: supplier.status === "active" ? "inactive" : "active" } : supplier,
      ),
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Supplier Management</h1>
          <p className="text-slate-600">Manage your business relationships and supply chain</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus className="h-4 w-4" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="supplier-name">Company Name</Label>
                <Input
                  id="supplier-name"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="contact-name">Contact Person</Label>
                <Input
                  id="contact-name"
                  value={newSupplier.contact}
                  onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                  placeholder="Enter contact person name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  placeholder="Enter full address"
                />
              </div>
              <Button onClick={handleAddSupplier} className="w-full bg-blue-600 hover:bg-blue-700">
                Add Supplier
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-slate-800">{supplier.name}</CardTitle>
                  <p className="text-sm text-slate-600 mt-1">{supplier.contact}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteSupplier(supplier.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Badge
                variant={supplier.status === "active" ? "default" : "secondary"}
                className={supplier.status === "active" ? "bg-green-600" : ""}
              >
                {supplier.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">{supplier.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">{supplier.phone}</span>
                </div>
                <div className="text-sm">
                  <p className="text-slate-600">{supplier.address}</p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Products Supplied:</span>
                    <span className="font-semibold text-slate-800">{supplier.productsSupplied}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => toggleSupplierStatus(supplier.id)}
                >
                  {supplier.status === "active" ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
