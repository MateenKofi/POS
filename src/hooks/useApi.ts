import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { api, endpoints, type ApiResponse, type Product, type CreateProductRequest, type UpdateProductRequest, type CreateSaleRequest, type Sale, type Supplier, type CreateSupplierRequest, type UpdateSupplierRequest, type SupplierProduct, type CreateSupplierProductRequest, type UpdateSupplierProductRequest, type SupplierProductWithDetails, type Staff, type CreateStaffRequest, type UpdateStaffRequest, type UpdateStaffRoleRequest, type UpdateStaffPasswordRequest } from '@/lib/api'

// Products hooks
export const useProducts = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['products', page, limit],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Product[]>>(
        `${endpoints.products.all}?page=${page}&limit=${limit}`
      )
      return response.data
    },
  })
}

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Product>>(endpoints.products.byId(id))
      return response.data
    },
    enabled: !!id,
  })
}

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Product[]>>(endpoints.products.search(query))
      return response.data
    },
    enabled: !!query && query.length > 2,
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateProductRequest) => {
      const response = await api.post<ApiResponse<Product>>(endpoints.products.create, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProductRequest }) => {
      const response = await api.put<ApiResponse<Product>>(endpoints.products.update(id), data)
      return response.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', id] })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<void>>(endpoints.products.delete(id))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// Sales hooks
export const useSales = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['sales', page, limit],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{
        sales: Sale[]
        pagination: {
          page: number
          limit: number
          total: number
          pages: number
        }
      }>>(`${endpoints.sales.all}?page=${page}&limit=${limit}`)
      return response.data
    },
  })
}

export const useSale = (id: string) => {
  return useQuery({
    queryKey: ['sale', id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Sale>>(endpoints.sales.byId(id))
      return response.data
    },
    enabled: !!id,
  })
}

export const useCreateSale = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateSaleRequest) => {
      const response = await api.post<ApiResponse<{ sale: Sale; items: any[] }>>(
        endpoints.sales.create,
        data
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useSalesByDateRange = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['sales', 'date-range', startDate, endDate],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Sale[]>>(
        endpoints.sales.byDateRange(startDate, endDate)
      )
      return response.data
    },
    enabled: !!startDate && !!endDate,
  })
}

// Dashboard hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<any>>(endpoints.dashboard.stats)
      return response.data
    },
  })
}

export const useInventoryReport = (lowStockThreshold = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'inventory-report', lowStockThreshold],
    queryFn: async () => {
      const response = await api.get<ApiResponse<any>>(
        `${endpoints.dashboard.inventoryReport}?low_stock_threshold=${lowStockThreshold}`
      )
      return response.data
    },
  })
}

export const useSalesReport = (startDate: string, endDate: string, groupBy = 'day') => {
  return useQuery({
    queryKey: ['dashboard', 'sales-report', startDate, endDate, groupBy],
    queryFn: async () => {
      const response = await api.get<ApiResponse<any>>(
        `${endpoints.dashboard.salesReport}?start_date=${startDate}&end_date=${endDate}&group_by=${groupBy}`
      )
      return response.data
    },
    enabled: !!startDate && !!endDate,
  })
}

// Supplier hooks
export const useSuppliers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['suppliers', page, limit],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Supplier[]>>(
        `${endpoints.suppliers.all}?page=${page}&limit=${limit}`
      )
      return response.data
    },
  })
}

export const useSupplier = (id: string) => {
  return useQuery({
    queryKey: ['supplier', id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Supplier>>(endpoints.suppliers.byId(id))
      return response.data
    },
    enabled: !!id,
  })
}

export const useSearchSuppliers = (query: string) => {
  return useQuery({
    queryKey: ['suppliers', 'search', query],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Supplier[]>>(
        endpoints.suppliers.search(query)
      )
      return response.data
    },
    enabled: !!query && query.length > 2,
  })
}

export const useCreateSupplier = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateSupplierRequest) => {
      const response = await api.post<ApiResponse<Supplier>>(endpoints.suppliers.create, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    },
  })
}

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSupplierRequest }) => {
      const response = await api.put<ApiResponse<Supplier>>(endpoints.suppliers.update(id), data)
      return response.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      queryClient.invalidateQueries({ queryKey: ['supplier', id] })
    },
  })
}

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<void>>(endpoints.suppliers.delete(id))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    },
  })
}

// Staff hooks
export const useStaff = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['staff', page, limit],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Staff[]>>(
        `${endpoints.staff.all}?page=${page}&limit=${limit}`
      )
      return response.data
    },
  })
}

export const useStaffMember = (id: string) => {
  return useQuery({
    queryKey: ['staff', id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Staff>>(endpoints.staff.byId(id))
      return response.data
    },
    enabled: !!id,
  })
}

export const useSearchStaff = (query: string) => {
  return useQuery({
    queryKey: ['staff', 'search', query],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Staff[]>>(endpoints.staff.search(query))
      return response.data
    },
    enabled: !!query && query.length > 2,
  })
}

export const useCreateStaff = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateStaffRequest) => {
      const response = await api.post<ApiResponse<Staff>>(endpoints.staff.create, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
    },
  })
}

export const useUpdateStaff = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateStaffRequest }) => {
      const response = await api.put<ApiResponse<Staff>>(endpoints.staff.update(id), data)
      return response.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      queryClient.invalidateQueries({ queryKey: ['staff', id] })
    },
  })
}

export const useDeleteStaff = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<void>>(endpoints.staff.delete(id))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
    },
  })
}

export const useToggleStaffStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch<ApiResponse<Staff>>(endpoints.staff.toggleStatus(id))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
    },
  })
}

export const useUpdateStaffRole = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateStaffRoleRequest }) => {
      const response = await api.patch<ApiResponse<Staff>>(endpoints.staff.updateRole(id), data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
    },
  })
}

export const useUpdateStaffPassword = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateStaffPasswordRequest }) => {
      const response = await api.patch<ApiResponse<void>>(endpoints.staff.updatePassword(id), data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
    },
  })
}

// SupplierProduct hooks
export const useSupplierProducts = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['supplier-products', page, limit],
    queryFn: async () => {
      // Since we don't have a direct /supplier-products endpoint,
      // we'll need to fetch from individual suppliers and combine the results
      // For now, return an empty array - this could be enhanced later
      return []
    },
  })
}

export const useSupplierProduct = (id: string) => {
  return useQuery({
    queryKey: ['supplier-product', id],
    queryFn: async () => {
      // This would need to be implemented based on your backend structure
      throw new Error('Direct supplier product by ID not supported by current backend')
    },
    enabled: false, // Disable this query since the endpoint doesn't exist
  })
}

export const useSupplierProductsBySupplier = (supplierId: string) => {
  return useQuery({
    queryKey: ['supplier-products', 'supplier', supplierId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{
        supplier: Supplier;
        products: Array<{
          product_id: number;
          name: string;
          description: string;
          retail_price: string;
          stock_quantity: number;
          supply_price: string;
          total_supply_value: string;
        }>;
        pagination: any;
      }>>(endpoints.suppliers.getProducts(supplierId))
      
      // Transform the response to match the expected SupplierProductWithDetails format
      const supplierProducts: SupplierProductWithDetails[] = response.data.products.map(product => ({
        supplier_product_id: 0, // This might not be available in the current response
        supplier_id: parseInt(supplierId),
        product_id: product.product_id,
        supply_price: product.supply_price,
        supplier_name: response.data.supplier.name,
        product_name: product.name,
        product_description: product.description,
        retail_price: product.retail_price,
        stock_quantity: product.stock_quantity,
      }))
      
      return supplierProducts
    },
    enabled: !!supplierId,
  })
}

export const useSupplierProductsByProduct = (productId: string) => {
  return useQuery({
    queryKey: ['supplier-products', 'product', productId],
    queryFn: async () => {
      // This endpoint might not exist in your backend
      // You might need to implement this differently
      // For now, return an empty array
      return [] as SupplierProductWithDetails[]
    },
    enabled: false, // Disable this query since the endpoint doesn't exist
    // TODO: Could be implemented by fetching all suppliers and filtering by product
  })
}

// New hook to get all supplier products by fetching from all suppliers
export const useAllSupplierProducts = () => {
  const { data: suppliers } = useSuppliers()
  
  return useQueries({
    queries: suppliers?.map(supplier => ({
      queryKey: ['supplier-products', 'supplier', supplier.supplier_id],
      queryFn: async () => {
        const response = await api.get<ApiResponse<{
          supplier: Supplier;
          products: Array<{
            product_id: number;
            name: string;
            description: string;
            retail_price: string;
            stock_quantity: number;
            supply_price: string;
            total_supply_value: string;
          }>;
          pagination: any;
        }>>(endpoints.suppliers.getProducts(supplier.supplier_id.toString()))
        
        // Transform the response to match the expected SupplierProductWithDetails format
        const supplierProducts: SupplierProductWithDetails[] = response.data.products.map(product => ({
          supplier_product_id: 0, // This might not be available in the current response
          supplier_id: supplier.supplier_id,
          product_id: product.product_id,
          supply_price: product.supply_price,
          supplier_name: response.data.supplier.name,
          product_name: product.name,
          product_description: product.description,
          retail_price: product.retail_price,
          stock_quantity: product.stock_quantity,
        }))
        
        return supplierProducts
      },
      enabled: !!suppliers,
    })) || [],
    combine: (results: any[]) => {
      const allProducts = results
        .filter((result: any) => result.data)
        .flatMap((result: any) => result.data || [])
      
      return {
        data: allProducts,
        isLoading: results.some((result: any) => result.isLoading),
        error: results.find((result: any) => result.error)?.error,
      }
    },
  })
}

export const useCreateSupplierProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateSupplierProductRequest) => {
      // Use the nested supplier endpoint
      const response = await api.post<ApiResponse<SupplierProduct>>(
        endpoints.suppliers.addProduct(data.supplier_id.toString()),
        { product_id: data.product_id, supply_price: data.supply_price }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-products'] })
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export const useUpdateSupplierProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ supplierId, productId, data }: { supplierId: string; productId: string; data: UpdateSupplierProductRequest }) => {
      // Use the nested supplier endpoint for updating price
      const response = await api.put<ApiResponse<SupplierProduct>>(
        endpoints.suppliers.updatePrice(supplierId, productId),
        { supply_price: data.supply_price }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-products'] })
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export const useDeleteSupplierProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ supplierId, productId }: { supplierId: string; productId: string }) => {
      // Use the nested supplier endpoint for removing product
      const response = await api.delete<ApiResponse<void>>(
        endpoints.suppliers.removeProduct(supplierId, productId)
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-products'] })
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// Form hooks
export const useProductForm = () => {
  return useForm<CreateProductRequest>({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock_quantity: 0,
      category: '',
      barcode: '',
      supplier: '',
    },
  })
}

export const useSaleForm = () => {
  return useForm<CreateSaleRequest>({
    defaultValues: {
      payment_method_id: 1,
      items: [],
    },
  })
}

export const useSupplierForm = () => {
  return useForm<CreateSupplierRequest>({
    defaultValues: {
      name: '',
      contact_info: '',
    },
  })
}

export const useSupplierProductForm = () => {
  return useForm<CreateSupplierProductRequest>({
    defaultValues: {
      supplier_id: 0,
      product_id: 0,
      supply_price: '',
    },
  })
}

export const useStaffForm = () => {
  return useForm<CreateStaffRequest>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      contact_info: '',
      role: 'salesperson',
      hourly_rate: 15.0,
    },
  })
}

// Payment method mapping - updated to match database schema
export const PAYMENT_METHODS = {
  1: 'Cash',
  2: 'Card', 
  3: 'Mobile Money',
} as const

export type PaymentMethodId = keyof typeof PAYMENT_METHODS
