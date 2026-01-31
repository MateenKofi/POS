import { Card, CardContent, Button } from "@/components/custom-components"
import { Badge } from "@/components/ui/badge"
import { Receipt, Download, Send, CheckCircle2, Mail, MessageCircle, XCircle } from "lucide-react"
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
  customerEmail?: string
  timestamp: string
  cashierName?: string
  // For transaction view
  description?: string
  transactionType?: string
  status?: string
  category?: string
  notes?: string
}

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  invoiceData: InvoiceData | null
  showDoneButton?: boolean
}

const PAYMENT_METHOD_ICONS: Record<string, string> = {
  'Cash': '💵',
  'Mobile Money': '📱',
  'Bank Transfer': '🏦',
  'Card': '💳'
}

const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  sale_payment: 'Sale Payment',
  refund: 'Refund',
  expense: 'Expense',
  supplier_payment: 'Supplier Payment',
  cash_deposit: 'Cash Deposit',
  cash_withdrawal: 'Cash Withdrawal',
}

type SendMethod = 'select' | 'email' | 'sms' | null

export const InvoiceModal = ({ isOpen, onClose, invoiceData, showDoneButton = false }: InvoiceModalProps) => {
  const [isSending, setIsSending] = useState(false)
  const [sendMethod, setSendMethod] = useState<SendMethod>(null)
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  // Initialize customer contact from invoice data
  if (invoiceData && !customerEmail && !customerPhone) {
    if (invoiceData.customerEmail) setCustomerEmail(invoiceData.customerEmail)
    if (invoiceData.customerPhone) setCustomerPhone(invoiceData.customerPhone)
  }

  const isTransactionView = invoiceData?.description && !invoiceData.items.some(item => item.name)

  const handleDownload = () => {
    if (!invoiceData) return

    const receiptContent = `
      <html>
        <head>
          <title>Receipt_${invoiceData.saleId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Courier New', Courier, monospace;
              padding: 30px 20px;
              max-width: 320px;
              margin: 0 auto;
              font-size: 13px;
              line-height: 1.4;
              color: #333;
            }
            .header { text-align: center; margin-bottom: 25px; }
            .header h1 { margin: 0; font-size: 20px; color: #2d7a3e; }
            .header p { margin: 4px 0; color: #666; font-size: 11px; }
            .line { border-top: 1px dashed #ccc; margin: 12px 0; }
            .row { display: flex; justify-content: space-between; margin: 6px 0; }
            .label { color: #666; }
            .value { font-weight: 600; }
            .amount { font-size: 18px; color: #2d7a3e; }
            .footer { text-align: center; margin-top: 25px; color: #888; font-size: 10px; }
            .items { margin: 15px 0; }
            .item { margin: 8px 0; }
            @media print {
              body { padding: 20px; }
              @page { margin: 0; size: auto; }
            }
            @page {
              size: 80mm auto;
              margin: 5mm;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🌾 AGRI-FEEDS POS</h1>
            <p>Animal Feeds & Agricultural Inputs</p>
            <p>${new Date(invoiceData.timestamp).toLocaleString()}</p>
            <p><strong>Receipt #${invoiceData.saleId}</strong></p>
            ${invoiceData.cashierName ? `<p>Cashier: ${invoiceData.cashierName}</p>` : ''}
          </div>
          <div class="line"></div>
          ${invoiceData.transactionType ? `
          <div class="row"><span class="label">Type:</span><span class="value">${TRANSACTION_TYPE_LABELS[invoiceData.transactionType] || invoiceData.transactionType}</span></div>
          ` : ''}
          ${invoiceData.status ? `
          <div class="row"><span class="label">Status:</span><span class="value">${invoiceData.status.toUpperCase()}</span></div>
          ` : ''}
          <div class="row"><span class="label">Payment:</span><span class="value">${invoiceData.paymentMethod}</span></div>
          ${!isTransactionView ? `
          <div class="line"></div>
          <div class="items">
            ${invoiceData.items.map(item => `
              <div class="item">
                <div>${item.name}</div>
                <div style="font-size: 11px; color: #888;">x${item.quantity} ${item.unit}</div>
              </div>
              <div style="float: right; margin-top: -20px;">GH₵${((item.price * item.quantity) - (item.discount || 0)).toFixed(2)}</div>
            `).join('')}
          </div>
          ` : `
          <div class="line"></div>
          <p style="margin: 10px 0;">${invoiceData.description}</p>
          `}
          <div class="line"></div>
          ${!isTransactionView ? `
          <div class="row"><span class="label">Subtotal:</span><span class="value">GH₵${invoiceData.subtotal.toFixed(2)}</span></div>
          ${invoiceData.totalDiscount > 0 ? '<div class="row"><span class="label">Discount:</span><span class="value" style="color: #2d7a3e;">-GH₵' + invoiceData.totalDiscount.toFixed(2) + '</span></div>' : ''}
          ` : ''}
          <div class="row amount"><span class="label">TOTAL:</span><span class="value">GH₵${invoiceData.total.toFixed(2)}</span></div>
          ${invoiceData.paymentMethod === 'Cash' && invoiceData.amountPaid > invoiceData.total ? `
            <div class="row"><span class="label">Paid:</span><span class="value">GH₵${invoiceData.amountPaid.toFixed(2)}</span></div>
            <div class="row"><span class="label">Change:</span><span class="value" style="color: #2d7a3e;">GH₵${invoiceData.change.toFixed(2)}</span></div>
          ` : ''}
          <div class="line"></div>
          <div class="footer">
            <p>Thank you for your business!</p>
            <p>For inquiries, please present this receipt</p>
          </div>
        </body>
      </html>
    `

    // Open in new window and trigger print (Save as PDF)
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(receiptContent)
      printWindow.document.close()
      // Wait for content to load, then trigger print
      setTimeout(() => {
        printWindow.focus()
        printWindow.print()
      }, 250)
      toast.success("Select 'Save as PDF' to download the receipt")
    } else {
      toast.error("Please allow popups to download PDF")
    }
  }

  const handleSend = async (method: 'email' | 'sms') => {
    if (!invoiceData) return

    if (method === 'email') {
      if (!customerEmail || customerEmail.trim().length < 5) {
        toast.error("Please enter a valid email address")
        return
      }
    } else {
      if (!customerPhone || customerPhone.trim().length < 10) {
        toast.error("Please enter a valid phone number")
        return
      }
    }

    setIsSending(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    if (method === 'sms') {
      const receiptText = `🌾 AGRI-FEEDS POS - Receipt #${invoiceData.saleId}
${new Date(invoiceData.timestamp).toLocaleString()}

${!isTransactionView ? `Items:
${invoiceData.items.map(item => `• ${item.name} x${item.quantity} ${item.unit} - GH₵${((item.price * item.quantity) - (item.discount || 0)).toFixed(2)}`).join('\n')}

Subtotal: GH₵${invoiceData.subtotal.toFixed(2)}
${invoiceData.totalDiscount > 0 ? `Discount: -GH₵${invoiceData.totalDiscount.toFixed(2)}\n` : ''}` : `Description: ${invoiceData.description}`}
Total: GH₵${invoiceData.total.toFixed(2)}
Payment: ${invoiceData.paymentMethod}

Thank you for your business!`

      const formattedPhone = customerPhone.replace(/^0/, '233').replace(/\+/g, '').replace(/-/g, '').replace(/ /g, '')
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(receiptText)}`
      window.open(whatsappUrl, '_blank')

      toast.success("Receipt sent via WhatsApp")
    } else {
      // Email send simulation
      toast.success(`Receipt sent to ${customerEmail}`)
    }

    setIsSending(false)
    setSendMethod(null)
  }

  if (!invoiceData) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-md shadow-emerald-500/25">
            <Receipt className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-semibold text-slate-800">
              {showDoneButton ? 'Payment Complete' : 'Receipt Details'}
            </span>
            <p className="text-xs text-slate-500 font-mono">
              #{invoiceData.saleId}
            </p>
          </div>
        </div>
      }
      size="md"
    >
      <div className="space-y-4">
        {showDoneButton && (
          <div className="flex items-center justify-center gap-2 py-2 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Payment Successful</span>
          </div>
        )}

        {/* Amount Display */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 text-center">
          <p className="text-sm text-slate-600 mb-1">{isTransactionView ? 'Transaction' : 'Total'} Amount</p>
          <p className="text-3xl font-bold text-green-600">
            GH₵{invoiceData.total.toFixed(2)}
          </p>
          {invoiceData.paymentMethod === 'Cash' && invoiceData.change > 0 && (
            <p className="text-sm text-slate-600 mt-2">
              Change: <span className="font-semibold text-green-600">GH₵{invoiceData.change.toFixed(2)}</span>
            </p>
          )}
        </div>

        {/* Details Card */}
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

            {invoiceData.transactionType && (
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">Type</span>
                <Badge variant="outline" className="bg-slate-100">
                  {TRANSACTION_TYPE_LABELS[invoiceData.transactionType] || invoiceData.transactionType}
                </Badge>
              </div>
            )}

            {invoiceData.status && (
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">Status</span>
                <Badge className={invoiceData.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {invoiceData.status.charAt(0).toUpperCase() + invoiceData.status.slice(1)}
                </Badge>
              </div>
            )}

            {!isTransactionView && invoiceData.items.length > 0 && (
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
            )}

            {isTransactionView && invoiceData.description && (
              <div className="py-2">
                <span className="text-sm text-slate-600 block mb-1">Description</span>
                <p className="text-sm text-slate-800">{invoiceData.description}</p>
              </div>
            )}

            {!isTransactionView && (
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
              </div>
            )}
          </CardContent>
        </Card>

        {/* Send Method Selector */}
        {sendMethod === 'select' && (
          <Card className="border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800">Send Receipt Via</h3>
                <button onClick={() => setSendMethod(null)} className="p-1 hover:bg-slate-100 rounded">
                  <XCircle className="h-4 w-4 text-slate-400" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setSendMethod('email')}
                  variant="outline"
                  className="flex flex-col gap-2 h-auto py-4 border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Mail className="h-5 w-5" />
                  <span className="text-sm font-medium">Email</span>
                </Button>
                <Button
                  onClick={() => setSendMethod('sms')}
                  variant="outline"
                  className="flex flex-col gap-2 h-auto py-4 border-green-200 text-green-600 hover:bg-green-50"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">SMS / WhatsApp</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Email Input Form */}
        {sendMethod === 'email' && (
          <Card className="border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  Send via Email
                </h3>
                <button onClick={() => setSendMethod('select')} className="p-1 hover:bg-slate-100 rounded">
                  <XCircle className="h-4 w-4 text-slate-400" />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="customer@email.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSendMethod('select')}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => handleSend('email')}
                    disabled={isSending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSending ? 'Sending...' : 'Send Email'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SMS Input Form */}
        {sendMethod === 'sms' && (
          <Card className="border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  Send via WhatsApp
                </h3>
                <button onClick={() => setSendMethod(null)} className="p-1 hover:bg-slate-100 rounded">
                  <XCircle className="h-4 w-4 text-slate-400" />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="tel"
                  placeholder="+233 XX XXX XXXX"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSendMethod('select')}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => handleSend('sms')}
                    disabled={isSending}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isSending ? 'Sending...' : 'Send WhatsApp'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {!sendMethod && (
          <>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleDownload}
                className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white rounded-xl h-11"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={() => setSendMethod('select')}
                variant="outline"
                className="flex-1 border-green-600 text-green-600 hover:bg-green-50 rounded-xl h-11"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>

            {showDoneButton && (
              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl h-11"
              >
                Done
              </Button>
            )}
          </>
        )}
      </div>
    </Modal>
  )
}
