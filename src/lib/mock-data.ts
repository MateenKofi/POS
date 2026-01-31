import type {
  Product,
  Supplier,
  Staff,
  Sale,
  SupplierProduct,
  User,
  DashboardStats,
  InventoryReport,
  StockMovement,
  Transaction,
  CreateTransactionRequest,
  TransactionType,
} from './types'

// Basic deterministic IDs for mock entities
let nextProductId = 1001
let nextSupplierId = 201
let nextStaffId = 301
let nextSaleId = 401
let nextMovementId = 501
let nextTransactionId = 601

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

// Mock users with credentials for different roles
export const mockUsers: { user: User; password: string }[] = [
  {
    user: {
      salesperson_id: 1,
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@pos.com',
      username: 'admin',
      role: 'admin',
      contact_info: '555-0001',
      status: 'active',
      hire_date: new Date().toISOString(),
      hourly_rate: 30,
    },
    password: 'admin123',
  },
  {
    user: {
      salesperson_id: 2,
      first_name: 'Manager',
      last_name: 'User',
      email: 'manager@pos.com',
      username: 'manager',
      role: 'manager',
      contact_info: '555-0002',
      status: 'active',
      hire_date: new Date().toISOString(),
      hourly_rate: 25,
    },
    password: 'manager123',
  },
  {
    user: {
      salesperson_id: 3,
      first_name: 'Cashier',
      last_name: 'User',
      email: 'cashier@pos.com',
      username: 'cashier',
      role: 'cashier',
      contact_info: '555-0003',
      status: 'active',
      hire_date: new Date().toISOString(),
      hourly_rate: 15,
    },
    password: 'cashier123',
  },
]

// Helper function to authenticate mock users
export const authenticateMockUser = (username: string, password: string): User | null => {
  const found = mockUsers.find(
    (u) => u.user.username === username && u.password === password
  )
  return found ? found.user : null
}

export const mockProducts: Product[] = [
  {
    product_id: 1,
    name: 'Layer Mash 50kg',
    description: 'Complete feed for laying hens',
    price: '250.00',
    cost_price: '200.00',
    stock_quantity: 150,
    unit_type: 'bag',
    weight_per_bag: 50,
    category: 'Poultry Feed',
    barcode: 'LM-050',
    expiry_date: '2025-12-31',
    batch_number: 'BATCH-2025-001',
    manufacturer: 'AgriFeeds Ghana',
    reorder_level: 50
  },
  {
    product_id: 2,
    name: 'Broiler Starter',
    description: 'High protein starter for broilers',
    price: '5.50',
    cost_price: '4.20',
    stock_quantity: 800,
    unit_type: 'loose',
    category: 'Poultry Feed',
    barcode: 'BS-LOOSE',
    expiry_date: '2025-08-15',
    batch_number: 'BATCH-2025-042',
    manufacturer: 'Premium Feeds Ltd',
    reorder_level: 200
  },
  {
    product_id: 3,
    name: 'NPK 15-15-15',
    description: 'Balanced fertilizer for crops',
    price: '180.00',
    cost_price: '140.00',
    stock_quantity: 75,
    unit_type: 'bag',
    weight_per_bag: 50,
    category: 'Fertilizer',
    barcode: 'NPK-151515',
    expiry_date: '2026-06-30',
    batch_number: 'FERT-2025-003',
    manufacturer: 'AgroChem Corp',
    reorder_level: 30
  },
  {
    product_id: 4,
    name: 'Cattle Feed Cubes',
    description: 'Nutritious cubes for cattle',
    price: '8.00',
    cost_price: '6.00',
    stock_quantity: 1200,
    unit_type: 'loose',
    category: 'Cattle Feed',
    barcode: 'CC-LOOSE',
    expiry_date: '2025-10-20',
    batch_number: 'BATCH-2025-088',
    manufacturer: 'Livestock Feeds Co',
    reorder_level: 300
  },
  {
    product_id: 5,
    name: 'Grower Pellets',
    description: 'Transition feed for growing poultry',
    price: '220.00',
    cost_price: '175.00',
    stock_quantity: 90,
    unit_type: 'bag',
    weight_per_bag: 50,
    category: 'Poultry Feed',
    barcode: 'GP-050',
    expiry_date: '2025-11-30',
    batch_number: 'BATCH-2025-095',
    manufacturer: 'AgriFeeds Ghana',
    reorder_level: 40
  },
  {
    product_id: 6,
    name: 'Urea 46%',
    description: 'Nitrogen fertilizer for crops',
    price: '3.50',
    cost_price: '2.80',
    stock_quantity: 2500,
    unit_type: 'loose',
    category: 'Fertilizer',
    barcode: 'UREA-46',
    expiry_date: '2026-12-31',
    batch_number: 'FERT-2025-112',
    manufacturer: 'AgroChem Corp',
    reorder_level: 500
  },
  {
    product_id: 7,
    name: 'Vitamin Premix',
    description: 'Supplement for animal feed',
    price: '45.00',
    cost_price: '35.00',
    stock_quantity: 150,
    unit_type: 'loose',
    category: 'Feed Supplements',
    barcode: 'VP-001',
    expiry_date: '2025-07-01',
    batch_number: 'SUPP-2025-015',
    manufacturer: 'NutriAdd Ghana',
    reorder_level: 50
  },
  {
    product_id: 8,
    name: 'Pig Finisher',
    description: 'Final stage feed for pigs',
    price: '6.20',
    cost_price: '4.80',
    stock_quantity: 600,
    unit_type: 'loose',
    category: 'Swine Feed',
    barcode: 'PF-LOOSE',
    expiry_date: '2025-09-15',
    batch_number: 'BATCH-2025-128',
    manufacturer: 'Premium Feeds Ltd',
    reorder_level: 150
  },
]

export const mockSuppliers: Supplier[] = [
  { supplier_id: 1, name: 'AgriFeeds Ghana Ltd', contact_info: 'info@agrifeedsgh.com' },
  { supplier_id: 2, name: 'Premium Feeds Ltd', contact_info: 'sales@premiumfeeds.com' },
  { supplier_id: 3, name: 'AgroChem Corp', contact_info: 'orders@agrochemcorp.com' },
]

export const mockStaff: Staff[] = [
  { salesperson_id: 1, first_name: 'Alex', last_name: 'Doe', email: 'alex@example.com', username: 'alex', contact_info: '555-1234', role: 'manager', status: 'active', hourly_rate: 25 },
  { salesperson_id: 2, first_name: 'Sam', last_name: 'Lee', email: 'sam@example.com', username: 'sam', contact_info: '555-5678', role: 'cashier', status: 'active', hourly_rate: 15 },
  { salesperson_id: 3, first_name: 'Riley', last_name: 'Kim', email: 'riley@example.com', username: 'riley', contact_info: '555-2468', role: 'cashier', status: 'inactive', hourly_rate: 14 },
  { salesperson_id: 4, first_name: 'Jordan', last_name: 'Ng', email: 'jordan@example.com', username: 'jordan', contact_info: '555-9876', role: 'admin', status: 'active', hourly_rate: 28 },
]

export const mockSupplierProducts: SupplierProduct[] = [
  { supplier_product_id: 1, supplier_id: 1, product_id: 1, supply_price: '200.00' },
  { supplier_product_id: 2, supplier_id: 1, product_id: 5, supply_price: '175.00' },
  { supplier_product_id: 3, supplier_id: 2, product_id: 2, supply_price: '4.20' },
  { supplier_product_id: 4, supplier_id: 2, product_id: 8, supply_price: '4.80' },
  { supplier_product_id: 5, supplier_id: 3, product_id: 3, supply_price: '140.00' },
  { supplier_product_id: 6, supplier_id: 3, product_id: 6, supply_price: '2.80' },
]

export const mockSales: Sale[] = [
  {
    sale_id: 1,
    sale_date: new Date().toISOString(),
    cashier_id: 2,
    payment_method_id: 1,
    total_amount: '750.00',
    subtotal: '750.00',
    total_discount: '0.00',
    items: [
      { product_id: 1, quantity: 3, unit: 'bag', price_at_sale: 250.00, cost_price_at_sale: 200.00, batch_number: 'BATCH-2025-001', expiry_date: '2025-12-31' },
    ],
    first_name: 'Sam',
    last_name: 'Lee',
    method_name: 'Cash',
    profit_amount: '150.00',
    receipt_generated: true,
  },
  {
    sale_id: 2,
    sale_date: new Date(Date.now() - 86400000).toISOString(),
    cashier_id: 2,
    payment_method_id: 2,
    total_amount: '220.00',
    subtotal: '220.00',
    total_discount: '0.00',
    items: [
      { product_id: 5, quantity: 1, unit: 'bag', price_at_sale: 220.00, cost_price_at_sale: 175.00, batch_number: 'BATCH-2025-095', expiry_date: '2025-11-30' },
    ],
    first_name: 'Sam',
    last_name: 'Lee',
    method_name: 'Mobile Money',
    customer_phone: '+233-24-123-4567',
    profit_amount: '45.00',
    receipt_generated: false,
  },
]

export const paginate = <T>(items: T[], page: number, limit: number) => {
  const total = items.length
  const pages = Math.max(1, Math.ceil(total / Math.max(1, limit)))
  const start = (Math.max(1, page) - 1) * Math.max(1, limit)
  const end = start + Math.max(1, limit)
  return {
    data: items.slice(start, end),
    pagination: { page, limit, total, pages },
  }
}

export const computeDashboardStats = (): DashboardStats => {
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

export const computeInventoryReport = (lowStockThreshold: number): InventoryReport => {
  const lowStockProducts = mockProducts.filter(p => p.stock_quantity <= lowStockThreshold)
  return { lowStockProducts }
}

export const createProduct = (data: Omit<Product, 'product_id'>): Product => {
  const product: Product = { ...data, product_id: nextProductId++ }
  mockProducts.push(product)
  return product
}

export const updateProduct = (id: number, data: Partial<Product>): Product | undefined => {
  const idx = mockProducts.findIndex(p => p.product_id === id)
  if (idx === -1) return undefined
  mockProducts[idx] = { ...mockProducts[idx], ...data, product_id: id }
  return mockProducts[idx]
}

export const deleteProduct = (id: number): boolean => {
  const idx = mockProducts.findIndex(p => p.product_id === id)
  if (idx === -1) return false
  mockProducts.splice(idx, 1)
  return true
}

export const createSupplier = (data: Omit<Supplier, 'supplier_id'>): Supplier => {
  const supplier: Supplier = { ...data, supplier_id: nextSupplierId++ }
  mockSuppliers.push(supplier)
  return supplier
}

export const updateSupplier = (id: number, data: Partial<Supplier>): Supplier | undefined => {
  const idx = mockSuppliers.findIndex(s => s.supplier_id === id)
  if (idx === -1) return undefined
  mockSuppliers[idx] = { ...mockSuppliers[idx], ...data, supplier_id: id }
  return mockSuppliers[idx]
}

export const deleteSupplier = (id: number): boolean => {
  const idx = mockSuppliers.findIndex(s => s.supplier_id === id)
  if (idx === -1) return false
  mockSuppliers.splice(idx, 1)
  return true
}

export const createStaff = (data: Omit<Staff, 'salesperson_id'> & { password?: string }): Staff => {
  const staff: Staff = { ...data, salesperson_id: nextStaffId++ }
  mockStaff.push(staff)
  return staff
}

export const updateStaff = (id: number, data: Partial<Staff>): Staff | undefined => {
  const idx = mockStaff.findIndex(s => s.salesperson_id === id)
  if (idx === -1) return undefined
  mockStaff[idx] = { ...mockStaff[idx], ...data, salesperson_id: id }
  return mockStaff[idx]
}

export const deleteStaff = (id: number): boolean => {
  const idx = mockStaff.findIndex(s => s.salesperson_id === id)
  if (idx === -1) return false
  mockStaff.splice(idx, 1)
  return true
}

export const toggleStaffStatus = (id: number): Staff | undefined => {
  const staff = mockStaff.find(s => s.salesperson_id === id)
  if (!staff) return undefined
  staff.status = staff.status === 'active' ? 'inactive' : 'active'
  return staff
}

export const createSale = (data: Omit<Sale, 'sale_id' | 'sale_date' | 'first_name' | 'last_name' | 'method_name' | 'total_amount' | 'subtotal' | 'total_discount' | 'profit_amount' | 'receipt_generated'>): Sale => {
  const staff = mockStaff.find(s => s.salesperson_id === data.cashier_id) || mockStaff[0]

  // Calculate totals
  const subtotal = data.items.reduce((acc, it) => {
    const itemTotal = it.price_at_sale * it.quantity
    const discount = it.discount_amount || 0
    return acc + itemTotal - discount
  }, 0)

  const totalDiscount = data.items.reduce((acc, it) => acc + (it.discount_amount || 0), 0)

  const totalCost = data.items.reduce((acc, it) => acc + (it.cost_price_at_sale * it.quantity), 0)
  const profit = subtotal - totalCost

  const sale: Sale = {
    sale_id: nextSaleId++,
    sale_date: new Date().toISOString(),
    subtotal: subtotal.toFixed(2),
    total_discount: totalDiscount.toFixed(2),
    total_amount: (subtotal - totalDiscount).toFixed(2),
    profit_amount: profit.toFixed(2),
    receipt_generated: false,
    first_name: staff.first_name,
    last_name: staff.last_name,
    method_name: data.payment_method_id === 2 ? 'Mobile Money' : data.payment_method_id === 3 ? 'Bank Transfer' : 'Cash',
    ...data,
  }
  mockSales.unshift(sale)

  // Decrement stock and create stock movement records
  for (const item of data.items) {
    const product = mockProducts.find(p => p.product_id === item.product_id)
    if (product) {
      // Convert bags to kg for stock tracking
      const qtyInKg = item.unit === 'bag' && product.weight_per_bag ? item.quantity * product.weight_per_bag : item.quantity
      product.stock_quantity = Math.max(0, product.stock_quantity - qtyInKg)

      // Create stock movement record
      createStockMovement({
        product_id: item.product_id,
        movement_type: 'sale',
        quantity: -qtyInKg,
        unit: 'kg',
        reference_id: sale.sale_id,
        reference_type: 'sale',
        batch_number: item.batch_number,
        expiry_date: item.expiry_date,
        created_by: data.cashier_id,
        notes: `Sale of ${item.quantity} ${item.unit}${item.quantity > 1 ? 's' : ''} of ${product.name}`
      })
    }
  }
  return sale
}

export const upsertSupplierProduct = (supplierId: number, productId: number, supplyPrice: string): SupplierProduct => {
  const existing = mockSupplierProducts.find(sp => sp.supplier_id === supplierId && sp.product_id === productId)
  if (existing) {
    existing.supply_price = supplyPrice
    return existing
  }
  const supplierProduct: SupplierProduct = { supplier_product_id: mockSupplierProducts.length + 1, supplier_id: supplierId, product_id: productId, supply_price: supplyPrice }
  mockSupplierProducts.push(supplierProduct)
  return supplierProduct
}

export const removeSupplierProduct = (supplierId: number, productId: number): boolean => {
  const idx = mockSupplierProducts.findIndex(sp => sp.supplier_id === supplierId && sp.product_id === productId)
  if (idx === -1) return false
  mockSupplierProducts.splice(idx, 1)
  return true
}

// Stock Movements
export const mockStockMovements: StockMovement[] = []

export const createStockMovement = (movement: Omit<StockMovement, 'movement_id' | 'created_at'>): StockMovement => {
  const newMovement: StockMovement = {
    movement_id: nextMovementId++,
    created_at: new Date().toISOString(),
    ...movement
  }
  mockStockMovements.unshift(newMovement)
  return newMovement
}

// Transactions - Independent financial transaction tracking
// NOT linked to invoices - separate money movement records
export const mockTransactions: Transaction[] = [
  {
    transaction_id: 1,
    transaction_date: new Date().toISOString(),
    transaction_type: 'sale_payment',
    status: 'completed',
    amount: '750.00',
    payment_method: 'cash',
    reference_number: 'TXN-20250129-001',
    description: 'Sale payment - Layer Mash 50kg x3',
    related_entity_id: 1,
    related_entity_type: 'sale',
    cashier_id: 2,
    cashier_name: 'Sam Lee',
    created_at: new Date().toISOString(),
  },
  {
    transaction_id: 2,
    transaction_date: new Date(Date.now() - 3600000).toISOString(),
    transaction_type: 'sale_payment',
    status: 'completed',
    amount: '220.00',
    payment_method: 'mobile_money',
    reference_number: 'TXN-20250129-002',
    description: 'Sale payment - Grower Pellets x1',
    related_entity_id: 2,
    related_entity_type: 'sale',
    cashier_id: 2,
    cashier_name: 'Sam Lee',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    transaction_id: 3,
    transaction_date: new Date(Date.now() - 7200000).toISOString(),
    transaction_type: 'expense',
    status: 'completed',
    amount: '150.00',
    payment_method: 'mobile_money',
    reference_number: 'EXP-20250129-001',
    description: 'Utility bill payment',
    category: 'utilities',
    cashier_id: 1,
    cashier_name: 'Alex Doe',
    notes: 'Electricity for January 2025',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    transaction_id: 4,
    transaction_date: new Date(Date.now() - 86400000).toISOString(),
    transaction_type: 'supplier_payment',
    status: 'completed',
    amount: '5000.00',
    payment_method: 'bank_transfer',
    reference_number: 'SUP-20250128-001',
    description: 'Payment to AgriFeeds Ghana Ltd',
    category: 'supplier',
    related_entity_id: 1,
    related_entity_type: 'supplier',
    cashier_id: 1,
    cashier_name: 'Alex Doe',
    notes: 'Bulk feed purchase payment',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    transaction_id: 5,
    transaction_date: new Date(Date.now() - 90000000).toISOString(),
    transaction_type: 'cash_deposit',
    status: 'completed',
    amount: '2000.00',
    payment_method: 'cash',
    reference_number: 'DEP-20250128-001',
    description: 'Daily sales cash deposit to bank',
    cashier_id: 1,
    cashier_name: 'Alex Doe',
    created_at: new Date(Date.now() - 90000000).toISOString(),
  },
  {
    transaction_id: 6,
    transaction_date: new Date(Date.now() - 90000000).toISOString(),
    transaction_type: 'refund',
    status: 'completed',
    amount: '45.00',
    payment_method: 'cash',
    reference_number: 'REF-20250128-001',
    description: 'Refund - Customer returned Vitamin Premix',
    related_entity_id: 2,
    related_entity_type: 'sale',
    cashier_id: 2,
    cashier_name: 'Sam Lee',
    notes: 'Product quality issue - customer approved refund',
    created_at: new Date(Date.now() - 90000000).toISOString(),
  },
]

export const getTransactions = (page = 1, limit = 50) => {
  const { data, pagination } = paginate(mockTransactions, page, limit)
  return { transactions: data, pagination }
}

export const getTransactionsByDateRange = (startDate: string, endDate: string): Transaction[] => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return mockTransactions.filter(t => {
    const d = new Date(t.transaction_date)
    return d >= start && d <= end
  })
}

export const getTransactionsByType = (type: TransactionType): Transaction[] => {
  return mockTransactions.filter(t => t.transaction_type === type)
}

export const createTransaction = (data: Omit<Transaction, 'transaction_id' | 'transaction_date' | 'cashier_name' | 'created_at'> & { cashier_id?: number }): Transaction => {
  const cashierId = data.cashier_id || 1 // Default to admin user
  const staff = mockStaff.find(s => s.salesperson_id === cashierId) || mockStaff[0]

  const transaction: Transaction = {
    transaction_id: nextTransactionId++,
    transaction_date: new Date().toISOString(),
    cashier_name: `${staff.first_name} ${staff.last_name}`,
    created_at: new Date().toISOString(),
    ...data,
    status: data.status || 'completed',
    cashier_id: cashierId,
  }
  mockTransactions.unshift(transaction)
  return transaction
}

export const updateTransaction = (id: number, data: Partial<CreateTransactionRequest & { status?: Transaction['status'] }>): Transaction | undefined => {
  const idx = mockTransactions.findIndex(t => t.transaction_id === id)
  if (idx === -1) return undefined
  mockTransactions[idx] = { ...mockTransactions[idx], ...data }
  return mockTransactions[idx]
}

export const deleteTransaction = (id: number): boolean => {
  const idx = mockTransactions.findIndex(t => t.transaction_id === id)
  if (idx === -1) return false
  mockTransactions.splice(idx, 1)
  return true
}
