import { createContext, useContext, type ReactNode } from "react"
import { toast, Toaster } from "sonner"

interface ToastContextValue {
  success: (message: string, options?: { description?: string }) => void
  error: (message: string, options?: { description?: string }) => void
  info: (message: string, options?: { description?: string }) => void
  warning: (message: string, options?: { description?: string }) => void
  promise: <T,>(
    promise: Promise<T>,
    options: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: unknown) => string)
    }
  ) => void
  dismiss: () => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const toastApi: ToastContextValue = {
    success: (message, options) => {
      if (options?.description) {
        toast.success(message, { description: options.description })
      } else {
        toast.success(message)
      }
    },
    error: (message, options) => {
      if (options?.description) {
        toast.error(message, { description: options.description })
      } else {
        toast.error(message)
      }
    },
    info: (message, options) => {
      if (options?.description) {
        toast.info(message, { description: options.description })
      } else {
        toast.info(message)
      }
    },
    warning: (message, options) => {
      if (options?.description) {
        toast.warning(message, { description: options.description })
      } else {
        toast.warning(message)
      }
    },
    promise: (promise, options) => {
      toast.promise(promise, options)
    },
    dismiss: () => {
      toast.dismiss()
    },
  }

  return (
    <ToastContext.Provider value={toastApi}>
      {children}
      <Toaster position="top-right" richColors />
    </ToastContext.Provider>
  )
}
