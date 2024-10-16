"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const router = useRouter()

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowAlert(true)
      setTimeout(() => {
        setShowAlert(false)
        // In a real application, you would not redirect immediately
        // Instead, you'd show a message asking the user to check their email
        router.push("/reset-password")
      }, 3000)
    }, 2000)
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-primary">Forgot Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <div className="grid gap-6">
          <form onSubmit={onSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-primary">Email</Label>
                <Input id="email" placeholder="name@example.com" type="email" required className="bg-accent text-accent-foreground" />
              </div>
              <Button disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
              </Button>
            </div>
          </form>
        </div>
        <div className="flex items-center justify-center">
          <Button
            variant="link"
            className="text-primary"
            onClick={() => router.push("/login")}
          >
            Back to Login
          </Button>
        </div>
      </div>
      {showAlert && (
        <Alert className="fixed bottom-4 right-4 w-auto max-w-sm bg-primary text-primary-foreground">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            If an account exists for that email, we've sent a password reset link.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}