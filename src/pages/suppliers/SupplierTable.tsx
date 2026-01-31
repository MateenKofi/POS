import { Button, TextInput, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/custom-components"
import { Search, Edit, Trash2, Loader2 } from "lucide-react"
import type { Supplier } from "@/lib/api"
import { Modal } from "@/components/modal"

interface SupplierTableProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

interface SupplierTableWithAddProps {
  filteredSuppliers: Supplier[]
  isLoading: boolean
  searchTerm: string
  onSearchChange: (value: string) => void
  onEdit: (supplier: Supplier) => void
  onDelete: (id: number) => void
  isAddDialogOpen: boolean
  onAddDialogOpen: () => void
  addDialogContent: React.ReactNode
}

export function SupplierTable({ searchTerm, onSearchChange }: SupplierTableProps) {
  return (
    <>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <TextInput
            placeholder="Search suppliers by name or contact info..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 text-sm sm:text-base"
          />
        </div>
      </div>
    </>
  )
}

export function SupplierTableWithAdd({
  filteredSuppliers,
  isLoading,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  isAddDialogOpen,
  onAddDialogOpen,
  addDialogContent
}: SupplierTableWithAddProps) {
  return (
    <>
      <SupplierTable searchTerm={searchTerm} onSearchChange={onSearchChange} />

      <Modal
        isOpen={isAddDialogOpen}
        onClose={() => onAddDialogOpen()}
        title="Add New Supplier"
        size="md"
      >
        {addDialogContent}
      </Modal>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">Name</TableHead>
              <TableHead className="text-xs sm:text-sm">Contact Information</TableHead>
              <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-green-600 mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredSuppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500 text-sm sm:text-base">
                  {searchTerm ? "No suppliers found matching your search." : "No suppliers available."}
                </TableCell>
              </TableRow>
            ) : (
              filteredSuppliers.map((supplier: Supplier) => (
                <TableRow key={supplier.supplier_id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell className="text-sm text-slate-600">{supplier.contact_info}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
