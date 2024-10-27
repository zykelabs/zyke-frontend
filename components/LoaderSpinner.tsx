"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SimpleFastLoaderProps {
  className?: string
}

export default function SimpleFastLoader({ className }: SimpleFastLoaderProps = {}) {
  return (
    <div className={cn("flex flex-col items-center justify-center h-screen", className)}>
      <div className="relative">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 bg-primary/10 rounded-full animate-ping" />
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground animate-pulse">Loading...</p>
    </div>
  )
}