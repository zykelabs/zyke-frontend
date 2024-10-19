"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Mail, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyOTPPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState({ title: "", description: "", type: "" })
  const router = useRouter()
  const searchParams = useSearchParams()
  const otpInputs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
    if (otpInputs.current[0]) {
      otpInputs.current[0].focus()
    }
  }, [searchParams])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      if (value !== "" && index < 5) {
        otpInputs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpInputs.current[index - 1]?.focus()
    }
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp: otp.join("") })
      })

      const data = await response.json()

      if (response.ok) {
        setAlertMessage({
          title: "Success",
          description: data.msg || "Email verified successfully.",
          type: "success"
        })
        setShowAlert(true)
        setTimeout(() => {
          setShowAlert(false)
          router.push("/signin")
        }, 3000)
      } else {
        setAlertMessage({
          title: "Error",
          description: data.msg || "Failed to verify email.",
          type: "error"
        })
        setShowAlert(true)
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      setAlertMessage({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        type: "error"
      })
      setShowAlert(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-primary">Verify Your Email</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-white"
                  readOnly
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-medium text-gray-700">OTP</Label>
              <div className="flex justify-between space-x-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => { otpInputs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    pattern="\d{1}"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold bg-white"
                  />
                ))}
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            variant="link"
            className="text-primary flex items-center"
            onClick={() => router.push("/signin")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
          </Button>
        </CardFooter>
      </Card>
      {showAlert && (
        <Alert className="fixed bottom-4 right-4 w-auto max-w-sm" variant={alertMessage.type as "default" | "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{alertMessage.title}</AlertTitle>
          <AlertDescription>
            {alertMessage.description}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}