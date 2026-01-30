"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button, TextInput } from "@/components/custom-components"
import { Plus, Loader2 } from "lucide-react"
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier } from "@/hooks/useApi"
import type { Supplier, CreateSupplierRequest } from "@/lib/api"
import { toast } from "sonner"

// Supplier management sub-components
import { SupplierForm } from "./supplier-management/SupplierForm"
import { SupplierRow } from "./supplier-management/SupplierRow"

const defaultNewSupplier: CreateSupplierRequest = {
  name: "",
  contact_info: "",
}

export function SupplierManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [newSupplier, setNewSupplier] = useState<CreateSupplierRequest>(defaultNewSupplier)

  // API hooks
  const { data: suppliers, isLoading, error } = useSuppliers()
  const createSupplier = useCreateSupplier()
  const updateSupplier = useUpdateSupplier()
  const deleteSupplier = useDeleteSupplier()

  // Frontend search implementation - filter suppliers locally
  const filteredSuppliers = suppliers?.filter((supplier: Supplier) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      supplier.name.toLowerCase().includes(searchLower) ||
      supplier.contact_info.toLowerCase().includes(searchLower) ||
      supplier.supplier_id.toString().includes(searchTerm)
    )
  }) || []

  const handleAddSupplier = async () => {
    if (!newSupplier.name || !newSupplier.contact_info) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      await createSupplier.mutateAsync(newSupplier)
      toast.success("Supplier created successfully!")
      setNewSupplier(defaultNewSupplier)
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
    setNewSupplier(defaultNewSupplier)
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

  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Supplier Management</h1>
          <p className="text-sm sm:text-base text-slate-600">Manage your supplier relationships and contacts</p>
        </div>

        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white gap-2 w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
        >
          <Plus className="h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <TextInput
            placeholder="Search suppliers by name or contact info..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Suppliers
            {isLoading ? (
              <span className="text-sm font-normal text-gray-500 ml-2">Loading...</span>
            ) : (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredSuppliers?.length || 0} suppliers)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">Loading suppliers...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Supplier Name</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Contact Info</TableHead>
                    <TableHead className="text-xs sm:text-sm">Products</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers?.map((supplier) => (
                    <SupplierRow
                      key={supplier.supplier_id}
                      supplier={supplier}
                      onEdit={openEditDialog}
                      onDelete={handleDeleteSupplier}
                    />
                  ))}
                  {filteredSuppliers?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500 text-sm sm:text-base">
                        {searchTerm ? "No suppliers found matching your search." : "No suppliers available."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Supplier Modal */}
      {isAddDialogOpen && (
        <Modal
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          title="Add New Supplier"
          size="md"
        >
          <SupplierForm
            data={newSupplier}
            isPending={createSupplier.isPending}
            onChange={setNewSupplier}
            onSubmit={handleAddSupplier}
            onCancel={() => {
              setIsAddDialogOpen(false)
              resetForm()
            }}
          />
        </Modal>
      )}

      {/* Edit Supplier Modal */}
      {isEditDialogOpen && editingSupplier && (
        <Modal
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          title="Edit Supplier"
          size="md"
        >
          <SupplierForm
            isEdit
            data={editingSupplier}
            isPending={updateSupplier.isPending}
            onChange={setEditingSupplier}
            onSubmit={handleEditSupplier}
            onCancel={() => {
              setIsEditDialogOpen(false)
              resetForm()
            }}
          />
        </Modal>
      )}
    </div>
  )
}
