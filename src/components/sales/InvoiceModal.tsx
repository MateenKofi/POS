import { Card, CardContent, Button } from "@/components/custom-components"
import { Receipt, Printer, Send, X, CheckCircle2 } from "lucide-react"
import { Modal } from "@/components/modal"
import { toast } from "sonner"
import { useState } from "react"

export interface InvoiceItem {
  name: string
  quantity: number
  unit: string
  price: number
  discount?: number
}

export interface InvoiceData {
  saleId: number
  items: InvoiceItem[]
  subtotal: number
  totalDiscount: number
  total: number
  paymentMethod: string
  amountPaid: number
  change: number
  customerPhone?: string
  timestamp: string
  cashierName?: string
}

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  invoiceData: InvoiceData | null
}

const PAYMENT_METHOD_ICONS: Record<string, string> = {
  'Cash': '💵',
  'Mobile Money': '📱',
  'Bank Transfer': '🏦',
  'Card': '💳'
}

export function InvoiceModal({ isOpen, onClose, invoiceData }: InvoiceModalProps) {
  const [isSending, setIsSending] = useState(false)

  const handlePrint = () => {
    if (!invoiceData) return

    const printContent = `
      <html>
        <head>
          <title>Invoice #${invoiceData.saleId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 350px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 5px 0; color: #666; }
            .line { border-top: 1px dashed #000; margin: 10px 0; }
            .items { margin: 20px 0; }
            .item { display: flex; justify-content: space-between; margin: 5px 0; }
            .totals { margin-top: 20px; }
            .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
            .grand-total { font-weight: bold; font-size: 18px; margin-top: 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🌾 AGRI-FEEDS POS</h1>
            <p>Animal Feeds & Agricultural Inputs</p>
            <p>${new Date(invoiceData.timestamp).toLocaleString()}</p>
            <p>Invoice #${invoiceData.saleId}</p>
            ${invoiceData.cashierName ? `<p>Cashier: ${invoiceData.cashierName}</p>` : ''}
          </div>
          <div class="line"></div>
          <div class="items">
            ${invoiceData.items.map(item => `
              <div class="item">
                <span>${item.name}<br><small>x${item.quantity} ${item.unit}</small></span>
                <span>GH₵${((item.price * item.quantity) - (item.discount || 0)).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          <div class="line"></div>
          <div class="totals">
            <div class="total-row"><span>Subtotal:</span><span>GH₵${invoiceData.subtotal.toFixed(2)}</span></div>
            ${invoiceData.totalDiscount > 0 ? `<div class="total-row"><span>Discount:</span><span>-GH₵${invoiceData.totalDiscount.toFixed(2)}</span></div>` : ''}
            <div class="total-row grand-total"><span>Total:</span><span>GH₵${invoiceData.total.toFixed(2)}</span></div>
            <div class="total-row"><span>Payment:</span><span>${invoiceData.paymentMethod}</span></div>
            ${invoiceData.paymentMethod === 'Cash' && invoiceData.amountPaid > invoiceData.total ? `
              <div class="total-row"><span>Paid:</span><span>GH₵${invoiceData.amountPaid.toFixed(2)}</span></div>
              <div class="total-row"><span>Change:</span><span>GH₵${invoiceData.change.toFixed(2)}</span></div>
            ` : ''}
          </div>
          <div class="line"></div>
          <div class="footer">
            <p>Thank you for your purchase!</p>
            <p>For returns, please present this invoice</p>
          </div>
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
    toast.success("Invoice sent to printer")
  }

  const handleSendReceipt = async () => {
    if (!invoiceData) return

    const phone = invoiceData.customerPhone
    if (!phone || phone.trim().length < 10) {
      toast.error("No customer phone number available")
      return
    }

    setIsSending(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    const receiptText = `🌾 AGRI-FEEDS POS - Invoice #${invoiceData.saleId}
${new Date(invoiceData.timestamp).toLocaleString()}

Items:
${invoiceData.items.map(item => `• ${item.name} x${item.quantity} ${item.unit} - GH₵${((item.price * item.quantity) - (item.discount || 0)).toFixed(2)}`).join('\n')}

Subtotal: GH₵${invoiceData.subtotal.toFixed(2)}
${invoiceData.totalDiscount > 0 ? `Discount: -GH₵${invoiceData.totalDiscount.toFixed(2)}\n` : ''}Total: GH₵${invoiceData.total.toFixed(2)}
Payment: ${invoiceData.paymentMethod}
${invoiceData.paymentMethod === 'Cash' && invoiceData.amountPaid > invoiceData.total ? `Paid: GH₵${invoiceData.amountPaid.toFixed(2)}\nChange: GH₵${invoiceData.change.toFixed(2)}` : ''}

Thank you for your purchase!`

    const formattedPhone = phone.replace(/^0/, '233').replace(/\+/g, '').replace(/-/g, '').replace(/ /g, '')
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(receiptText)}`
    window.open(whatsappUrl, '_blank')

    setIsSending(false)
    toast.success("Receipt sent via WhatsApp")
  }

  if (!invoiceData) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="md">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg shadow-emerald-500/25">
              <Receipt className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Payment Complete</h2>
              <p className="text-sm text-slate-500 font-mono">
                Invoice #{invoiceData.saleId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Success Badge */}
        <div className="flex items-center justify-center gap-2 py-2 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-700">Payment Successful</span>
        </div>

        {/* Amount Display */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 text-center">
          <p className="text-sm text-slate-600 mb-1">Total Amount</p>
          <p className="text-3xl font-bold text-green-600">
            GH₵{invoiceData.total.toFixed(2)}
          </p>
          {invoiceData.paymentMethod === 'Cash' && invoiceData.change > 0 && (
            <p className="text-sm text-slate-600 mt-2">
              Change: <span className="font-semibold text-green-600">GH₵{invoiceData.change.toFixed(2)}</span>
            </p>
          )}
        </div>

        {/* Invoice Details Card */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Date & Time</span>
              <span className="text-sm font-medium text-slate-800">
                {new Date(invoiceData.timestamp).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Payment Method</span>
              <div className="flex items-center gap-2">
                <span>{PAYMENT_METHOD_ICONS[invoiceData.paymentMethod] || '💳'}</span>
                <span className="text-sm font-medium text-slate-800">{invoiceData.paymentMethod}</span>
              </div>
            </div>

            {invoiceData.cashierName && (
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">Cashier</span>
                <span className="text-sm font-medium text-slate-800">{invoiceData.cashierName}</span>
              </div>
            )}

            {invoiceData.customerPhone && (
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">Customer Phone</span>
                <span className="text-sm font-medium text-slate-800">{invoiceData.customerPhone}</span>
              </div>
            )}

            <div className="py-2">
              <span className="text-sm text-slate-600 block mb-2">Items</span>
              <div className="space-y-2">
                {invoiceData.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">
                      {item.name} <span className="text-slate-500">x{item.quantity} {item.unit}</span>
                    </span>
                    <span className="font-medium text-slate-800">
                      GH₵{((item.price * item.quantity) - (item.discount || 0)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="text-slate-800">GH₵{invoiceData.subtotal.toFixed(2)}</span>
              </div>
              {invoiceData.totalDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-GH₵{invoiceData.totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-1">
                <span>Total</span>
                <span className="text-green-600">GH₵{invoiceData.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handlePrint}
            className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white rounded-xl h-11"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Invoice
          </Button>
          <Button
            onClick={handleSendReceipt}
            disabled={isSending || !invoiceData.customerPhone}
            variant="outline"
            className="flex-1 border-green-600 text-green-600 hover:bg-green-50 rounded-xl h-11 disabled:opacity-50"
          >
            {isSending ? (
              <>
                <div className="h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Receipt
              </>
            )}
          </Button>
        </div>

        {/* Done Button */}
        <Button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl h-11"
        >
          Done
        </Button>
      </div>
    </Modal>
  )
}
