"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  showCloseButton?: boolean
  className?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  showCloseButton = true,
  className
}: ModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: "w-[95vw] max-w-sm",
    md: "w-[95vw] max-w-md",
    lg: "w-[95vw] max-w-lg",
    xl: "w-[95vw] max-w-xl",
    full: "w-[95vw] max-w-5xl"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={cn(
          "relative bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-200 slide-in-from-bottom-4 sm:slide-in-from-bottom-0",
          sizeClasses[size],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 shrink-0">
            {title && (
              <div
                id="modal-title"
                className="text-lg sm:text-xl font-semibold text-slate-800 pr-8"
              >
                {title}
              </div>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 sm:static sm:ml-auto p-1 rounded-md hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 sm:p-6 border-t border-slate-200 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
