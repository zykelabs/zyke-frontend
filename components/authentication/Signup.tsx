"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isBrand, setIsBrand] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const router = useRouter()

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setShowAlert(true)
      setTimeout(() => {
        setShowAlert(false)
        router.push("/login")
      }, 3000)
    }, 3000)
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-primary">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>
        <div className="grid gap-6">
          <form onSubmit={onSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username" className="text-primary">Username</Label>
                <Input id="username" placeholder="johndoe" required className="bg-accent text-accent-foreground" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-primary">Email</Label>
                <Input id="email" placeholder="name@example.com" type="email" required className="bg-accent text-accent-foreground" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-primary">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="bg-accent text-accent-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="brand-mode"
                  checked={isBrand}
                  onCheckedChange={setIsBrand}
                />
                <Label htmlFor="brand-mode" className="text-primary">I&apos;m registering as a brand</Label>
              </div>
              {isBrand && (
                <div className="grid gap-2">
                  <Label htmlFor="brand-info" className="text-primary">Brand Information</Label>
                  <Textarea
                    id="brand-info"
                    placeholder="Tell us about your brand, industry, and target audience"
                    className="bg-accent text-accent-foreground"
                  />
                </div>
              )}
              <Button disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </Button>
            </div>
          </form>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <button onClick={() => router.push("/terms")} className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </button>{" "}
          and{" "}
          <button onClick={() => router.push("/privacy")} className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </button>
          .
        </p>
        <div className="flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Already have an account?</p>
          <Button
            variant="link"
            className="text-primary ml-2"
            onClick={() => router.push("/login")}
          >
            Log in
          </Button>
        </div>
      </div>
      {showAlert && (
        <Alert className="fixed bottom-4 right-4 w-auto max-w-sm bg-primary text-primary-foreground">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Account created successfully. Welcome to Zyke!
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}