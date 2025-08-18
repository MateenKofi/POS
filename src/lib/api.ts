// API utilities using native fetch
const API_BASE_URL = 'http://localhost:3007/api'

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
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
  price: string
  stock_quantity: number
  category?: string
  barcode?: string
  supplier?: string
  suppliers?: SupplierInfo[]
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
  stock_quantity: number
  category?: string
  barcode?: string
  supplier?: string
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface SaleItem {
  product_id: number
  quantity: number
  price_at_sale: number
}

export interface CreateSaleRequest {
  payment_method_id: number
  items: SaleItem[]
}

export interface Sale {
  sale_id: number
  sale_date: string
  salesperson_id: number
  payment_method_id: number
  total_amount: string
  items: SaleItem[]
  // Additional fields from dashboard API response
  first_name?: string
  last_name?: string
  method_name?: string
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
  role: 'salesperson' | 'manager' | 'admin'
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
  role: 'salesperson' | 'manager' | 'admin'
  status: 'active' | 'inactive'
  hire_date: string
  hourly_rate: number
  hours_worked: number
}

export interface CreateStaffRequest {
  first_name: string
  last_name: string
  email: string
  username: string
  password: string
  contact_info: string
  role: 'salesperson' | 'manager' | 'admin'
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
  role: 'salesperson' | 'manager' | 'admin'
}
