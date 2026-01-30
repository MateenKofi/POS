"use client"

import { useState } from "react"
import { Button } from "@/components/custom-components"
import { Plus } from "lucide-react"
import { useCreateSupplierProduct, useUpdateSupplierProduct, useDeleteSupplierProduct, useSuppliers, useProducts, useAllSupplierProducts } from "@/hooks/useApi"
import type { SupplierProductWithDetails, CreateSupplierProductRequest } from "@/lib/api"
import { toast } from "sonner"

// Sub-components
import { SupplierProductForm } from "./supplier-product-management/SupplierProductForm"
import { SupplierProductEditForm } from "./supplier-product-management/SupplierProductEditForm"
import { SupplierProductTable } from "./supplier-product-management/SupplierProductTable"

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
          className="bg-green-600 hover:bg-green-700 text-white gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Supplier Product
        </Button>
      </div>

      <SupplierProductTable
        filteredSupplierProducts={filteredSupplierProducts}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onEdit={openEditDialog}
        onDelete={handleDeleteSupplierProduct}
        isDeletePending={deleteSupplierProduct.isPending}
      />

      <SupplierProductForm
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false)
          resetForm()
        }}
        data={newSupplierProduct}
        suppliers={suppliers}
        products={products}
        isPending={createSupplierProduct.isPending}
        onChange={setNewSupplierProduct}
        onSubmit={handleAddSupplierProduct}
      />

      <SupplierProductEditForm
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          resetForm()
        }}
        data={editingSupplierProduct}
        isPending={updateSupplierProduct.isPending}
        onChange={setEditingSupplierProduct}
        onSubmit={handleEditSupplierProduct}
      />
    </div>
  )
}
