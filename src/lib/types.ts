// ============================================================================
// CENTRALIZED TYPE DEFINITIONS FOR POS SYSTEM
// All types should be defined here and exported for use across the application
// ============================================================================

import type { ComponentType, ReactNode } from 'react'

// ============================================================================
// API TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export interface Product {
  product_id: number
  name: string
  description: string
  price: string  // Retail price per kg or per bag
  cost_price: string  // Cost price for profit tracking
  stock_quantity: number  // Total quantity in kg
  unit_type: 'bag' | 'loose'  // Whether sold by bag or loose kg
  weight_per_bag?: number  // Weight in kg per bag
  category?: string
  barcode?: string
  supplier?: string
  suppliers?: SupplierInfo[]
  expiry_date?: string  // ISO date string for feed expiration
  batch_number?: string  // Batch tracking for quality control
  manufacturer?: string  // Feed manufacturer
  reorder_level?: number  // Alert threshold for reordering
}

export interface SupplierInfo {
  supplier_id: number
  name: string
  contact_info: string
  supply_price: string
}

export interface CreateProductRequest {
  name: string
  description: string
  price: string
  cost_price: string
  stock_quantity: number
  unit_type: 'bag' | 'loose'
  weight_per_bag?: number
  category?: string
  barcode?: string
  supplier?: string
  expiry_date?: string
  batch_number?: string
  manufacturer?: string
  reorder_level?: number
}

export type UpdateProductRequest = Partial<CreateProductRequest>

export type ProductTab = 'all' | 'expiring' | 'expired'

// ============================================================================
// SALES TYPES
// ============================================================================

export interface SaleItem {
  product_id: number
  quantity: number
  unit: 'bag' | 'kg'  // Whether sold as bags or kg
  price_at_sale: number
  cost_price_at_sale: number  // For profit calculation
  discount_amount?: number  // Per-item discount
  batch_number?: string  // Track which batch was sold
  expiry_date?: string  // Expiry of sold items
}

export interface CreateSaleRequest {
  payment_method_id: number
  items: SaleItem[]
}

export interface Sale {
  sale_id: number
  sale_date: string
  cashier_id: number  // Renamed from salesperson_id
  payment_method_id: number
  total_amount: string
  subtotal: string  // Before discounts
  total_discount: string  // Total discount applied
  items: SaleItem[]
  first_name?: string
  last_name?: string
  method_name?: string
  customer_phone?: string  // For SMS receipts
  profit_amount: string  // Total profit from this sale
  receipt_generated: boolean  // Whether receipt was printed/sent
}

export interface PaymentMethod {
  payment_method_id: number
  name: string
  description?: string
}

// ============================================================================
// USER / STAFF TYPES
// ============================================================================

export type StaffRole = 'cashier' | 'manager' | 'admin'

export interface User {
  salesperson_id: number
  first_name: string
  last_name: string
  email: string
  username: string
  role: StaffRole
  contact_info: string
  status?: 'active' | 'inactive'
  hire_date?: string
  hourly_rate?: number
  hours_worked?: number
}

export interface Staff {
  salesperson_id: number
  first_name: string
  last_name: string
  email: string
  username: string
  contact_info: string
  role: StaffRole
  status?: 'active' | 'inactive'
  hire_date?: string
  hourly_rate?: number
  hours_worked?: number
}

export interface CreateStaffRequest {
  first_name: string
  last_name: string
  email: string
  username: string
  password: string
  contact_info: string
  role: StaffRole
  hourly_rate: number
}

export interface UpdateStaffRequest extends Partial<CreateStaffRequest> {
  status?: 'active' | 'inactive'
  hire_date?: string
  hours_worked?: number
}

export interface UpdateStaffPasswordRequest {
  current_password: string
  new_password: string
}

export interface UpdateStaffRoleRequest {
  role: StaffRole
}

export interface PasswordData {
  current_password: string
  new_password: string
}

export interface StaffPerformanceReport {
  cashier_id: number
  cashier_name: string
  total_sales: number
  total_transactions: number
  average_transaction: number
  total_profit: number
  period: string
}

// ============================================================================
// SUPPLIER TYPES
// ============================================================================

export interface Supplier {
  supplier_id: number
  name: string
  contact_info: string
}

export interface CreateSupplierRequest {
  name: string
  contact_info: string
}

export type UpdateSupplierRequest = Partial<CreateSupplierRequest>

export interface SupplierProduct {
  supplier_product_id: number
  supplier_id: number
  product_id: number
  supply_price: string
}

export interface CreateSupplierProductRequest {
  supplier_id: number
  product_id: number
  supply_price: string
}

export type UpdateSupplierProductRequest = Partial<CreateSupplierProductRequest>

export interface SupplierProductWithDetails extends SupplierProduct {
  supplier_name: string
  product_name: string
  product_description: string
  retail_price: string
  stock_quantity: number
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export interface DashboardStats {
  overview: {
    todayRevenue: number
    totalProducts: number
    todaySales: number
  }
  topProducts: Array<{
    product_id: number
    name: string
    total_sold: number
    total_revenue: number
  }>
}

export interface DashboardStat {
  title: string
  value: string
  icon: ComponentType<{ className?: string }>
  change: string
  changeType: "positive" | "negative"
}

export interface QuickAction {
  action: string
  label: string
}

export interface InventoryReport {
  lowStockProducts: Product[]
}

// ============================================================================
// STOCK MOVEMENT TYPES
// ============================================================================

export type StockMovementType = 'sale' | 'purchase' | 'adjustment' | 'return' | 'expiry'

export interface StockMovement {
  movement_id: number
  product_id: number
  movement_type: StockMovementType
  quantity: number  // Positive for additions, negative for deductions
  unit: 'bag' | 'kg'
  reference_id?: number  // Sale ID or Purchase ID
  reference_type?: 'sale' | 'purchase' | 'manual'
  batch_number?: string
  expiry_date?: string
  notes?: string
  created_by: number  // User ID
  created_at: string
}

// ============================================================================
// DAILY CLOSURE TYPES
// ============================================================================

export type DailyClosureStatus = 'open' | 'closed'

export interface DailyClosure {
  closure_id: number
  date: string
  cashier_id: number
  opening_balance: number
  total_sales: number
  total_cash: number
  total_mobile_money: number
  total_bank_transfer: number
  expected_total: number
  actual_total: number
  variance: number
  transactions_count: number
  status: DailyClosureStatus
  closed_at?: string
  notes?: string
}

// ============================================================================
// REPORT TYPES
// ============================================================================

export interface ProfitReport {
  period: string
  total_revenue: number
  total_cost: number
  gross_profit: number
  profit_margin: number
  top_products: Array<{
    product_id: number
    name: string
    profit: number
    margin: number
  }>
}

export type ExpiryStatus = 'expired' | 'expiring_soon' | 'ok'

export interface ExpiryReport {
  product_id: number
  name: string
  batch_number: string
  expiry_date: string
  quantity: number
  days_until_expiry: number
  status: ExpiryStatus
}

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

export type TransactionType = 'sale_payment' | 'refund' | 'expense' | 'supplier_payment' | 'cash_deposit' | 'cash_withdrawal'

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'

export type PaymentMethodType = 'cash' | 'mobile_money' | 'bank_transfer' | 'card'

export type RelatedEntityType = 'sale' | 'supplier' | 'expense' | null

export interface Transaction {
  transaction_id: number
  transaction_date: string
  transaction_type: TransactionType
  status: TransactionStatus
  amount: string  // Transaction amount
  payment_method: PaymentMethodType
  reference_number?: string  // External reference (receipt number, check number, etc.)
  description: string  // Description of the transaction
  category?: string  // For expense categorization (e.g., 'utilities', 'rent', 'transport')
  related_entity_id?: number  // Optional: sale_id, supplier_id, etc.
  related_entity_type?: RelatedEntityType
  cashier_id: number  // User who processed the transaction
  cashier_name?: string  // Denormalized for display
  notes?: string
  created_at: string
}

export interface CreateTransactionRequest {
  transaction_type: TransactionType
  amount: string
  payment_method: PaymentMethodType
  reference_number?: string
  description: string
  category?: string
  related_entity_id?: number
  related_entity_type?: Exclude<RelatedEntityType, null>
  notes?: string
}

export interface UpdateTransactionRequest extends Partial<CreateTransactionRequest> {
  status?: TransactionStatus
}

// ============================================================================
// SALES INTERFACE / CART TYPES
// ============================================================================

export interface CartItem extends Product {
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
  product: Product | null
  isOpen: boolean
}

// ============================================================================
// AUTH CONTEXT TYPES
// ============================================================================

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

export interface AuthProviderProps {
  children: ReactNode
}

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: ModalSize
  showCloseButton?: boolean
  className?: string
}

// ============================================================================
// DATA TRANSFER TYPES
// ============================================================================

export interface SaleData {
  sale_id: number
  total_amount: string
  payment_method_id: number
  method_name?: string
  first_name?: string
  last_name?: string
  cashier_id: number
  sale_date: string
  items?: Array<unknown>
  profit_amount?: string
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

// ============================================================================
// Note: All types are exported as named exports above.
// Import them like: import type { Product, Sale, User } from '@/lib/types'
// ============================================================================
