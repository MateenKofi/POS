"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/modal"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Loader2, Package, Truck, Copy } from "lucide-react"
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useApi"
import type { Product, CreateProductRequest } from "@/lib/api"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

export function ProductManagement() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSupplierDetailsOpen, setIsSupplierDetailsOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
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

  // API hooks
  const { data: products, isLoading, error } = useProducts()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  // Frontend search implementation - filter products locally
  const filteredProducts = products?.filter((product: Product) => {
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

  const isSearching = false // No longer needed since search is frontend-only

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

  const openSupplierDetails = (product: Product) => {
    setSelectedProduct(product)
    setIsSupplierDetailsOpen(true)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Contact information copied to clipboard!")
    } catch {
      toast.error("Failed to copy to clipboard")
    }
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
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">Failed to load products from the server.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  // No search error handling needed since search is frontend-only

  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Product Management</h1>
          <p className="text-sm sm:text-base text-slate-600">Manage your inventory and product catalog</p>
        </div>

        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>

      {/* Add Product Modal */}
      {isAddDialogOpen && (
        <Modal
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          title="Add New Product"
          size="xl"
        >
          <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Enter product name"
                  className="text-sm sm:text-base"
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Enter product description"
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Retail Price (GH₵) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="0.00"
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="cost-price">Cost Price (GH₵) *</Label>
                  <Input
                    id="cost-price"
                    type="number"
                    step="0.01"
                    value={newProduct.cost_price}
                    onChange={(e) => setNewProduct({ ...newProduct, cost_price: e.target.value })}
                    placeholder="0.00"
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity (kg) *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock_quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit-type">Unit Type *</Label>
                  <select
                    id="unit-type"
                    value={newProduct.unit_type}
                    onChange={(e) => setNewProduct({ ...newProduct, unit_type: e.target.value as 'bag' | 'loose' })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="loose">Per kg (Loose)</option>
                    <option value="bag">Per Bag</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="weight-per-bag">Weight per Bag (kg)</Label>
                  <Input
                    id="weight-per-bag"
                    type="number"
                    step="0.1"
                    value={newProduct.weight_per_bag || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, weight_per_bag: e.target.value ? parseFloat(e.target.value) : undefined })}
                    placeholder="50"
                    disabled={newProduct.unit_type !== 'bag'}
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    placeholder="e.g., Poultry Feed"
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={newProduct.manufacturer}
                    onChange={(e) => setNewProduct({ ...newProduct, manufacturer: e.target.value })}
                    placeholder="e.g., AgriFeeds Ghana"
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    value={newProduct.barcode}
                    onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                    placeholder="e.g., LM-050"
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="batch-number">Batch Number</Label>
                  <Input
                    id="batch-number"
                    value={newProduct.batch_number}
                    onChange={(e) => setNewProduct({ ...newProduct, batch_number: e.target.value })}
                    placeholder="e.g., BATCH-2025-001"
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="expiry-date">Expiry Date</Label>
                  <Input
                    id="expiry-date"
                    type="date"
                    value={newProduct.expiry_date}
                    onChange={(e) => setNewProduct({ ...newProduct, expiry_date: e.target.value })}
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reorder-level">Reorder Level</Label>
                  <Input
                    id="reorder-level"
                    type="number"
                    value={newProduct.reorder_level}
                    onChange={(e) => setNewProduct({ ...newProduct, reorder_level: parseInt(e.target.value) || 0 })}
                    placeholder="10"
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="supplier">Default Supplier</Label>
                  <Input
                    id="supplier"
                    value={newProduct.supplier}
                    onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                    placeholder="Supplier name"
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleAddProduct}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm sm:text-base py-2 sm:py-3"
                  disabled={createProduct.isPending}
                >
                  {createProduct.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Add Product"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    resetForm()
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
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm sm:text-base"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Products
            {isLoading || isSearching ? (
              <span className="text-sm font-normal text-gray-500 ml-2">Loading...</span>
            ) : (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredProducts?.length || 0} products)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">
                Loading products...
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Product Name</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">Category</TableHead>
                    <TableHead className="text-xs sm:text-sm">Unit</TableHead>
                    <TableHead className="text-xs sm:text-sm">Price</TableHead>
                    <TableHead className="text-xs sm:text-sm">Stock</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Expiry</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts?.map((product) => (
                    <ProductRow
                      key={product.product_id}
                      product={product}
                      onEdit={openEditDialog}
                      onDelete={handleDeleteProduct}
                      onSupplierDetails={openSupplierDetails}
                      deleteProduct={deleteProduct}
                      isAdmin={isAdmin}
                    />
                  ))}
                  {filteredProducts?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500 text-sm sm:text-base">
                        {searchTerm ? "No products found matching your search." : "No products available."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Information */}
      {filteredProducts && filteredProducts.length > 0 && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Total Products:</span>
                <span className="ml-2 text-gray-600">{filteredProducts.length}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Products with Suppliers:</span>
                <span className="ml-2 text-gray-600">
                  {filteredProducts.filter(p => p.suppliers && p.suppliers.length > 0).length}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Total Suppliers:</span>
                <span className="ml-2 text-gray-600">
                  {(() => {
                    const uniqueSuppliers = new Set()
                    filteredProducts.forEach(p => {
                      if (p.suppliers) {
                        p.suppliers.forEach(s => uniqueSuppliers.add(s.supplier_id))
                      }
                    })
                    return uniqueSuppliers.size
                  })()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Total Stock Value:</span>
                <span className="ml-2 text-gray-600">
                  GH₵{filteredProducts.reduce((sum, p) => sum + (parseFloat(p.price) * p.stock_quantity), 0).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Total Supply Value:</span>
                <span className="ml-2 text-gray-600">
                  GH₵{(() => {
                    const totalSupplyValue = filteredProducts.reduce((sum, p) => {
                      if (p.suppliers && p.suppliers.length > 0) {
                        const avgSupplyPrice = p.suppliers.reduce((s, supplier) => s + parseFloat(supplier.supply_price), 0) / p.suppliers.length
                        return sum + (avgSupplyPrice * p.stock_quantity)
                      }
                      return sum
                    }, 0)
                    return totalSupplyValue.toFixed(2)
                  })()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Low Stock Items:</span>
                <span className="ml-2 text-red-600">
                  {filteredProducts.filter(p => p.stock_quantity < 20).length}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Avg. Profit Margin:</span>
                <span className="ml-2 text-green-600">
                  {(() => {
                    const productsWithSuppliers = filteredProducts.filter(p => p.suppliers && p.suppliers.length > 0)
                    if (productsWithSuppliers.length === 0) return 'N/A'

                    const totalMargin = productsWithSuppliers.reduce((sum, p) => {
                      const retailPrice = parseFloat(p.price)
                      const avgSupplyPrice = p.suppliers!.reduce((s, supplier) => s + parseFloat(supplier.supply_price), 0) / p.suppliers!.length
                      return sum + ((retailPrice - avgSupplyPrice) / retailPrice * 100)
                    }, 0)

                    return `${(totalMargin / productsWithSuppliers.length).toFixed(1)}%`
                  })()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Total Potential Profit:</span>
                <span className="ml-2 text-green-600">
                  GH₵{(() => {
                    const totalProfit = filteredProducts.reduce((sum, p) => {
                      if (p.suppliers && p.suppliers.length > 0) {
                        const retailPrice = parseFloat(p.price)
                        const avgSupplyPrice = p.suppliers.reduce((s, supplier) => s + parseFloat(supplier.supply_price), 0) / p.suppliers.length
                        return sum + ((retailPrice - avgSupplyPrice) * p.stock_quantity)
                      }
                      return sum
                    }, 0)
                    return totalProfit.toFixed(2)
                  })()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Best Margin:</span>
                <span className="ml-2 text-green-600">
                  {(() => {
                    const productsWithSuppliers = filteredProducts.filter(p => p.suppliers && p.suppliers.length > 0)
                    if (productsWithSuppliers.length === 0) return 'N/A'

                    const margins = productsWithSuppliers.map(p => {
                      const retailPrice = parseFloat(p.price)
                      const avgSupplyPrice = p.suppliers!.reduce((s, supplier) => s + parseFloat(supplier.supply_price), 0) / p.suppliers!.length
                      return ((retailPrice - avgSupplyPrice) / retailPrice * 100)
                    })

                    return `${Math.max(...margins).toFixed(1)}%`
                  })()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Worst Margin:</span>
                <span className="ml-2 text-red-600">
                  {(() => {
                    const productsWithSuppliers = filteredProducts.filter(p => p.suppliers && p.suppliers.length > 0)
                    if (productsWithSuppliers.length === 0) return 'N/A'

                    const margins = productsWithSuppliers.map(p => {
                      const retailPrice = parseFloat(p.price)
                      const avgSupplyPrice = p.suppliers!.reduce((s, supplier) => s + parseFloat(supplier.supply_price), 0) / p.suppliers!.length
                      return ((retailPrice - avgSupplyPrice) / retailPrice * 100)
                    })

                    return `${Math.min(...margins).toFixed(1)}%`
                  })()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Product Modal */}
      {isEditDialogOpen && (
        <Modal
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          title="Edit Product"
          size="xl"
        >
          {editingProduct && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Product Name *</Label>
                <Input
                  id="edit-name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description *</Label>
                <Input
                  id="edit-description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Enter product description"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-price">Retail Price (GH₵) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-cost-price">Cost Price (GH₵) *</Label>
                  <Input
                    id="edit-cost-price"
                    type="number"
                    step="0.01"
                    value={editingProduct.cost_price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, cost_price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-stock">Stock Quantity (kg) *</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editingProduct.stock_quantity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-unit-type">Unit Type *</Label>
                  <select
                    id="edit-unit-type"
                    value={editingProduct.unit_type}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unit_type: e.target.value as 'bag' | 'loose' })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="loose">Per kg (Loose)</option>
                    <option value="bag">Per Bag</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="edit-weight-per-bag">Weight per Bag (kg)</Label>
                  <Input
                    id="edit-weight-per-bag"
                    type="number"
                    step="0.1"
                    value={editingProduct.weight_per_bag || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, weight_per_bag: e.target.value ? parseFloat(e.target.value) : undefined })}
                    placeholder="50"
                    disabled={editingProduct.unit_type !== 'bag'}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Input
                    id="edit-category"
                    value={editingProduct.category || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    placeholder="e.g., Poultry Feed"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-manufacturer">Manufacturer</Label>
                  <Input
                    id="edit-manufacturer"
                    value={editingProduct.manufacturer || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, manufacturer: e.target.value })}
                    placeholder="e.g., AgriFeeds Ghana"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-barcode">Barcode</Label>
                  <Input
                    id="edit-barcode"
                    value={editingProduct.barcode || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, barcode: e.target.value })}
                    placeholder="e.g., LM-050"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-batch-number">Batch Number</Label>
                  <Input
                    id="edit-batch-number"
                    value={editingProduct.batch_number || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, batch_number: e.target.value })}
                    placeholder="e.g., BATCH-2025-001"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-expiry-date">Expiry Date</Label>
                  <Input
                    id="edit-expiry-date"
                    type="date"
                    value={editingProduct.expiry_date || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, expiry_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-reorder-level">Reorder Level</Label>
                  <Input
                    id="edit-reorder-level"
                    type="number"
                    value={editingProduct.reorder_level || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, reorder_level: parseInt(e.target.value) || 0 })}
                    placeholder="10"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-supplier">Default Supplier</Label>
                  <Input
                    id="edit-supplier"
                    value={editingProduct.supplier || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, supplier: e.target.value })}
                    placeholder="Supplier name"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleEditProduct}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={updateProduct.isPending}
                >
                  {updateProduct.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Product"
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

      {/* Supplier Details Modal */}
      {isSupplierDetailsOpen && (
        <Modal
          isOpen={isSupplierDetailsOpen}
          onClose={() => setIsSupplierDetailsOpen(false)}
          title={`Supplier Details - ${selectedProduct?.name}`}
          size="xl"
        >
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Product Name</Label>
                  <p className="text-sm text-gray-900">{selectedProduct.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Current Stock</Label>
                  <p className="text-sm text-gray-900">{selectedProduct.stock_quantity} units</p>
                </div>
              </div>

              {selectedProduct.suppliers && selectedProduct.suppliers.length > 0 ? (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Suppliers</Label>
                  <div className="space-y-3">
                    {selectedProduct.suppliers.map((supplier) => (
                      <div key={supplier.supplier_id} className="p-3 border rounded-lg bg-gray-50">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Supplier Name:</span>
                            <p className="text-sm text-gray-900">{supplier.name}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Supply Price:</span>
                            <p className="text-sm text-gray-900">GH₵{supplier.supply_price}</p>
                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">Contact Info:</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => copyToClipboard(supplier.contact_info)}
                                title="Copy contact information"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-900 break-all">{supplier.contact_info}</p>
                          </div>
                          <div className="col-span-2">
                            <span className="text-sm font-medium text-gray-700">Profit Margin:</span>
                            <p className="text-sm text-green-600 font-medium">
                              {(() => {
                                const retailPrice = parseFloat(selectedProduct.price)
                                const supplyPrice = parseFloat(supplier.supply_price)
                                return `${((retailPrice - supplyPrice) / retailPrice * 100).toFixed(1)}%`
                              })()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Truck className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No suppliers assigned to this product</p>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsSupplierDetailsOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}

// Separate component for product row
function ProductRow({
  product,
  onEdit,
  onDelete,
  onSupplierDetails: _onSupplierDetails,
  deleteProduct,
  isAdmin
}: {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
  onSupplierDetails: (product: Product) => void
  deleteProduct: ReturnType<typeof useDeleteProduct>
  isAdmin: boolean
}) {
  const getExpiryStatus = (expiryDate: string) => {
    const daysUntilExpiry = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (daysUntilExpiry < 0) return { status: 'expired', color: 'bg-red-100 text-red-800 border-red-300' }
    if (daysUntilExpiry <= 30) return { status: 'expiring', color: 'bg-orange-100 text-orange-800 border-orange-300' }
    return { status: 'ok', color: 'bg-green-100 text-green-800 border-green-300' }
  }

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <Package className="h-4 w-4 text-green-600" />
          <span className="text-sm">{product.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-gray-600 hidden md:table-cell">
        {product.category && <Badge variant="outline" className="text-xs">{product.category}</Badge>}
      </TableCell>
      <TableCell>
        <Badge variant={product.unit_type === 'bag' ? 'default' : 'secondary'} className="text-xs">
          {product.unit_type === 'bag' ? `${product.weight_per_bag || 50}kg bag` : 'Per kg'}
        </Badge>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-semibold text-sm">GH₵{parseFloat(product.price).toFixed(2)}</p>
          {isAdmin && (
            <p className="text-xs text-gray-500">Cost: GH₵{parseFloat(product.cost_price).toFixed(2)}</p>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span className={`font-medium text-sm ${product.stock_quantity <= (product.reorder_level || 10) ? "text-red-600" : "text-green-600"
          }`}>
          {product.stock_quantity} {product.unit_type === 'bag' ? 'bags' : 'kg'}
        </span>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        {product.expiry_date && (
          <Badge variant="outline" className={`text-xs ${getExpiryStatus(product.expiry_date).color}`}>
            {new Date(product.expiry_date).toLocaleDateString()}
          </Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onEdit(product)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            onClick={() => onDelete(product.product_id)}
            disabled={deleteProduct.isPending}
          >
            {deleteProduct.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
