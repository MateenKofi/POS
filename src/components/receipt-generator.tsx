"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/modal"
import { Receipt, Printer, MessageCircle, Share2, CheckCircle2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ReceiptItem {
  name: string
  quantity: number
  unit: string
  price: number
  discount?: number
}

interface ReceiptData {
  saleId: number
  items: ReceiptItem[]
  subtotal: number
  totalDiscount: number
  total: number
  paymentMethod: string
  amountPaid: number
  change: number
  customerPhone?: string
  timestamp: string
}

interface ReceiptGeneratorProps {
  receiptData: ReceiptData
  onClose: () => void
}

type ReceiptMethod = "print" | "sms" | "whatsapp"

export function ReceiptGenerator({ receiptData, onClose }: ReceiptGeneratorProps) {
  const [selectedMethod, setSelectedMethod] = useState<ReceiptMethod>("print")
  const [phoneNumber, setPhoneNumber] = useState(receiptData.customerPhone || "")
  const [isSending, setIsSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Receipt #${receiptData.saleId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 300px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 5px 0; color: #666; }
            .line { border-top: 1px dashed #000; margin: 10px 0; }
            .items { margin: 20px 0; }
            .item { display: flex; justify-content: space-between; margin: 5px 0; }
            .item-name { flex: 1; }
            .item-qty { text-align: right; }
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
            <p>${new Date(receiptData.timestamp).toLocaleString()}</p>
            <p>Receipt #${receiptData.saleId}</p>
          </div>
          <div class="line"></div>
          <div class="items">
            ${receiptData.items.map(item => `
              <div class="item">
                <span class="item-name">${item.name}<br>x${item.quantity} ${item.unit}</span>
                <span class="item-qty">GH₵${((item.price * item.quantity) - (item.discount || 0)).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          <div class="line"></div>
          <div class="totals">
            <div class="total-row"><span>Subtotal:</span><span>GH₵${receiptData.subtotal.toFixed(2)}</span></div>
            ${receiptData.totalDiscount > 0 ? `<div class="total-row"><span>Discount:</span><span>-GH₵${receiptData.totalDiscount.toFixed(2)}</span></div>` : ''}
            <div class="total-row grand-total"><span>Total:</span><span>GH₵${receiptData.total.toFixed(2)}</span></div>
            <div class="total-row"><span>Payment:</span><span>${receiptData.paymentMethod}</span></div>
            ${receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > receiptData.total ? `
              <div class="total-row"><span>Paid:</span><span>GH₵${receiptData.amountPaid.toFixed(2)}</span></div>
              <div class="total-row"><span>Change:</span><span>GH₵${receiptData.change.toFixed(2)}</span></div>
            ` : ''}
          </div>
          <div class="line"></div>
          <div class="footer">
            <p>Thank you for your purchase!</p>
            <p>For returns, please present this receipt</p>
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
  }

  const handleSMS = async () => {
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      alert("Please enter a valid phone number")
      return
    }

    setIsSending(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSending(false)
    setSendSuccess(true)
    setTimeout(() => setSendSuccess(false), 3000)
  }

  const handleWhatsApp = () => {
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      alert("Please enter a valid phone number")
      return
    }

    const receiptText = `🌾 AGRI-FEEDS POS - Receipt #${receiptData.saleId}
${new Date(receiptData.timestamp).toLocaleString()}

Items:
${receiptData.items.map(item => `• ${item.name} x${item.quantity} ${item.unit} - GH₵${((item.price * item.quantity) - (item.discount || 0)).toFixed(2)}`).join('\n')}

Subtotal: GH₵${receiptData.subtotal.toFixed(2)}
${receiptData.totalDiscount > 0 ? `Discount: -GH₵${receiptData.totalDiscount.toFixed(2)}\n` : ''}Total: GH₵${receiptData.total.toFixed(2)}
Payment: ${receiptData.paymentMethod}
${receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > receiptData.total ? `Paid: GH₵${receiptData.amountPaid.toFixed(2)}\nChange: GH₵${receiptData.change.toFixed(2)}` : ''}

Thank you for your purchase!`

    const formattedPhone = phoneNumber.replace(/^0/, '233').replace(/\+/g, '').replace(/-/g, '').replace(/ /g, '')
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(receiptText)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleConfirm = () => {
    switch (selectedMethod) {
      case "print":
        handlePrint()
        break
      case "sms":
        handleSMS()
        break
      case "whatsapp":
        handleWhatsApp()
        break
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-lg sm:text-xl">
          <Receipt className="h-5 w-5" />
          Generate Receipt
        </div>
      }
      size="lg"
    >
      <div className="space-y-4">
          {/* Receipt Preview */}
          <Card className="bg-slate-50">
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg">🌾 AGRI-FEEDS POS</h3>
                <p className="text-xs text-slate-600">Animal Feeds & Agricultural Inputs</p>
                <p className="text-xs text-slate-500">{new Date(receiptData.timestamp).toLocaleString()}</p>
                <Badge variant="outline" className="mt-1">Receipt #{receiptData.saleId}</Badge>
              </div>

              <Separator className="my-2" />

              <div className="space-y-2 text-sm">
                {receiptData.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="flex-1">{item.name} x{item.quantity} {item.unit}</span>
                    <span className="font-medium">GH₵{((item.price * item.quantity) - (item.discount || 0)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-2" />

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>GH₵{receiptData.subtotal.toFixed(2)}</span>
                </div>
                {receiptData.totalDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-GH₵{receiptData.totalDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base">
                  <span>Total:</span>
                  <span>GH₵{receiptData.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Payment Method:</span>
                  <span>{receiptData.paymentMethod}</span>
                </div>
                {receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > receiptData.total && (
                  <>
                    <div className="flex justify-between text-xs">
                      <span>Paid:</span>
                      <span>GH₵{receiptData.amountPaid.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-green-600">
                      <span>Change:</span>
                      <span>GH₵{receiptData.change.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Receipt Method Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Select Receipt Method</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={selectedMethod === "print" ? "default" : "outline"}
                onClick={() => setSelectedMethod("print")}
                className={`flex flex-col gap-1 h-auto py-3 ${selectedMethod === "print" ? "bg-green-600 hover:bg-green-700" : ""}`}
              >
                <Printer className="h-5 w-5" />
                <span className="text-xs">Print</span>
              </Button>
              <Button
                variant={selectedMethod === "sms" ? "default" : "outline"}
                onClick={() => setSelectedMethod("sms")}
                className={`flex flex-col gap-1 h-auto py-3 ${selectedMethod === "sms" ? "bg-green-600 hover:bg-green-700" : ""}`}
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-xs">SMS</span>
              </Button>
              <Button
                variant={selectedMethod === "whatsapp" ? "default" : "outline"}
                onClick={() => setSelectedMethod("whatsapp")}
                className={`flex flex-col gap-1 h-auto py-3 ${selectedMethod === "whatsapp" ? "bg-green-600 hover:bg-green-700" : ""}`}
              >
                <Share2 className="h-5 w-5" />
                <span className="text-xs">WhatsApp</span>
              </Button>
            </div>
          </div>

          {/* Phone Number Input (for SMS/WhatsApp) */}
          {(selectedMethod === "sms" || selectedMethod === "whatsapp") && (
            <div>
              <Label htmlFor="phone">Customer Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+233 XX XXX XXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="text-sm sm:text-base"
              />
              <p className="text-xs text-slate-500 mt-1">
                {selectedMethod === "sms"
                  ? "Enter phone number to send receipt via SMS"
                  : "Enter WhatsApp number to share receipt"}
              </p>
            </div>
          )}

          {/* Success Message */}
          {sendSuccess && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-800">Receipt sent successfully!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 text-sm sm:text-base py-2 sm:py-3"
              disabled={isSending}
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isSending}
              className="flex-1 bg-green-600 hover:bg-green-700 text-sm sm:text-base py-2 sm:py-3"
            >
              {isSending ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : selectedMethod === "print" ? (
                <>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Receipt
                </>
              ) : selectedMethod === "sms" ? (
                <>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send SMS
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Open WhatsApp
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
  )
}
