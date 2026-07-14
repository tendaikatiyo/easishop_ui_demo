"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CheckCircle, CircleInfo, Loader, TriangleWarning, XCircle } from "reicon-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: (
          <CheckCircle size={16} aria-hidden />
        ),
        info: (
          <CircleInfo size={16} aria-hidden />
        ),
        warning: (
          <TriangleWarning size={16} aria-hidden />
        ),
        error: (
          <XCircle size={16} aria-hidden />
        ),
        loading: (
          <Loader size={16} className="animate-spin" aria-hidden />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
