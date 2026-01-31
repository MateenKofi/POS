import { type Product as ApiProduct } from "@/lib/api"

export interface CartItem extends ApiProduct {
  quantity: number
  unit: 'bag' | 'kg'
  discount?: number
}

export interface PaymentDetails {
  method: number // PaymentMethodId
  amount: number
  change: number
  reference?: string
}

export interface CompletedSale {
  id: number
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  totalDiscount: number
  paymentMethod: string
  amountPaid: number
  change: number
  reference?: string
  customerPhone?: string
  timestamp: string
  status: string
  apiResponse: unknown
}

export interface UnitSelectorState {
  product: ApiProduct | null
  isOpen: boolean
}
