"use client"

import { ToastProvider, ToastViewport } from "@radix-ui/react-toast"
import { ReactNode } from "react"

interface ProviderProps {
  children: ReactNode;
}

export function CustomToastProvider({ children }: ProviderProps) {
  return (
    <ToastProvider swipeDirection="right" duration={5000}>
      {children}
      <ToastViewport className="fixed bottom-0 right-0 z-50 m-4 w-[320px] max-w-full" />
    </ToastProvider>
  )
}
