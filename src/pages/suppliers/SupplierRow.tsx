import { useState } from "react"
import { Button, TableCell, TableRow } from "@/components/custom-components"
import { Edit, Trash2, Package, Building2, Mail } from "lucide-react"
import type { Supplier } from "@/lib/api"
import { SupplierProductsModal } from "./SupplierProductsModal"

interface SupplierRowProps {
  supplier: Supplier
  onEdit: (supplier: Supplier) => void
  onDelete: (id: number) => void
}

export const SupplierRow = ({ supplier, onEdit, onDelete }: SupplierRowProps) => {
  const [isViewProductsOpen, setIsViewProductsOpen] = useState(false)

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-green-600" />
            {supplier.name}
          </div>
        </TableCell>
        <TableCell className="hidden sm:table-cell">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">{supplier.contact_info}</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-green-600" />
            <span className="text-slate-600">View Products</span>
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

      <SupplierProductsModal
        isOpen={isViewProductsOpen}
        onClose={() => setIsViewProductsOpen(false)}
        supplier={supplier}
      />
    </>
  )
}
