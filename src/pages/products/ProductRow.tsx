import { Button, TableCell, TableRow } from "@/components/custom-components"
import { Package, Edit, Trash2, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/api"

interface ProductRowProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
  deleteProduct: { mutate: (id: string, options?: any) => void; isPending: boolean }
  isAdmin: boolean
}

export const ProductRow = ({ product, onEdit, onDelete, deleteProduct, isAdmin }: ProductRowProps) => {
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
        <span className={`font-medium text-sm ${product.stock_quantity <= (product.reorder_level || 10) ? "text-red-600" : "text-green-600"}`}>
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
