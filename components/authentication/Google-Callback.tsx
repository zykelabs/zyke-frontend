"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function GoogleCallback() {
  const router = useRouter()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const accessToken = urlParams.get("access_token")

    if (accessToken) {
      // Store the access token
      localStorage.setItem("access_token", accessToken)
      // Redirect to dashboard
      router.push("/dashboard")
    } else {
      // Handle error
      router.push("/signin")
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Processing...</p>
    </div>
  )
}
