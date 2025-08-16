import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { api, endpoints, type ApiResponse, type Product, type CreateSaleRequest, type Sale } from '@/lib/api'

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
    mutationFn: async (data: Omit<Product, 'product_id'>) => {
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
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
      const response = await api.get<ApiResponse<Sale[]>>(
        `${endpoints.sales.all}?page=${page}&limit=${limit}`
      )
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

// Form hooks
export const useProductForm = () => {
  return useForm<Omit<Product, 'product_id'>>({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock_quantity: 0,
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

// Payment method mapping - updated to match database schema
export const PAYMENT_METHODS = {
  1: 'Cash',
  2: 'Card', 
  3: 'Mobile Money',
} as const

export type PaymentMethodId = keyof typeof PAYMENT_METHODS
