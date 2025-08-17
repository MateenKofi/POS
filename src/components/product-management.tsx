"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Loader2, Package, Truck, Info, Copy } from "lucide-react"
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useSearchProducts } from "@/hooks/useApi"
import type { Product, CreateProductRequest } from "@/lib/api"
import { toast } from "sonner"

export function ProductManagement() {
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
    stock_quantity: 0,
  })

  // API hooks
  const { data: products, isLoading, error } = useProducts()
  const searchQuery = useSearchProducts(searchTerm)
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  // Use search results if search term exists and is long enough, otherwise use all products
  const displayProducts = searchTerm && searchTerm.length > 2 ? searchQuery.data : products
  const isSearching = searchTerm && searchTerm.length > 2 && searchQuery.isLoading

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      await createProduct.mutateAsync(newProduct)
      toast.success("Product created successfully!")
      setNewProduct({ name: "", description: "", price: "", stock_quantity: 0 })
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
    } catch (err) {
      toast.error("Failed to copy to clipboard")
    }
  }

  const resetForm = () => {
    setNewProduct({ name: "", description: "", price: "", stock_quantity: 0 })
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

  // Show search error if it exists
  if (searchTerm && searchTerm.length > 2 && searchQuery.error) {
    toast.error("Search failed. Please try again.")
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Product Management</h1>
          <p className="text-slate-600">Manage your inventory and product catalog</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Enter product description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (GH₵) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock_quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddProduct} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
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
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Products 
            {isLoading || isSearching ? (
              <span className="text-sm font-normal text-gray-500 ml-2">Loading...</span>
            ) : (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({displayProducts?.length || 0} products)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || isSearching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">
                {isSearching ? "Searching products..." : "Loading products..."}
              </span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Suppliers</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayProducts?.map((product) => (
                  <ProductRow 
                    key={product.product_id} 
                    product={product} 
                    onEdit={openEditDialog} 
                    onDelete={handleDeleteProduct} 
                    onSupplierDetails={openSupplierDetails}
                    deleteProduct={deleteProduct} 
                  />
                ))}
                {displayProducts?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {searchTerm ? "No products found matching your search." : "No products available."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
          )}
        </CardContent>
      </Card>
      
      {/* Summary Information */}
      {displayProducts && displayProducts.length > 0 && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Total Products:</span>
                <span className="ml-2 text-gray-600">{displayProducts.length}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Products with Suppliers:</span>
                <span className="ml-2 text-gray-600">
                  {displayProducts.filter(p => p.suppliers && p.suppliers.length > 0).length}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Total Suppliers:</span>
                <span className="ml-2 text-gray-600">
                  {(() => {
                    const uniqueSuppliers = new Set()
                    displayProducts.forEach(p => {
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
                  GH₵{displayProducts.reduce((sum, p) => sum + (parseFloat(p.price) * p.stock_quantity), 0).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Total Supply Value:</span>
                <span className="ml-2 text-gray-600">
                  GH₵{(() => {
                    const totalSupplyValue = displayProducts.reduce((sum, p) => {
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
                  {displayProducts.filter(p => p.stock_quantity < 20).length}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Avg. Profit Margin:</span>
                <span className="ml-2 text-green-600">
                  {(() => {
                    const productsWithSuppliers = displayProducts.filter(p => p.suppliers && p.suppliers.length > 0)
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
                    const totalProfit = displayProducts.reduce((sum, p) => {
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
                    const productsWithSuppliers = displayProducts.filter(p => p.suppliers && p.suppliers.length > 0)
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
                    const productsWithSuppliers = displayProducts.filter(p => p.suppliers && p.suppliers.length > 0)
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

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Price (GH₵) *</Label>
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
                  <Label htmlFor="edit-stock">Stock Quantity</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editingProduct.stock_quantity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: parseInt(e.target.value) || 0 })}
                    placeholder="0"
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
        </DialogContent>
      </Dialog>

      {/* Supplier Details Dialog */}
      <Dialog open={isSupplierDetailsOpen} onOpenChange={setIsSupplierDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Supplier Details - {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Separate component for product row
function ProductRow({ 
  product, 
  onEdit, 
  onDelete,
  onSupplierDetails,
  deleteProduct
}: { 
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
  onSupplierDetails: (product: Product) => void
  deleteProduct: any
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-green-600" />
          {product.name}
        </div>
      </TableCell>
      <TableCell className="text-gray-600 max-w-xs truncate">
        {product.description}
      </TableCell>
      <TableCell className="font-semibold">GH₵{parseFloat(product.price).toFixed(2)}</TableCell>
      <TableCell>
        <span className={`font-medium ${product.stock_quantity < 20 ? "text-red-600" : "text-green-600"}`}>
          {product.stock_quantity} units
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-blue-600" />
          <div className="text-slate-600">
            {product.suppliers && product.suppliers.length > 0 ? (
              <div className="space-y-1">
                {product.suppliers.map((supplier, index) => {
                  const retailPrice = parseFloat(product.price)
                  const supplyPrice = parseFloat(supplier.supply_price)
                  const profitMargin = ((retailPrice - supplyPrice) / retailPrice * 100).toFixed(1)
                  
                  return (
                    <div key={supplier.supplier_id} className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {supplier.name}
                      </Badge>
                                          <span className="text-xs text-gray-500">
                      GH₵{supplier.supply_price}
                    </span>
                      <Badge variant="secondary" className="text-xs">
                        {profitMargin}% margin
                      </Badge>
                      <span 
                        className="text-xs text-gray-400 cursor-pointer hover:text-blue-600" 
                        title={supplier.contact_info}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSupplierDetails(product)
                        }}
                      >
                        <Info className="h-3 w-3" />
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <span className="text-gray-500 text-sm">No suppliers</span>
            )}
          </div>
        </div>
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
