import type { Product, Supplier, Staff, Sale, SupplierProduct, User, DashboardStats, InventoryReport } from './api'

// Basic deterministic IDs for mock entities
let nextProductId = 1001
let nextSupplierId = 201
let nextStaffId = 301
let nextSaleId = 401

export const mockUser: User = {
  salesperson_id: 1,
  first_name: 'Alex',
  last_name: 'Doe',
  email: 'alex.doe@example.com',
  username: 'alex',
  role: 'manager',
  contact_info: '555-1234',
  status: 'active',
  hire_date: new Date().toISOString(),
  hourly_rate: 25,
}

export const mockProducts: Product[] = [
  { product_id: 1, name: 'Wireless Mouse', description: 'Ergonomic 2.4G mouse', price: '19.99', stock_quantity: 45, category: 'Accessories', barcode: 'WM-001' },
  { product_id: 2, name: 'Mechanical Keyboard', description: 'RGB backlit, blue switches', price: '79.99', stock_quantity: 20, category: 'Accessories', barcode: 'MK-002' },
  { product_id: 3, name: 'USB-C Cable', description: '1m, fast charge', price: '9.99', stock_quantity: 120, category: 'Cables', barcode: 'UC-003' },
  { product_id: 4, name: '27" Monitor', description: '144Hz FHD', price: '219.00', stock_quantity: 12, category: 'Displays', barcode: 'MN-004' },
  { product_id: 5, name: 'External SSD 1TB', description: 'USB 3.2 Gen2', price: '129.00', stock_quantity: 18, category: 'Storage', barcode: 'ES-005' },
  { product_id: 6, name: 'Webcam HD', description: '1080p autofocus', price: '49.00', stock_quantity: 34, category: 'Accessories', barcode: 'WC-006' },
  { product_id: 7, name: 'Bluetooth Speaker', description: 'Portable, 12h battery', price: '39.00', stock_quantity: 27, category: 'Audio', barcode: 'BS-007' },
  { product_id: 8, name: 'Gaming Headset', description: '7.1 surround', price: '59.00', stock_quantity: 22, category: 'Audio', barcode: 'GH-008' },
]

export const mockSuppliers: Supplier[] = [
  { supplier_id: 1, name: 'TechSource Ltd', contact_info: 'techsource@example.com' },
  { supplier_id: 2, name: 'GadgetHub Inc', contact_info: 'gadgethub@example.com' },
  { supplier_id: 3, name: 'PixelParts Co', contact_info: 'pixelparts@example.com' },
]

export const mockStaff: Staff[] = [
  { salesperson_id: 1, first_name: 'Alex', last_name: 'Doe', email: 'alex@example.com', username: 'alex', contact_info: '555-1234', role: 'manager', status: 'active', hourly_rate: 25 },
  { salesperson_id: 2, first_name: 'Sam', last_name: 'Lee', email: 'sam@example.com', username: 'sam', contact_info: '555-5678', role: 'salesperson', status: 'active', hourly_rate: 15 },
  { salesperson_id: 3, first_name: 'Riley', last_name: 'Kim', email: 'riley@example.com', username: 'riley', contact_info: '555-2468', role: 'salesperson', status: 'inactive', hourly_rate: 14 },
  { salesperson_id: 4, first_name: 'Jordan', last_name: 'Ng', email: 'jordan@example.com', username: 'jordan', contact_info: '555-9876', role: 'admin', status: 'active', hourly_rate: 28 },
]

export const mockSupplierProducts: SupplierProduct[] = [
  { supplier_product_id: 1, supplier_id: 1, product_id: 1, supply_price: '12.00' },
  { supplier_product_id: 2, supplier_id: 1, product_id: 3, supply_price: '4.00' },
  { supplier_product_id: 3, supplier_id: 2, product_id: 2, supply_price: '55.00' },
  { supplier_product_id: 4, supplier_id: 2, product_id: 6, supply_price: '30.00' },
  { supplier_product_id: 5, supplier_id: 3, product_id: 5, supply_price: '95.00' },
  { supplier_product_id: 6, supplier_id: 3, product_id: 7, supply_price: '25.00' },
]

export const mockSales: Sale[] = [
  {
    sale_id: 1,
    sale_date: new Date().toISOString(),
    salesperson_id: 2,
    payment_method_id: 1,
    total_amount: '69.98',
    items: [
      { product_id: 1, quantity: 2, price_at_sale: 19.99 },
    ],
    first_name: 'Sam',
    last_name: 'Lee',
    method_name: 'Cash',
  },
  {
    sale_id: 2,
    sale_date: new Date(Date.now() - 86400000).toISOString(),
    salesperson_id: 2,
    payment_method_id: 2,
    total_amount: '79.99',
    items: [
      { product_id: 2, quantity: 1, price_at_sale: 79.99 },
    ],
    first_name: 'Sam',
    last_name: 'Lee',
    method_name: 'Card',
  },
]

export function paginate<T>(items: T[], page: number, limit: number) {
  const total = items.length
  const pages = Math.max(1, Math.ceil(total / Math.max(1, limit)))
  const start = (Math.max(1, page) - 1) * Math.max(1, limit)
  const end = start + Math.max(1, limit)
  return {
    data: items.slice(start, end),
    pagination: { page, limit, total, pages },
  }
}

export function computeDashboardStats(): DashboardStats {
  const todayStr = new Date().toDateString()
  const todaySales = mockSales.filter(s => new Date(s.sale_date).toDateString() === todayStr)
  const todayRevenue = todaySales.reduce((acc, s) => acc + parseFloat(s.total_amount), 0)

  const productSalesMap = new Map<number, { total_sold: number; total_revenue: number; name: string }>()
  for (const sale of mockSales) {
    for (const item of sale.items) {
      const product = mockProducts.find(p => p.product_id === item.product_id)
      if (!product) continue
      const entry = productSalesMap.get(item.product_id) || { total_sold: 0, total_revenue: 0, name: product.name }
      entry.total_sold += item.quantity
      entry.total_revenue += item.quantity * item.price_at_sale
      productSalesMap.set(item.product_id, entry)
    }
  }
  const topProducts = Array.from(productSalesMap.entries())
    .map(([product_id, v]) => ({ product_id, name: v.name, total_sold: v.total_sold, total_revenue: parseFloat(v.total_revenue.toFixed(2)) }))
    .sort((a, b) => b.total_sold - a.total_sold)
    .slice(0, 5)

  return {
    overview: {
      todayRevenue: parseFloat(todayRevenue.toFixed(2)),
      totalProducts: mockProducts.length,
      todaySales: todaySales.length,
    },
    topProducts,
  }
}

export function computeInventoryReport(lowStockThreshold: number): InventoryReport {
  const lowStockProducts = mockProducts.filter(p => p.stock_quantity <= lowStockThreshold)
  return { lowStockProducts }
}

export function createProduct(data: Omit<Product, 'product_id'>): Product {
  const product: Product = { ...data, product_id: nextProductId++ }
  mockProducts.push(product)
  return product
}

export function updateProduct(id: number, data: Partial<Product>): Product | undefined {
  const idx = mockProducts.findIndex(p => p.product_id === id)
  if (idx === -1) return undefined
  mockProducts[idx] = { ...mockProducts[idx], ...data, product_id: id }
  return mockProducts[idx]
}

export function deleteProduct(id: number): boolean {
  const idx = mockProducts.findIndex(p => p.product_id === id)
  if (idx === -1) return false
  mockProducts.splice(idx, 1)
  return true
}

export function createSupplier(data: Omit<Supplier, 'supplier_id'>): Supplier {
  const supplier: Supplier = { ...data, supplier_id: nextSupplierId++ }
  mockSuppliers.push(supplier)
  return supplier
}

export function updateSupplier(id: number, data: Partial<Supplier>): Supplier | undefined {
  const idx = mockSuppliers.findIndex(s => s.supplier_id === id)
  if (idx === -1) return undefined
  mockSuppliers[idx] = { ...mockSuppliers[idx], ...data, supplier_id: id }
  return mockSuppliers[idx]
}

export function deleteSupplier(id: number): boolean {
  const idx = mockSuppliers.findIndex(s => s.supplier_id === id)
  if (idx === -1) return false
  mockSuppliers.splice(idx, 1)
  return true
}

export function createStaff(data: Omit<Staff, 'salesperson_id'> & { password?: string }): Staff {
  const staff: Staff = { ...data, salesperson_id: nextStaffId++ }
  mockStaff.push(staff)
  return staff
}

export function updateStaff(id: number, data: Partial<Staff>): Staff | undefined {
  const idx = mockStaff.findIndex(s => s.salesperson_id === id)
  if (idx === -1) return undefined
  mockStaff[idx] = { ...mockStaff[idx], ...data, salesperson_id: id }
  return mockStaff[idx]
}

export function deleteStaff(id: number): boolean {
  const idx = mockStaff.findIndex(s => s.salesperson_id === id)
  if (idx === -1) return false
  mockStaff.splice(idx, 1)
  return true
}

export function toggleStaffStatus(id: number): Staff | undefined {
  const staff = mockStaff.find(s => s.salesperson_id === id)
  if (!staff) return undefined
  staff.status = staff.status === 'active' ? 'inactive' : 'active'
  return staff
}

export function createSale(data: Omit<Sale, 'sale_id' | 'sale_date' | 'first_name' | 'last_name' | 'method_name' | 'total_amount'>): Sale {
  const staff = mockStaff.find(s => s.salesperson_id === data.salesperson_id) || mockStaff[0]
  const total = data.items.reduce((acc, it) => acc + it.price_at_sale * it.quantity, 0)
  const sale: Sale = {
    sale_id: nextSaleId++,
    sale_date: new Date().toISOString(),
    total_amount: total.toFixed(2),
    first_name: staff.first_name,
    last_name: staff.last_name,
    method_name: data.payment_method_id === 2 ? 'Card' : data.payment_method_id === 3 ? 'Mobile Money' : 'Cash',
    ...data,
  }
  mockSales.unshift(sale)
  // Decrement stock
  for (const item of data.items) {
    const product = mockProducts.find(p => p.product_id === item.product_id)
    if (product) product.stock_quantity = Math.max(0, product.stock_quantity - item.quantity)
  }
  return sale
}

export function upsertSupplierProduct(supplierId: number, productId: number, supplyPrice: string): SupplierProduct {
  const existing = mockSupplierProducts.find(sp => sp.supplier_id === supplierId && sp.product_id === productId)
  if (existing) {
    existing.supply_price = supplyPrice
    return existing
  }
  const supplierProduct: SupplierProduct = { supplier_product_id: mockSupplierProducts.length + 1, supplier_id: supplierId, product_id: productId, supply_price: supplyPrice }
  mockSupplierProducts.push(supplierProduct)
  return supplierProduct
}

export function removeSupplierProduct(supplierId: number, productId: number): boolean {
  const idx = mockSupplierProducts.findIndex(sp => sp.supplier_id === supplierId && sp.product_id === productId)
  if (idx === -1) return false
  mockSupplierProducts.splice(idx, 1)
  return true
}
