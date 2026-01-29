"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/modal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Loader2, Building2, Package, BadgeCent } from "lucide-react"
import { useCreateSupplierProduct, useUpdateSupplierProduct, useDeleteSupplierProduct, useSuppliers, useProducts, useAllSupplierProducts } from "@/hooks/useApi"
import type { SupplierProductWithDetails, CreateSupplierProductRequest } from "@/lib/api"
import { toast } from "sonner"

export function SupplierProductManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSupplierProduct, setEditingSupplierProduct] = useState<SupplierProductWithDetails | null>(null)
  const [newSupplierProduct, setNewSupplierProduct] = useState<CreateSupplierProductRequest>({
    supplier_id: 0,
    product_id: 0,
    supply_price: "",
  })

  // API hooks
  const { data: suppliers, isLoading: suppliersLoading } = useSuppliers()
  const { data: products, isLoading: productsLoading } = useProducts()
  const { data: supplierProducts, isLoading: supplierProductsLoading, error } = useAllSupplierProducts()
  const createSupplierProduct = useCreateSupplierProduct()
  const updateSupplierProduct = useUpdateSupplierProduct()
  const deleteSupplierProduct = useDeleteSupplierProduct()

  const isLoading = suppliersLoading || productsLoading || supplierProductsLoading

  // Filter supplier products based on search term
  const filteredSupplierProducts = supplierProducts?.filter((sp) =>
    sp.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sp.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const handleAddSupplierProduct = async () => {
    if (!newSupplierProduct.supplier_id || !newSupplierProduct.product_id || !newSupplierProduct.supply_price) {
      toast.error("Please fill in all required fields")
      return
    }

    // Check if this supplier-product combination already exists
    const exists = supplierProducts?.some(
      sp => sp.supplier_id === newSupplierProduct.supplier_id && sp.product_id === newSupplierProduct.product_id
    )

    if (exists) {
      toast.error("This supplier already supplies this product")
      return
    }

    try {
      await createSupplierProduct.mutateAsync(newSupplierProduct)
      toast.success("Supplier product relationship created successfully!")
      setNewSupplierProduct({ supplier_id: 0, product_id: 0, supply_price: "" })
      setIsAddDialogOpen(false)
    } catch (error) {
      toast.error("Failed to create supplier product relationship")
      console.error(error)
    }
  }

  const handleEditSupplierProduct = async () => {
    if (!editingSupplierProduct) return

    try {
      await updateSupplierProduct.mutateAsync({
        supplierId: editingSupplierProduct.supplier_id.toString(),
        productId: editingSupplierProduct.product_id.toString(),
        data: {
          supply_price: editingSupplierProduct.supply_price,
        }
      })
      toast.success("Supply price updated successfully!")
      setIsEditDialogOpen(false)
      setEditingSupplierProduct(null)
    } catch (error) {
      toast.error("Failed to update supply price")
      console.error(error)
    }
  }

  const handleDeleteSupplierProduct = async (supplierId: number, productId: number) => {
    if (confirm("Are you sure you want to remove this product from the supplier?")) {
      try {
        await deleteSupplierProduct.mutateAsync({
          supplierId: supplierId.toString(),
          productId: productId.toString()
        })
        toast.success("Supplier product relationship removed successfully!")
      } catch (error) {
        toast.error("Failed to remove supplier product relationship")
        console.error(error)
      }
    }
  }

  const openEditDialog = (supplierProduct: SupplierProductWithDetails) => {
    setEditingSupplierProduct({ ...supplierProduct })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setNewSupplierProduct({ supplier_id: 0, product_id: 0, supply_price: "" })
    setEditingSupplierProduct(null)
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Supplier Products</h2>
          <p className="text-gray-600 mb-4">Failed to load supplier product relationships from the server.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Supplier Product Management</h1>
          <p className="text-slate-600">Manage which suppliers provide which products and their supply prices</p>
        </div>

        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Supplier Product
        </Button>

      {isAddDialogOpen && (
        <Modal
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          title="Add New Supplier Product Relationship"
          size="md"
        >
            <div className="space-y-4">
              <div>
                <Label htmlFor="supplier">Supplier *</Label>
                <Select
                  value={newSupplierProduct.supplier_id.toString()}
                  onValueChange={(value) => setNewSupplierProduct({ ...newSupplierProduct, supplier_id: parseInt(value) })}

                >
                  <SelectTrigger className="w-full text-gray-900">
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers?.map((supplier) => (
                      <SelectItem key={supplier.supplier_id} value={supplier.supplier_id.toString()}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="product">Product *</Label>
                <Select
                  value={newSupplierProduct.product_id.toString()}
                  onValueChange={(value) => setNewSupplierProduct({ ...newSupplierProduct, product_id: parseInt(value) })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products?.map((product) => (
                      <SelectItem key={product.product_id} value={product.product_id.toString()}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="supply-price">Supply Price ($) *</Label>
                <Input
                  id="supply-price"
                  type="number"
                  step="0.01"
                  value={newSupplierProduct.supply_price}
                  onChange={(e) => setNewSupplierProduct({ ...newSupplierProduct, supply_price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddSupplierProduct} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={createSupplierProduct.isPending}
                >
                  {createSupplierProduct.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Add Relationship"
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
          </Modal>
        )}
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search by supplier name or product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Supplier Product Relationships 
            {isLoading ? (
              <span className="text-sm font-normal text-gray-500 ml-2">Loading...</span>
            ) : (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredSupplierProducts?.length} relationships)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading supplier product relationships...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Supply Price</TableHead>
                  <TableHead>Retail Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Profit Margin</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSupplierProducts?.map((sp) => {
                  const supplyPrice = parseFloat(sp.supply_price)
                  const retailPrice = parseFloat(sp.retail_price)
                  const profitMargin = retailPrice - supplyPrice
                  const profitMarginPercent = ((profitMargin / retailPrice) * 100).toFixed(1)
                  
                  return (
                    <TableRow key={`${sp.supplier_id}-${sp.product_id}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{sp.supplier_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-green-600" />
                          <div>
                            <div className="font-medium">{sp.product_name}</div>
                            <div className="text-sm text-gray-500">{sp.product_description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <BadgeCent className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold">GH {supplyPrice.toFixed(2)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">GH {retailPrice.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-gray-600">
                          {sp.stock_quantity || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          GH {profitMargin.toFixed(2)} ({profitMarginPercent}%)
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => openEditDialog(sp)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteSupplierProduct(sp.supplier_id, sp.product_id)}
                            disabled={deleteSupplierProduct.isPending}
                          >
                            {deleteSupplierProduct.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredSupplierProducts?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {searchTerm ? "No supplier product relationships found matching your search." : "No supplier product relationships available."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Supplier Product Modal */}
      {isEditDialogOpen && (
        <Modal
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          title="Edit Supply Price"
          size="md"
        >
          {editingSupplierProduct && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-supplier">Supplier</Label>
                <Input
                  id="edit-supplier"
                  value={editingSupplierProduct.supplier_name}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="edit-product">Product</Label>
                <Input
                  id="edit-product"
                  value={editingSupplierProduct.product_name}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="edit-supply-price">Supply Price ($) *</Label>
                <Input
                  id="edit-supply-price"
                  type="number"
                  step="0.01"
                  value={editingSupplierProduct.supply_price}
                  onChange={(e) => setEditingSupplierProduct({ ...editingSupplierProduct, supply_price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleEditSupplierProduct} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={updateSupplierProduct.isPending}
                >
                  {updateSupplierProduct.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Price"
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
        </Modal>
      )}
    </div>
  )
}
