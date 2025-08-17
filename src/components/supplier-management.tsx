"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Loader2, Mail, Building2, Package, DollarSign } from "lucide-react"
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier, useSearchSuppliers, useSupplierProductsBySupplier } from "@/hooks/useApi"
import type { Supplier, CreateSupplierRequest } from "@/lib/api"
import { toast } from "sonner"

export function SupplierManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [newSupplier, setNewSupplier] = useState<CreateSupplierRequest>({
    name: "",
    contact_info: "",
  })

  // API hooks
  const { data: suppliers, isLoading, error } = useSuppliers()
  const searchQuery = useSearchSuppliers(searchTerm)
  const createSupplier = useCreateSupplier()
  const updateSupplier = useUpdateSupplier()
  const deleteSupplier = useDeleteSupplier()

  // Use search results if search term exists and is long enough, otherwise use all suppliers
  const displaySuppliers = searchTerm && searchTerm.length > 2 ? searchQuery.data : suppliers
  const isSearching = searchTerm && searchTerm.length > 2 && searchQuery.isLoading

  const handleAddSupplier = async () => {
    if (!newSupplier.name || !newSupplier.contact_info) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      await createSupplier.mutateAsync(newSupplier)
      toast.success("Supplier created successfully!")
      setNewSupplier({ name: "", contact_info: "" })
      setIsAddDialogOpen(false)
    } catch (error) {
      toast.error("Failed to create supplier")
      console.error(error)
    }
  }

  const handleEditSupplier = async () => {
    if (!editingSupplier || !editingSupplier.supplier_id) return

    try {
      await updateSupplier.mutateAsync({
        id: editingSupplier.supplier_id.toString(),
        data: editingSupplier
      })
      toast.success("Supplier updated successfully!")
      setIsEditDialogOpen(false)
      setEditingSupplier(null)
    } catch (error) {
      toast.error("Failed to update supplier")
      console.error(error)
    }
  }

  const handleDeleteSupplier = async (id: number) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      try {
        await deleteSupplier.mutateAsync(id.toString())
        toast.success("Supplier deleted successfully!")
      } catch (error) {
        toast.error("Failed to delete supplier")
        console.error(error)
      }
    }
  }

  const openEditDialog = (supplier: Supplier) => {
    setEditingSupplier({ ...supplier })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setNewSupplier({ name: "", contact_info: "" })
    setEditingSupplier(null)
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Suppliers</h2>
          <p className="text-gray-600 mb-4">Failed to load suppliers from the server.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  // Show search error if it exists
  if (searchTerm && searchTerm.length > 2 && searchQuery.error) {
    toast.error("Search failed. Please try again.")
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
                <Label htmlFor="supplier-name">Company Name *</Label>
                <Input
                  id="supplier-name"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="contact-info">Contact Information *</Label>
                <Input
                  id="contact-info"
                  value={newSupplier.contact_info}
                  onChange={(e) => setNewSupplier({ ...newSupplier, contact_info: e.target.value })}
                  placeholder="Enter email, phone, or contact details"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddSupplier} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={createSupplier.isPending}
                >
                  {createSupplier.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Add Supplier"
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search suppliers by name or contact info..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Suppliers 
            {isLoading || isSearching ? (
              <span className="text-sm font-normal text-gray-500 ml-2">Loading...</span>
            ) : (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({displaySuppliers?.length || 0} suppliers)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || isSearching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">
                {isSearching ? "Searching suppliers..." : "Loading suppliers..."}
              </span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Contact Information</TableHead>
                  <TableHead>Products Supplied</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displaySuppliers?.map((supplier) => (
                  <SupplierRow key={supplier.supplier_id} supplier={supplier} onEdit={openEditDialog} onDelete={handleDeleteSupplier} />
                ))}
                {displaySuppliers?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      {searchTerm ? "No suppliers found matching your search." : "No suppliers available."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Supplier Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
          </DialogHeader>
          {editingSupplier && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-supplier-name">Company Name *</Label>
                <Input
                  id="edit-supplier-name"
                  value={editingSupplier.name}
                  onChange={(e) => setEditingSupplier({ ...editingSupplier, name: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
                <div>
                <Label htmlFor="edit-contact-info">Contact Information *</Label>
                <Input
                  id="edit-contact-info"
                  value={editingSupplier.contact_info}
                  onChange={(e) => setEditingSupplier({ ...editingSupplier, contact_info: e.target.value })}
                  placeholder="Enter email, phone, or contact details"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleEditSupplier} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={updateSupplier.isPending}
                >
                  {updateSupplier.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Supplier"
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Separate component for supplier row to handle product loading
function SupplierRow({ 
  supplier, 
  onEdit, 
  onDelete 
}: { 
  supplier: Supplier
  onEdit: (supplier: Supplier) => void
  onDelete: (id: number) => void
}) {
  const [isViewProductsOpen, setIsViewProductsOpen] = useState(false)
  const { data: supplierProducts, isLoading: productsLoading } = useSupplierProductsBySupplier(supplier.supplier_id.toString())
  
  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-600" />
            {supplier.name}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">{supplier.contact_info}</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-green-600" />
            <span className="text-slate-600">
              {supplierProducts ? `${supplierProducts?.length} products` : "Loading..."}
            </span>
                </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setIsViewProductsOpen(true)}
              title="View Products"
            >
              <Package className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => onEdit(supplier)}
            >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              onClick={() => onDelete(supplier.supplier_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
        </TableCell>
      </TableRow>

      {/* View Products Dialog */}
      <Dialog open={isViewProductsOpen} onOpenChange={setIsViewProductsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Products Supplied by {supplier.name}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Contact: {supplier.contact_info}
              </div>
              <div className="text-sm font-medium text-gray-700">
                Total Products: {supplierProducts?.length || 0}
                </div>
                </div>

            {productsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading products...</span>
                </div>
            ) : supplierProducts && supplierProducts.length > 0 ? (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Supply Price</TableHead>
                      <TableHead>Retail Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Profit Margin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplierProducts.map((sp) => {
                      const supplyPrice = parseFloat(sp.supply_price)
                      const retailPrice = parseFloat(sp.retail_price)
                      const profitMargin = retailPrice - supplyPrice
                      const profitMarginPercent = ((profitMargin / retailPrice) * 100).toFixed(1)
                      
                      return (
                        <TableRow key={`${sp.supplier_id}-${sp.product_id}`}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-green-600" />
                              <span className="font-medium">{sp.product_name}</span>
                  </div>
                          </TableCell>
                          <TableCell className="text-gray-600 max-w-xs truncate">
                            {sp.product_description}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                              <span className="font-semibold">${supplyPrice.toFixed(2)}</span>
                </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-green-600">${retailPrice.toFixed(2)}</span>
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${sp.stock_quantity < 20 ? "text-red-600" : "text-green-600"}`}>
                              {sp.stock_quantity} units
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ${profitMargin.toFixed(2)} ({profitMarginPercent}%)
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No Products Found</h3>
                <p>This supplier doesn't have any products assigned yet.</p>
      </div>
            )}
    </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
