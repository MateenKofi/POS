import { Modal } from "@/components/modal"
import { Package } from "lucide-react"
import { type Product as ApiProduct } from "@/lib/api"
import { UnitSelectorContent } from "./UnitSelectorContent"

interface UnitSelectorModalProps {
  isOpen: boolean
  product: ApiProduct | null
  onClose: () => void
  onConfirm: (product: ApiProduct, unit: 'bag' | 'kg', quantity: number) => void
}

export function UnitSelectorModal({ isOpen, product, onClose, onConfirm }: UnitSelectorModalProps) {
  if (!product) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<span className="flex items-center gap-2"><Package className="h-5 w-5 text-green-500" />Select Unit & Quantity</span>}
      size="md"
    >
      <div className="space-y-5">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/25">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-lg">{product.name}</h3>
              <p className="text-sm text-slate-600 mt-1">{product.description}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm">
                <div>
                  <span className="text-slate-500">Available Stock:</span>
                  <span className="font-semibold text-slate-800 ml-1">{product.stock_quantity} kg</span>
                </div>
                <div>
                  <span className="text-slate-500">Price:</span>
                  <span className="font-semibold text-slate-800 ml-1">
                    GH₵{parseFloat(product.price).toFixed(2)}
                    {product.unit_type === 'bag' && product.weight_per_bag
                      ? ` per ${product.weight_per_bag}kg bag`
                      : ' per kg'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <UnitSelectorContent
          product={product}
          onConfirm={(unit, quantity) => onConfirm(product, unit, quantity)}
          onCancel={onClose}
        />
      </div>
    </Modal>
  )
}
