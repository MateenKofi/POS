// API utilities using native fetch
import {
  mockUser,
  mockProducts,
  mockSuppliers,
  mockStaff,
  mockSales,
  mockSupplierProducts,
  paginate,
  computeDashboardStats,
  computeInventoryReport,
  createProduct,
  updateProduct,
  deleteProduct,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  createStaff,
  updateStaff,
  deleteStaff,
  toggleStaffStatus,
  createSale,
  upsertSupplierProduct,
  removeSupplierProduct,
} from './mock-data'

const API_BASE_URL = 'http://localhost:3007/api'
const USE_MOCKS = String((import.meta as any)?.env?.VITE_USE_MOCKS ?? 'true') === 'true'

async function mockApiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method || 'GET').toUpperCase()
  const url = new URL(endpoint, 'http://mock.local')
  const path = url.pathname
  const search = url.searchParams
  const parseBody = <B = any>(): B => {
    try {
      return options.body ? JSON.parse(options.body as string) : ({} as any)
    } catch {
      return {} as any
    }
  }
  const ok = <D>(data: D) => ({ success: true, data } as unknown as T)

  // Auth
  if (path === '/auth/login' && method === 'POST') {
    return ok({ user: mockUser, token: 'mock-token' })
  }
  if (path === '/auth/profile' && method === 'GET') {
    return ok(mockUser)
  }

  // Products
  if (path === '/products' && method === 'GET') {
    const page = Number(search.get('page') || '1')
    const limit = Number(search.get('limit') || '1000')
    const { data } = paginate(mockProducts, page, limit)
    return ok(data)
  }
  if (path === '/products' && method === 'POST') {
    const body = parseBody<any>()
    const created = createProduct(body)
    return ok(created)
  }
  if (path.startsWith('/products/') && method === 'GET') {
    const id = Number(path.split('/')[2])
    const product = mockProducts.find(p => p.product_id === id)
    return ok(product!)
  }
  if (path.startsWith('/products/') && method === 'PUT') {
    const id = Number(path.split('/')[2])
    const body = parseBody<any>()
    const updated = updateProduct(id, body)
    return ok(updated!)
  }
  if (path.startsWith('/products/') && method === 'DELETE') {
    const id = Number(path.split('/')[2])
    deleteProduct(id)
    return ok(undefined)
  }

  // Sales
  if (path === '/sales' && method === 'GET') {
    const page = Number(search.get('page') || '1')
    const limit = Number(search.get('limit') || '10')
    const { data, pagination } = paginate(mockSales, page, limit)
    return ok({ sales: data, pagination })
  }
  if (path === '/sales' && method === 'POST') {
    const body = parseBody<any>()
    const sale = createSale(body)
    return ok({ sale, items: sale.items })
  }
  if (path.startsWith('/sales/date-range') && method === 'GET') {
    const start = new Date(search.get('start_date') || '1970-01-01')
    const end = new Date(search.get('end_date') || new Date().toISOString())
    const filtered = mockSales.filter(s => {
      const d = new Date(s.sale_date)
      return d >= start && d <= end
    })
    return ok(filtered)
  }
  if (path.startsWith('/sales/') && method === 'GET') {
    const id = Number(path.split('/')[2])
    const sale = mockSales.find(s => s.sale_id === id)
    return ok(sale!)
  }

  // Staff (salespersons)
  if (path === '/salespersons' && method === 'GET') {
    const page = Number(search.get('page') || '1')
    const limit = Number(search.get('limit') || '10')
    const { data, pagination } = paginate(mockStaff, page, limit)
    return ok({ salespersons: data, pagination })
  }
  if (path === '/salespersons' && method === 'POST') {
    const body = parseBody<any>()
    const created = createStaff(body)
    return ok(created)
  }
  if (path.startsWith('/salespersons/') && method === 'GET') {
    const id = Number(path.split('/')[2])
    const staff = mockStaff.find(s => s.salesperson_id === id)
    return ok(staff!)
  }
  if (path.startsWith('/salespersons/') && method === 'PUT') {
    const id = Number(path.split('/')[2])
    const body = parseBody<any>()
    const updated = updateStaff(id, body)
    return ok(updated!)
  }
  if (path.startsWith('/salespersons/') && method === 'DELETE') {
    const id = Number(path.split('/')[2])
    deleteStaff(id)
    return ok(undefined)
  }
  if (path.endsWith('/toggle-status') && method === 'PATCH') {
    const id = Number(path.split('/')[2])
    const updated = toggleStaffStatus(id)
    return ok(updated!)
  }
  if (path.endsWith('/role') && method === 'PATCH') {
    const id = Number(path.split('/')[2])
    const body = parseBody<any>()
    const updated = updateStaff(id, { role: body.role })
    return ok(updated!)
  }
  if (path.endsWith('/password') && method === 'PATCH') {
    return ok(undefined)
  }

  // Suppliers
  if (path === '/suppliers' && method === 'GET') {
    const page = Number(search.get('page') || '1')
    const limit = Number(search.get('limit') || '1000')
    const { data } = paginate(mockSuppliers, page, limit)
    return ok(data)
  }
  if (path === '/suppliers' && method === 'POST') {
    const body = parseBody<any>()
    const created = createSupplier(body)
    return ok(created)
  }
  if (path.startsWith('/suppliers/') && !path.endsWith('/products') && method === 'GET') {
    const id = Number(path.split('/')[2])
    const supplier = mockSuppliers.find(s => s.supplier_id === id)
    return ok(supplier!)
  }
  if (path.startsWith('/suppliers/') && !path.endsWith('/products') && method === 'PUT') {
    const id = Number(path.split('/')[2])
    const body = parseBody<any>()
    const updated = updateSupplier(id, body)
    return ok(updated!)
  }
  if (path.startsWith('/suppliers/') && !path.endsWith('/products') && method === 'DELETE') {
    const id = Number(path.split('/')[2])
    deleteSupplier(id)
    return ok(undefined)
  }
  // Supplier nested products (GET list)
  if (path.match(/^\/suppliers\/(\d+)\/products$/) && method === 'GET') {
    const supplierId = Number(path.split('/')[2])
    const supplier = mockSuppliers.find(s => s.supplier_id === supplierId)!
    const products = mockSupplierProducts
      .filter(sp => sp.supplier_id === supplierId)
      .map(sp => {
        const prod = mockProducts.find(p => p.product_id === sp.product_id)!
        const total_supply_value = (parseFloat(sp.supply_price) * prod.stock_quantity).toFixed(2)
        return {
          product_id: prod.product_id,
          name: prod.name,
          description: prod.description,
          retail_price: prod.price,
          stock_quantity: prod.stock_quantity,
          supply_price: sp.supply_price,
          total_supply_value,
        }
      })
    return ok({ supplier, products, pagination: { page: 1, limit: products.length, total: products.length, pages: 1 } })
  }
  // Supplier nested products (POST add)
  if (path.match(/^\/suppliers\/(\d+)\/products$/) && method === 'POST') {
    const supplierId = Number(path.split('/')[2])
    const body = parseBody<any>()
    const added = upsertSupplierProduct(supplierId, Number(body.product_id), String(body.supply_price))
    return ok(added)
  }
  // Supplier product price update
  if (path.match(/^\/suppliers\/(\d+)\/products\/(\d+)\/price$/) && method === 'PUT') {
    const [, , supplierIdStr, , productIdStr] = path.split('/')
    const body = parseBody<any>()
    const updated = upsertSupplierProduct(Number(supplierIdStr), Number(productIdStr), String(body.supply_price))
    return ok(updated)
  }
  // Supplier product remove
  if (path.match(/^\/suppliers\/(\d+)\/products\/(\d+)$/) && method === 'DELETE') {
    const [, , supplierIdStr, , productIdStr] = path.split('/')
    removeSupplierProduct(Number(supplierIdStr), Number(productIdStr))
    return ok(undefined)
  }

  // Dashboard
  if (path === '/dashboard/stats' && method === 'GET') {
    return ok(computeDashboardStats())
  }
  if (path === '/dashboard/inventory-report' && method === 'GET') {
    const low = Number(search.get('low_stock_threshold') || '10')
    return ok(computeInventoryReport(low))
  }
  if (path === '/dashboard/sales-report' && method === 'GET') {
    const start = new Date(search.get('start_date') || '1970-01-01')
    const end = new Date(search.get('end_date') || new Date().toISOString())
    const groupBy = search.get('group_by') || 'day'
    const buckets = new Map<string, number>()
    for (const s of mockSales) {
      const d = new Date(s.sale_date)
      if (d < start || d > end) continue
      let key = d.toISOString().slice(0, 10)
      if (groupBy === 'month') key = d.toISOString().slice(0, 7)
      if (groupBy === 'year') key = String(d.getUTCFullYear())
      buckets.set(key, (buckets.get(key) || 0) + parseFloat(s.total_amount))
    }
    const series = Array.from(buckets.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => ({ key: k, total: Number(v.toFixed(2)) }))
    return ok({ series })
  }

  // Fallback: return empty success
  return ok(undefined as unknown as T)
}

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (USE_MOCKS) {
    return mockApiRequest<T>(endpoint, options)
  }

  const token = localStorage.getItem('authToken')
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// API methods
export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint),
  post: <T>(endpoint: string, data?: any) => apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: <T>(endpoint: string, data?: any) => apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, {
    method: 'DELETE',
  }),
  patch: <T>(endpoint: string, data?: any) => apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
}

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    profile: '/auth/profile',
  },
  products: {
    all: '/products',
    byId: (id: string) => `/products/${id}`,
    search: (query: string) => `/products/search?q=${encodeURIComponent(query)}`,
    create: '/products',
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
    updateStock: (id: string) => `/products/${id}/stock`,
  },
  sales: {
    create: '/sales',
    all: '/sales',
    byId: (id: string) => `/sales/${id}`,
    byDateRange: (startDate: string, endDate: string) => 
      `/sales/date-range?start_date=${startDate}&end_date=${endDate}`,
    bySalesperson: (salespersonId: string) => `/sales/salesperson/${salespersonId}`,
  },
  staff: {
    all: '/salespersons',
    byId: (id: string) => `/salespersons/${id}`,
    create: '/salespersons',
    update: (id: string) => `/salespersons/${id}`,
    delete: (id: string) => `/salespersons/${id}`,
    search: (query: string) => `/salespersons/search?q=${encodeURIComponent(query)}`,
    toggleStatus: (id: string) => `/salespersons/${id}/toggle-status`,
    updateRole: (id: string) => `/salespersons/${id}/role`,
    updatePassword: (id: string) => `/salespersons/${id}/password`,
  },
  suppliers: {
    all: '/suppliers',
    byId: (id: string) => `/suppliers/${id}`,
    create: '/suppliers',
    update: (id: string) => `/suppliers/${id}`,
    delete: (id: string) => `/suppliers/${id}`,
    search: (query: string) => `/suppliers/search?q=${encodeURIComponent(query)}`,
    getProducts: (supplierId: string) => `/suppliers/${supplierId}/products`, // GET endpoint for supplier products
    addProduct: (supplierId: string) => `/suppliers/${supplierId}/products`,
    removeProduct: (supplierId: string, productId: string) => 
      `/suppliers/${supplierId}/products/${productId}`,
    updatePrice: (supplierId: string, productId: string) => 
      `/suppliers/${supplierId}/products/${productId}/price`,
    products: (supplierId: string) => `/suppliers/${supplierId}/products`,
  },
  supplierProducts: {
    all: '/suppliers/products', // This might need to be adjusted based on your backend
    byId: (id: string) => `/suppliers/products/${id}`,
    create: '/suppliers/products', // This might need to be adjusted based on your backend
    update: (id: string) => `/suppliers/products/${id}`,
    delete: (id: string) => `/suppliers/products/${id}`,
    bySupplier: (supplierId: string) => `/suppliers/${supplierId}/products`,
    byProduct: (productId: string) => `/suppliers/products/product/${productId}`,
  },
  dashboard: {
    stats: '/dashboard/stats',
    inventoryReport: '/dashboard/inventory-report',
    salesReport: '/dashboard/sales-report',
  },
}

// Types for API responses
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

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

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

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

export interface User {
  salesperson_id: number
  first_name: string
  last_name: string
  email: string
  username: string
  role: 'cashier' | 'manager' | 'admin'
  contact_info: string
  status?: 'active' | 'inactive'
  hire_date?: string
  hourly_rate?: number
  hours_worked?: number
}

export interface Supplier {
  supplier_id: number
  name: string
  contact_info: string
}

export interface CreateSupplierRequest {
  name: string
  contact_info: string
}

export interface UpdateSupplierRequest extends Partial<CreateSupplierRequest> {}

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

export interface UpdateSupplierProductRequest extends Partial<CreateSupplierProductRequest> {}

export interface SupplierProductWithDetails extends SupplierProduct {
  supplier_name: string
  product_name: string
  product_description: string
  retail_price: string
  stock_quantity: number
}

export interface Staff {
  salesperson_id: number
  first_name: string
  last_name: string
  email: string
  username: string
  contact_info: string
  role: 'cashier' | 'manager' | 'admin'
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
  role: 'cashier' | 'manager' | 'admin'
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
  role: 'cashier' | 'manager' | 'admin'
}

// Dashboard types
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

export interface InventoryReport {
  lowStockProducts: Product[]
}

// Stock Movement Tracking
export interface StockMovement {
  movement_id: number
  product_id: number
  movement_type: 'sale' | 'purchase' | 'adjustment' | 'return' | 'expiry'
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

// Daily Closure Summary
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
  status: 'open' | 'closed'
  closed_at?: string
  notes?: string
}

// Report Types
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

export interface ExpiryReport {
  product_id: number
  name: string
  batch_number: string
  expiry_date: string
  quantity: number
  days_until_expiry: number
  status: 'expired' | 'expiring_soon' | 'ok'
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
