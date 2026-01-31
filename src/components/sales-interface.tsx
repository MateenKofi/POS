"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/custom-components"
import { Modal } from "@/components/modal"
import { Loader2, AlertTriangle, CreditCard } from "lucide-react"
import { useProducts, useCreateSale } from "@/hooks/useApi"
import { type CreateSaleRequest } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { InvoiceModal } from "./sales/InvoiceModal"


// Sales sub-components
import { SalesHeader } from "./sales/SalesHeader"
import { QuickStats } from "./sales/QuickStats"
import { ProductGrid } from "./sales/ProductGrid"
import { CartSection } from "./sales/CartSection"
import { UnitSelectorModal } from "./sales/UnitSelectorModal"
import { PaymentModalContent, PaymentModalFooter } from "./sales/PaymentModal"
import type { CartItem, PaymentDetails, CompletedSale, UnitSelectorState } from "./sales/types"

export function SalesInterface() {
  const { user } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [orderDiscount, setOrderDiscount] = useState(0)
  const [customerPhone, setCustomerPhone] = useState("")
  const [unitSelector, setUnitSelector] = useState<UnitSelectorState>({
    product: null,
    isOpen: false
  })
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    method: 1,
    amount: 0,
    change: 0,
    reference: ""
  })
  const [showInvoice, setShowInvoice] = useState(false)
  const [invoiceData, setInvoiceData] = useState<CompletedSale | null>(null)

  // API hooks
  const { data: productsData, isLoading: isProductsLoading, error: productsError, refetch: refetchProducts } = useProducts(1, 100)
  const createSaleMutation = useCreateSale()

  // Get available products from API
  const availableProducts = productsData || []

  // Helper function to check if product is expired
  const isProductExpired = (product: typeof availableProducts[0]) => {
    if (!product?.expiry_date) return false
    const expiryDate = new Date(product.expiry_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    expiryDate.setHours(0, 0, 0, 0)
    return expiryDate < today
  }

  // Filter products
  const filteredProducts = availableProducts
    .filter((product) => !isProductExpired(product))
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_id.toString().includes(searchTerm)
    )

  // Refetch products after payment completion
  useEffect(() => {
    if (invoiceData && showInvoice) {
      const timer = setTimeout(() => {
        refetchProducts()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [invoiceData, showInvoice, refetchProducts])

  // Cart functions
  const addToCart = (product: typeof availableProducts[0]) => {
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

    if (product.stock_quantity <= 0) {
      alert(`${product.name} is out of stock!`)
      return
    }

    setUnitSelector({ product, isOpen: true })
  }

  const confirmAddToCart = (product: typeof availableProducts[0], unit: 'bag' | 'kg', quantity: number) => {
    const quantityInKg = unit === 'bag' && product.weight_per_bag
      ? quantity * product.weight_per_bag
      : quantity

    if (quantityInKg > product.stock_quantity) {
      alert(`Insufficient stock for ${product.name}!\nAvailable: ${product.stock_quantity} kg\nRequested: ${quantityInKg} kg`)
      return
    }

    let itemPrice = parseFloat(product.price)
    if (unit === 'kg' && product.unit_type === 'bag' && product.weight_per_bag) {
      itemPrice = parseFloat(product.price) / product.weight_per_bag
    }

    const existingItemIndex = cart.findIndex(
      (item) => item.product_id === product.product_id && item.unit === unit
    )

    if (existingItemIndex !== -1) {
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
      setCart([...cart, {
        ...product,
        quantity,
        unit,
        price: itemPrice.toString(),
        discount: 0,
        unit_type: unit === 'kg' ? 'loose' : 'bag'
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

  // Payment functions
  const handlePaymentMethodChange = (method: string) => {
    const methodId = parseInt(method) as PaymentDetails["method"]
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

      const result = await createSaleMutation.mutateAsync(saleData)

      const sale = {
        id: result.sale.sale_id,
        items: cart,
        subtotal,
        tax: 0,
        total,
        totalDiscount: orderDiscount,
        paymentMethod: ["Cash", "Mobile Money", "Bank Transfer"][paymentDetails.method - 1],
        amountPaid: paymentDetails.amount,
        change: paymentDetails.change,
        reference: paymentDetails.reference,
        customerPhone,
        timestamp: new Date().toISOString(),
        status: "completed",
        apiResponse: result
      }

      setInvoiceData(sale)
      setShowPaymentDialog(false)
      setShowInvoice(true)
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
    setShowInvoice(false)
    setInvoiceData(null)
  }

  const openPaymentDialog = () => {
    if (cart.length === 0) {
      alert("Please add items to cart before proceeding to payment")
      return
    }
    setShowPaymentDialog(true)
  }

  // Loading and error states
  if (isProductsLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-500 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading products...</p>
        </div>
      </div>
    )
  }

  if (productsError) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-red-600 font-medium mb-4">Error loading products. Please try again later.</p>
          <Button onClick={() => refetchProducts()} className="rounded-xl">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6 max-w-[1800px] mx-auto">
      <SalesHeader />
      <div className="mb-6">
        <QuickStats availableProducts={availableProducts} cartItemCount={cart.length} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Product Selection */}
        <div className="xl:col-span-2">
          <ProductGrid
            filteredProducts={filteredProducts}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onProductClick={addToCart}
          />
        </div>

        {/* Shopping Cart */}
        <div className="order-first xl:order-last">
          <CartSection
            cart={cart}
            subtotal={subtotal}
            total={total}
            orderDiscount={orderDiscount}
            userRole={user?.role}
            isPending={createSaleMutation.isPending}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            onCheckout={openPaymentDialog}
          />
        </div>
      </div>

      {/* Unit Selector Modal */}
      <UnitSelectorModal
        isOpen={unitSelector.isOpen}
        product={unitSelector.product}
        onClose={() => setUnitSelector({ product: null, isOpen: false })}
        onConfirm={confirmAddToCart}
      />

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        title={<span className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-green-500" />Payment Details</span>}
        size="md"
      >
        <PaymentModalContent
          paymentDetails={{
            ...paymentDetails,
            method: paymentDetails.method as 1 | 2 | 3
          }}
          total={total}
          orderDiscount={orderDiscount}
          customerPhone={customerPhone}
          userRole={user?.role}
          isPending={createSaleMutation.isPending}
          onPaymentMethodChange={handlePaymentMethodChange}
          onCashAmountChange={handleCashAmountChange}
          onReferenceChange={(val) => setPaymentDetails(prev => ({ ...prev, reference: val }))}
          onPhoneChange={setCustomerPhone}
          onDiscountChange={setOrderDiscount}
          onCancel={() => setShowPaymentDialog(false)}
          onConfirm={() => { }}
        />
        <PaymentModalFooter
          paymentDetails={{
            method: paymentDetails.method as 1 | 2 | 3
          }}
          total={total}
          isPending={createSaleMutation.isPending}
          onCancel={() => setShowPaymentDialog(false)}
          onConfirm={processPayment}
        />
      </Modal>

      {/* Invoice Modal */}
      {invoiceData && (
        <InvoiceModal
          isOpen={showInvoice}
          onClose={finalizeSale}
          invoiceData={{
            saleId: invoiceData.id,
            items: invoiceData.items.map(item => ({
              name: item.name,
              quantity: item.quantity,
              unit: item.unit,
              price: parseFloat(item.price),
              discount: item.discount
            })),
            subtotal: invoiceData.subtotal,
            totalDiscount: invoiceData.totalDiscount,
            total: invoiceData.total,
            paymentMethod: invoiceData.paymentMethod,
            amountPaid: invoiceData.amountPaid,
            change: invoiceData.change,
            customerPhone: invoiceData.customerPhone,
            timestamp: invoiceData.timestamp,
            cashierName: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : undefined
          }}
        />
      )}
    </div>
  )
}
