"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Plus, Minus, Trash2, CreditCard, DollarSign, Receipt, Loader2 } from "lucide-react"
import { useProducts, useCreateSale, PAYMENT_METHODS, type PaymentMethodId } from "@/hooks/useApi"
import { type Product as ApiProduct, type CreateSaleRequest } from "@/lib/api"

interface CartItem extends ApiProduct {
  quantity: number
}

interface PaymentDetails {
  method: PaymentMethodId
  amount: number
  change: number
  reference?: string
}

interface CompletedSale {
  id: number
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  amountPaid: number
  change: number
  reference?: string
  timestamp: string
  status: string
  apiResponse: unknown
}

export function SalesInterface() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    method: 1,
    amount: 0,
    change: 0,
    reference: ""
  })
  const [showReceipt, setShowReceipt] = useState(false)
  const [completedSale, setCompletedSale] = useState<CompletedSale | null>(null)

  // API hooks
  const { data: productsData, isLoading: isProductsLoading, error: productsError, refetch: refetchProducts } = useProducts(1, 100)
  const createSaleMutation = useCreateSale()

  // Get available products from API
  const availableProducts = productsData || []
  
  // Frontend search implementation - filter products based on search term
  const filteredProducts = availableProducts.filter((product: ApiProduct) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_id.toString().includes(searchTerm)
  )

  // Refetch products after payment completion to get updated stock levels
  useEffect(() => {
    if (completedSale && showReceipt) {
      // Small delay to ensure backend has processed the sale
      const timer = setTimeout(() => {
        refetchProducts()
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [completedSale, showReceipt, refetchProducts])

  // Handle API errors
  const handleRetry = () => {
    refetchProducts()
  }

  const addToCart = (product: ApiProduct) => {
    const existingItem = cart.find((item) => item.product_id === product.product_id)
    if (existingItem) {
      setCart(cart.map((item) => 
        item.product_id === product.product_id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (id: number, change: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.product_id === id) {
            const newQuantity = item.quantity + change
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
          }
          return item
        })
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.product_id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  const handlePaymentMethodChange = (method: string) => {
    const methodId = parseInt(method) as PaymentMethodId
    setPaymentDetails(prev => ({
      ...prev,
      method: methodId,
      amount: methodId === 1 ? 0 : total,
      change: 0
    }))
  }

  const handleCashAmountChange = (amount: string) => {
    const cashAmount = parseFloat(amount) || 0
    const change = cashAmount - total
    setPaymentDetails(prev => ({
      ...prev,
      amount: cashAmount,
      change: change >= 0 ? change : 0
    }))
  }

  const processPayment = async () => {
    if (paymentDetails.method === 1 && paymentDetails.amount < total) {
      alert("Cash amount must be greater than or equal to total")
      return
    }

    if (!paymentDetails.method) {
      alert("Please select a payment method")
      return
    }

    try {
      // Prepare sale data for API
      const saleData: CreateSaleRequest = {
        payment_method_id: paymentDetails.method,
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_sale: parseFloat(item.price)
        }))
      }

      // Create sale via API
      const result = await createSaleMutation.mutateAsync(saleData)
      
      // Create sale record for receipt
      const sale = {
        id: result.sale.sale_id,
        items: cart,
        subtotal,
        tax,
        total,
        paymentMethod: PAYMENT_METHODS[paymentDetails.method],
        amountPaid: paymentDetails.amount,
        change: paymentDetails.change,
        reference: paymentDetails.reference,
        timestamp: new Date().toISOString(),
        status: "completed",
        apiResponse: result
      }

      setCompletedSale(sale)
      setShowPaymentDialog(false)
      setShowReceipt(true)
      
      if (process.env.NODE_ENV === 'development') {
      console.log("Sale completed via API:", result)
    }
    } catch (error) {
      console.error("Error creating sale:", error)
      alert("Failed to process payment. Please try again.")
    }
  }

  const finalizeSale = () => {
    setCart([])
    setPaymentDetails({
      method: 1,
      amount: 0,
      change: 0,
      reference: ""
    })
    setShowReceipt(false)
    setCompletedSale(null)
  }

  const openPaymentDialog = () => {
    if (cart.length === 0) {
      alert("Please add items to cart before proceeding to payment")
      return
    }
    setShowPaymentDialog(true)
  }

  if (isProductsLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading products...</span>
        </div>
      </div>
    )
  }

  if (productsError) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          <p>Error loading products. Please try again later.</p>
          <Button onClick={handleRetry} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Sales Terminal</h1>
        <p className="text-sm sm:text-base text-slate-600">Streamline your checkout process</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Product Selection */}
        <div className="xl:col-span-2">
          <Card className="border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl text-slate-800">Select Products</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm sm:text-base"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-3 sm:gap-4">
                {filteredProducts.map((product: ApiProduct) => (
                  <div
                    key={product.product_id}
                    className="p-3 sm:p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => addToCart(product)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-slate-800 text-sm sm:text-base line-clamp-2">{product.name}</h3>
                      <Badge variant="secondary" className="text-xs flex-shrink-0 ml-2">
                        Stock: {product.stock_quantity}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mb-2 line-clamp-2">{product.description}</p>
                    <p className="text-base sm:text-lg font-semibold text-blue-600">GH₵{parseFloat(product.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shopping Cart */}
        <div className="order-first xl:order-last">
          <Card className="border-slate-200 sticky top-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl text-slate-800">Current Sale</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {cart.length === 0 ? (
                <p className="text-slate-500 text-center py-6 sm:py-8 text-sm sm:text-base">No items in cart</p>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {cart.map((item) => (
                    <div key={item.product_id} className="flex items-center justify-between py-2 border-b border-slate-100">
                      <div className="flex-1 min-w-0 mr-2">
                        <h4 className="font-medium text-slate-800 text-xs sm:text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-slate-600 text-xs sm:text-sm">GH₵{parseFloat(item.price).toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-transparent"
                          onClick={() => updateQuantity(item.product_id, -1)}
                        >
                          <Minus className="h-2 w-2 sm:h-3 sm:w-3" />
                        </Button>
                        <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-transparent"
                          onClick={() => updateQuantity(item.product_id, 1)}
                        >
                          <Plus className="h-2 w-2 sm:h-3 sm:w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-red-600 hover:text-red-700"
                          onClick={() => removeFromCart(item.product_id)}
                        >
                          <Trash2 className="h-2 w-2 sm:h-3 sm:w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-slate-600">Subtotal:</span>
                      <span className="text-slate-800">GH₵{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-slate-600">Tax (8%):</span>
                      <span className="text-slate-800">GH₵{tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm sm:text-lg font-semibold">
                      <span className="text-slate-800">Total:</span>
                      <span className="text-slate-800">GH₵{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={openPaymentDialog} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 mt-4 text-sm sm:text-base py-2 sm:py-3"
                    disabled={createSaleMutation.isPending}
                  >
                    {createSaleMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="h-4 w-4" />
                    )}
                    {createSaleMutation.isPending ? "Processing..." : "Proceed to Payment"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Payment Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Payment Method</label>
              <Select value={paymentDetails.method.toString()} onValueChange={handlePaymentMethodChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                                     {Object.entries(PAYMENT_METHODS).map(([id, label]) => {
                     const Icon = id === "1" ? DollarSign : 
                                  id === "2" ? CreditCard : DollarSign
                     return (
                       <SelectItem key={id} value={id}>
                         <div className="flex items-center gap-2">
                           <Icon className="h-4 w-4" />
                           {label}
                         </div>
                       </SelectItem>
                     )
                   })}
                </SelectContent>
              </Select>
            </div>

            {paymentDetails.method === 1 && (
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Cash Amount</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter cash amount"
                  value={paymentDetails.amount || ""}
                  onChange={(e) => handleCashAmountChange(e.target.value)}
                />
                {paymentDetails.change > 0 && (
                  <p className="text-sm text-green-600 mt-1">Change: GH₵{paymentDetails.change.toFixed(2)}</p>
                )}
                {paymentDetails.amount > 0 && paymentDetails.amount < total && (
                  <p className="text-sm text-red-600 mt-1">Insufficient amount</p>
                )}
              </div>
            )}

            {paymentDetails.method !== 1 && (
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Reference/Transaction ID</label>
                <Input
                  placeholder="Enter reference number"
                  value={paymentDetails.reference || ""}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, reference: e.target.value }))}
                />
              </div>
            )}

            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm mb-1">
                <span>Total Amount:</span>
                <span className="font-semibold">GH₵{total.toFixed(2)}</span>
              </div>
              {paymentDetails.method === 1 && paymentDetails.amount > 0 && (
                <>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Cash Received:</span>
                    <span>GH₵{paymentDetails.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Change:</span>
                    <span className={paymentDetails.change >= 0 ? "text-green-600" : "text-red-600"}>
                      GH₵{paymentDetails.change.toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPaymentDialog(false)}
                className="flex-1"
                disabled={createSaleMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={processPayment}
                                  disabled={
                    createSaleMutation.isPending || 
                    (paymentDetails.method === 1 && paymentDetails.amount < total)
                  }
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {createSaleMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Process Payment"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Receipt className="h-5 w-4" />
              Sale Receipt
            </DialogTitle>
          </DialogHeader>
          {completedSale && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">Thank you for your purchase!</h3>
                  <p className="text-sm text-slate-600">Transaction ID: {completedSale.id}</p>
                  <p className="text-xs text-slate-500">{new Date(completedSale.timestamp).toLocaleString()}</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  {completedSale.items.map((item: CartItem) => (
                    <div key={item.product_id} className="flex justify-between">
                      <span>{item.name} x{item.quantity}</span>
                      <span>GH₵{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-3" />
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>GH₵{completedSale.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>GH₵{completedSale.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>GH₵{completedSale.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="capitalize">{completedSale.paymentMethod}</span>
                  </div>
                  {completedSale.amountPaid > completedSale.total && (
                    <div className="flex justify-between">
                      <span>Change:</span>
                      <span className="text-green-600">GH₵{completedSale.change.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <Button onClick={finalizeSale} className="w-full bg-green-600 hover:bg-green-700">
                Complete Sale
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
