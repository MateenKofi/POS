"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Modal } from "@/components/modal"
import { Search, Plus, Minus, Trash2, Smartphone, Building2, DollarSign, Loader2, CreditCard } from "lucide-react"
import { useProducts, useCreateSale, PAYMENT_METHODS, type PaymentMethodId } from "@/hooks/useApi"
import { ReceiptGenerator } from "@/components/receipt-generator"
import { type Product as ApiProduct, type CreateSaleRequest } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

interface CartItem extends ApiProduct {
  quantity: number
  unit: 'bag' | 'kg'
  discount?: number
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

// Unit Selector Content Component
function UnitSelectorContent({
  product,
  onConfirm,
  onCancel
}: {
  product: ApiProduct
  onConfirm: (unit: 'bag' | 'kg', quantity: number) => void
  onCancel: () => void
}) {
  const [selectedUnit, setSelectedUnit] = useState<'bag' | 'kg'>(
    product.unit_type === 'bag' ? 'bag' : 'kg'
  )
  const [quantity, setQuantity] = useState(1)

  // Calculate price per selected unit
  const getPricePerUnit = () => {
    const basePrice = parseFloat(product.price)
    if (selectedUnit === 'kg' && product.unit_type === 'bag' && product.weight_per_bag) {
      // Selling bag product by kg - calculate per kg price
      return basePrice / product.weight_per_bag
    }
    if (selectedUnit === 'bag' && product.unit_type === 'loose') {
      // Selling loose product by bag - calculate bag price
      return basePrice * (product.weight_per_bag || 50)
    }
    return basePrice
  }

  const totalPrice = getPricePerUnit() * quantity

  // Calculate how much stock this will use
  const getStockUsed = () => {
    if (selectedUnit === 'bag' && product.weight_per_bag) {
      return quantity * product.weight_per_bag
    }
    return quantity
  }

  const stockUsed = getStockUsed()
  const canAfford = stockUsed <= product.stock_quantity

  // Quick quantity buttons
  const quickQuantities = selectedUnit === 'bag' ? [1, 2, 3, 5, 10] : [0.5, 1, 2, 5, 10, 25, 50]

  return (
    <div className="space-y-4">
      {/* Unit Selection */}
      <div>
        <label className="text-sm font-medium text-slate-700 mb-2 block">Select Unit</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSelectedUnit('bag')}
            className={`p-3 border rounded-lg text-center transition-colors ${selectedUnit === 'bag'
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
          >
            <div className="font-medium">Sell by Bag</div>
            {product.unit_type === 'bag' && product.weight_per_bag && (
              <div className="text-xs text-slate-600">{product.weight_per_bag}kg per bag</div>
            )}
            {product.unit_type === 'loose' && (
              <div className="text-xs text-slate-600">
                ~{product.weight_per_bag || 50}kg per bag
              </div>
            )}
          </button>
          <button
            onClick={() => setSelectedUnit('kg')}
            className={`p-3 border rounded-lg text-center transition-colors ${selectedUnit === 'kg'
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
          >
            <div className="font-medium">Sell by Kg</div>
            <div className="text-xs text-slate-600">Loose quantity</div>
          </button>
        </div>
      </div>

      {/* Quantity Selection */}
      <div>
        <label className="text-sm font-medium text-slate-700 mb-2 block">
          Quantity ({selectedUnit === 'bag' ? 'bags' : 'kg'})
        </label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.max(0.5, quantity - (selectedUnit === 'bag' ? 1 : 0.5)))}
            disabled={quantity <= 0.5}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            step={selectedUnit === 'bag' ? 1 : 0.5}
            min={0.5}
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value) || 0.5)}
            className="text-center"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(quantity + (selectedUnit === 'bag' ? 1 : 0.5))}
            disabled={!canAfford}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick quantity buttons */}
        <div className="flex flex-wrap gap-2 mt-2">
          {quickQuantities.map((qty) => (
            <Button
              key={qty}
              variant="outline"
              size="sm"
              onClick={() => setQuantity(qty)}
              disabled={stockUsed >= product.stock_quantity && qty > quantity}
              className="text-xs"
            >
              {qty}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-slate-50 p-4 rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span>Price per {selectedUnit === 'bag' ? 'bag' : 'kg'}:</span>
          <span className="font-medium">GH₵{getPricePerUnit().toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Quantity:</span>
          <span>{quantity} {selectedUnit === 'bag' ? 'bags' : 'kg'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Stock to use:</span>
          <span className={stockUsed > product.stock_quantity ? 'text-red-600' : 'text-green-600'}>
            {stockUsed} kg / {product.stock_quantity} kg
          </span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span className="text-blue-600">GH₵{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {!canAfford && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          ⚠️ Insufficient stock! Available: {product.stock_quantity} kg
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={() => onConfirm(selectedUnit, quantity)}
          disabled={!canAfford || quantity < 0.5}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  )
}

export function SalesInterface() {
  const { user } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [orderDiscount, setOrderDiscount] = useState(0)
  const [customerPhone, setCustomerPhone] = useState("")
  const [unitSelector, setUnitSelector] = useState<{
    product: ApiProduct | null
    isOpen: boolean
  }>({ product: null, isOpen: false })
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
    // Check if product is expired
    if (product.expiry_date) {
      const expiryDate = new Date(product.expiry_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      expiryDate.setHours(0, 0, 0, 0)

      if (expiryDate < today) {
        alert(`Cannot add expired product: ${product.name}\nExpired on: ${new Date(product.expiry_date).toLocaleDateString()}`)
        return
      }
    }

    // Check if product is out of stock
    if (product.stock_quantity <= 0) {
      alert(`${product.name} is out of stock!`)
      return
    }

    // Open unit selector dialog
    setUnitSelector({ product, isOpen: true })
  }

  const confirmAddToCart = (product: ApiProduct, unit: 'bag' | 'kg', quantity: number) => {
    // Calculate quantity in kg for stock tracking
    const quantityInKg = unit === 'bag' && product.weight_per_bag
      ? quantity * product.weight_per_bag
      : quantity

    // Check if sufficient stock
    if (quantityInKg > product.stock_quantity) {
      alert(`Insufficient stock for ${product.name}!\nAvailable: ${product.stock_quantity} kg\nRequested: ${quantityInKg} kg`)
      return
    }

    // Calculate price for this item
    let itemPrice = parseFloat(product.price)
    if (unit === 'kg' && product.unit_type === 'bag' && product.weight_per_bag) {
      // If selling bag product by kg, calculate per kg price
      itemPrice = parseFloat(product.price) / product.weight_per_bag
    }

    // Check if same product with same unit already exists in cart
    const existingItemIndex = cart.findIndex(
      (item) => item.product_id === product.product_id && item.unit === unit
    )

    if (existingItemIndex !== -1) {
      // Update existing item
      const existingItem = cart[existingItemIndex]
      const newQuantityInKg = existingItem.quantity + quantityInKg

      if (newQuantityInKg > product.stock_quantity) {
        alert(`Insufficient stock for ${product.name}!\nAvailable: ${product.stock_quantity} kg\nTotal in cart: ${newQuantityInKg} kg`)
        return
      }

      const newCart = [...cart]
      newCart[existingItemIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + quantity,
        price: itemPrice.toString()
      }
      setCart(newCart)
    } else {
      // Add new item to cart
      setCart([...cart, {
        ...product,
        quantity,
        unit,
        price: itemPrice.toString(),
        discount: 0,
        unit_type: unit === 'kg' ? 'loose' : 'bag' // Override to match CartItem type
      }])
    }

    setUnitSelector({ product: null, isOpen: false })
  }

  const updateQuantity = (id: number, change: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.product_id === id) {
            const newQuantity = item.quantity + change

            // Check if we have enough stock
            const newQuantityInKg = item.unit === 'bag' && item.weight_per_bag
              ? newQuantity * item.weight_per_bag
              : newQuantity

            if (newQuantity > 0 && newQuantityInKg <= item.stock_quantity) {
              return { ...item, quantity: newQuantity }
            }
          }
          return item
        })
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.product_id !== id))
  }

  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price)
    const itemDiscount = item.discount || 0
    return sum + (price * item.quantity) - itemDiscount
  }, 0)
  const total = Math.max(0, subtotal - orderDiscount)

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
          unit: item.unit,
          price_at_sale: parseFloat(item.price),
          cost_price_at_sale: parseFloat(item.cost_price),
          discount_amount: item.discount || 0,
          batch_number: item.batch_number,
          expiry_date: item.expiry_date
        }))
      }

      // Create sale via API
      const result = await createSaleMutation.mutateAsync(saleData)

      // Create sale record for receipt
      const sale = {
        id: result.sale.sale_id,
        items: cart,
        subtotal,
        tax: 0,
        total,
        totalDiscount: orderDiscount,
        paymentMethod: PAYMENT_METHODS[paymentDetails.method],
        amountPaid: paymentDetails.amount,
        change: paymentDetails.change,
        reference: paymentDetails.reference,
        customerPhone,
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
    setOrderDiscount(0)
    setCustomerPhone("")
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
                {filteredProducts.map((product: ApiProduct) => {
                  // Check if product is expired
                  const isExpired = product.expiry_date ? new Date(product.expiry_date) < new Date() : false
                  // Check if stock is low
                  const isLowStock = product.reorder_level && product.stock_quantity <= product.reorder_level

                  return (
                    <div
                      key={product.product_id}
                      className={`p-3 sm:p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors ${isExpired
                          ? 'border-red-300 bg-red-50 opacity-60'
                          : 'border-slate-200'
                        }`}
                      onClick={() => addToCart(product)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-slate-800 text-sm sm:text-base line-clamp-2">{product.name}</h3>
                        <Badge
                          variant="secondary"
                          className={`text-xs flex-shrink-0 ml-2 ${isLowStock
                              ? 'bg-orange-100 text-orange-800 border-orange-300'
                              : isExpired
                                ? 'bg-red-100 text-red-800 border-red-300'
                                : ''
                            }`}
                        >
                          Stock: {product.stock_quantity} {product.unit_type === 'bag' ? 'kg' : product.unit_type}
                          {isLowStock && ' ⚠️'}
                          {isExpired && ' ❌'}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-base sm:text-lg font-semibold text-blue-600">
                          GH₵{parseFloat(product.price).toFixed(2)}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {product.unit_type === 'bag' ? `${product.weight_per_bag || 0}kg/bag` : 'per kg'}
                        </Badge>
                      </div>
                      {isExpired && (
                        <p className="text-xs text-red-600 mt-2">
                          Expired: {new Date(product.expiry_date!).toLocaleDateString()}
                        </p>
                      )}
                      {isLowStock && !isExpired && (
                        <p className="text-xs text-orange-600 mt-2">
                          Low stock! Reorder when ≤ {product.reorder_level}
                        </p>
                      )}
                    </div>
                  )
                })}
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
                    <div key={`${item.product_id}-${item.unit}`} className="flex items-center justify-between py-2 border-b border-slate-100">
                      <div className="flex-1 min-w-0 mr-2">
                        <h4 className="font-medium text-slate-800 text-xs sm:text-sm line-clamp-1">{item.name}</h4>
                        <div className="flex items-center gap-2">
                          <p className="text-slate-600 text-xs sm:text-sm">
                            GH₵{parseFloat(item.price).toFixed(2)}/{item.unit}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {item.unit === 'bag'
                              ? `${item.weight_per_bag || 50}kg per bag`
                              : 'per kg (loose)'}
                          </Badge>
                        </div>
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
                        <div className="text-center">
                          <span className="text-xs sm:text-sm font-medium">{item.quantity}</span>
                          <span className="text-xs text-slate-600">{item.unit === 'bag' ? ' bag' : ' kg'}</span>
                        </div>
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
                    {orderDiscount > 0 && (
                      <div className="flex justify-between text-xs sm:text-sm text-green-600">
                        <span>Order Discount:</span>
                        <span>-GH₵{orderDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-sm sm:text-lg font-semibold">
                      <span className="text-slate-800">Total:</span>
                      <span className="text-slate-800">GH₵{total.toFixed(2)}</span>
                    </div>
                    {(user?.role === 'admin' || user?.role === 'manager') && (
                      <div className="flex justify-between text-xs sm:text-sm text-green-600">
                        <span>Est. Profit:</span>
                        <span>GH₵{(subtotal - cart.reduce((sum, item) => sum + (parseFloat(item.cost_price) * item.quantity), 0) - orderDiscount).toFixed(2)}</span>
                      </div>
                    )}
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

      {/* Unit Selector Modal */}
      <Modal
        isOpen={unitSelector.isOpen}
        onClose={() => setUnitSelector({ product: null, isOpen: false })}
        title="Select Unit & Quantity"
        size="md"
      >
        {unitSelector.product && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-semibold text-slate-800">{unitSelector.product.name}</h3>
              <p className="text-sm text-slate-600">{unitSelector.product.description}</p>
              <div className="mt-2 text-sm">
                <span className="font-medium">Available Stock:</span> {unitSelector.product.stock_quantity} kg
              </div>
              <div className="mt-1 text-sm">
                <span className="font-medium">Price:</span> GH₵{parseFloat(unitSelector.product.price).toFixed(2)}
                {unitSelector.product.unit_type === 'bag' && unitSelector.product.weight_per_bag
                  ? ` per ${unitSelector.product.weight_per_bag}kg bag`
                  : ' per kg'}
              </div>
            </div>

            <UnitSelectorContent
              product={unitSelector.product}
              onConfirm={(unit, quantity) => confirmAddToCart(unitSelector.product!, unit, quantity)}
              onCancel={() => setUnitSelector({ product: null, isOpen: false })}
            />
          </div>
        )}
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        title="Payment Details"
        size="md"
      >
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
                    id === "2" ? Smartphone : Building2
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

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Order Discount (GH₵)</label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={orderDiscount}
              onChange={(e) => setOrderDiscount(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Customer Phone (Optional)</label>
            <Input
              type="tel"
              placeholder="+233 XX XXX XXXX"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">For SMS/WhatsApp receipts</p>
          </div>

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
        </div>

        <footer className="flex gap-2">
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
        </footer>
      </Modal>

      {/* Receipt Generator */}
      {completedSale && (
        <ReceiptGenerator
          receiptData={{
            saleId: completedSale.id,
            items: completedSale.items.map(item => ({
              name: item.name,
              quantity: item.quantity,
              unit: item.unit,
              price: parseFloat(item.price),
              discount: item.discount
            })),
            subtotal: completedSale.subtotal,
            totalDiscount: completedSale.totalDiscount,
            total: completedSale.total,
            paymentMethod: completedSale.paymentMethod,
            amountPaid: completedSale.amountPaid,
            change: completedSale.change,
            customerPhone: completedSale.customerPhone,
            timestamp: completedSale.timestamp
          }}
          onClose={finalizeSale}
        />
      )}
    </div>
  )
}
