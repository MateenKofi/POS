"use client"

import { useState } from "react"
import { Button } from "@/components/custom-components"
import { Modal } from "@/components/modal"
import { Plus, AlertTriangle, Package } from "lucide-react"
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useApi"
import type { Product, CreateProductRequest } from "@/lib/api"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

// Product management sub-components
import { ProductTable } from "./ProductTable"
import { ProductForm } from "./ProductForm"
import { ProductSummary } from "./ProductSummary"
import { ProductStats } from "./ProductStats"

import type { ProductTab } from "./types"

export function ProductManagement() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Data states

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState<CreateProductRequest>({
    name: "",
    description: "",
    price: "",
    cost_price: "",
    stock_quantity: 0,
    unit_type: "loose",
    weight_per_bag: undefined,
    category: "",
    barcode: "",
    supplier: "",
    expiry_date: "",
    batch_number: "",
    manufacturer: "",
    reorder_level: 10,
  })

  // Search and tab states
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<ProductTab>('all')

  // API hooks
  const { data: products, isLoading, error } = useProducts()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  // Helper function to check product expiry status
  const getExpiryStatus = (product: Product) => {
    if (!product.expiry_date) return 'none'
    const daysUntilExpiry = Math.ceil((new Date(product.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (daysUntilExpiry < 0) return 'expired'
    if (daysUntilExpiry <= 30) return 'expiring'
    return 'ok'
  }

  // Frontend search implementation - filter products locally
  const baseFilteredProducts = products?.filter((product: Product) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.product_id.toString().includes(searchTerm) ||
      product.price.includes(searchTerm) ||
      product.stock_quantity.toString().includes(searchTerm)
    )
  }) || []

  // Filter by tab selection
  const filteredProducts = baseFilteredProducts.filter((product: Product) => {
    const status = getExpiryStatus(product)
    switch (activeTab) {
      case 'expired':
        return status === 'expired'
      case 'expiring':
        return status === 'expiring'
      case 'all':
      default:
        return true
    }
  })

  // Get counts for tabs
  const expiredCount = baseFilteredProducts.filter((p: Product) => getExpiryStatus(p) === 'expired').length
  const expiringCount = baseFilteredProducts.filter((p: Product) => getExpiryStatus(p) === 'expiring').length

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.cost_price) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      await createProduct.mutateAsync(newProduct)
      toast.success("Product created successfully!")
      resetForm()
      setIsAddDialogOpen(false)
    } catch (error) {
      toast.error("Failed to create product")
      console.error(error)
    }
  }

  const handleEditProduct = async () => {
    if (!editingProduct || !editingProduct.product_id) return

    try {
      await updateProduct.mutateAsync({
        id: editingProduct.product_id.toString(),
        data: editingProduct
      })
      toast.success("Product updated successfully!")
      setIsEditDialogOpen(false)
      setEditingProduct(null)
    } catch (error) {
      toast.error("Failed to update product")
      console.error(error)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct.mutateAsync(id.toString())
        toast.success("Product deleted successfully!")
      } catch (error) {
        toast.error("Failed to delete product")
        console.error(error)
      }
    }
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct({ ...product })
    setIsEditDialogOpen(true)
  }



  const resetForm = () => {
    setNewProduct({
      name: "",
      description: "",
      price: "",
      cost_price: "",
      stock_quantity: 0,
      unit_type: "loose",
      weight_per_bag: undefined,
      category: "",
      barcode: "",
      supplier: "",
      expiry_date: "",
      batch_number: "",
      manufacturer: "",
      reorder_level: 10,
    })
    setEditingProduct(null)
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">Failed to load products from the server.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/25 hidden sm:block">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Product Management
            </h1>
            <p className="text-sm sm:text-base text-slate-500">Manage your inventory and product catalog</p>
          </div>
        </div>

        {isAdmin && (
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white gap-2 w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3 shadow-lg shadow-green-500/20 rounded-xl"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>

      {/* Product Stats Cards */}
      <ProductStats
        totalProducts={baseFilteredProducts.length}
        expiringCount={expiringCount}
        expiredCount={expiredCount}
      />

      <ProductTable
        filteredProducts={filteredProducts}
        baseFilteredProducts={baseFilteredProducts}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        expiredCount={expiredCount}
        expiringCount={expiringCount}
        onEdit={openEditDialog}
        onDelete={handleDeleteProduct}
        deleteProduct={deleteProduct}
        isAdmin={isAdmin}
      />

      <ProductSummary products={filteredProducts} />

      {/* Add Product Modal */}
      {isAddDialogOpen && (
        <Modal
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          title="Add New Product"
          size="xl"
        >
          <ProductForm
            product={newProduct}
            isPending={createProduct.isPending}
            onChange={setNewProduct}
            onSubmit={handleAddProduct}
            onCancel={() => {
              setIsAddDialogOpen(false)
              resetForm()
            }}
          />
        </Modal>
      )}

      {/* Edit Product Modal */}
      {isEditDialogOpen && editingProduct && (
        <Modal
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          title="Edit Product"
          size="xl"
        >
          <ProductForm
            product={editingProduct}
            isEdit
            isPending={updateProduct.isPending}
            onChange={(p) => setEditingProduct(p as Product)}
            onSubmit={handleEditProduct}
            onCancel={() => {
              setIsEditDialogOpen(false)
              resetForm()
            }}
          />
        </Modal>
      )}

      {/* Supplier Details Modal */}

    </div>
  )
}
