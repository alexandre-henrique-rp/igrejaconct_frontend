import * as React from "react"

interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

interface ToastContextType {
  toast: (props: ToastProps) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    // Return a mock implementation if not in provider
    return {
      toast: (props: ToastProps) => {
        console.log("Toast:", props)
        alert(props.title || props.description)
      },
      dismiss: () => {}
    }
  }
  return context
}

// Direct toast function for use outside of React components
export function toast(props: ToastProps) {
  console.log("Toast:", props)
  // In a real implementation, this would show a toast notification
  // For now, we'll use alert for simplicity
  alert(props.title || props.description)
}

export { ToastContext }
export type { ToastProps }
