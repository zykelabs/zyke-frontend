"use client";

import { useState, FormEvent } from "react";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isSignInLoading, setIsSignInLoading] = useState(false);
  const [isGoogleSignInLoading, setIsGoogleSignInLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    title: "",
    description: "",
    type: "error" as "success" | "error",
  });

  const router = useRouter();

  const checkBrandVoice = async (accessToken: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/brand_voice_info/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.brandVoice) {
          router.push("/idea-generator");
        } else {
          router.push("/user-type");
        }
      } else if (response.status === 404) {
        router.push("/user-type");
      }
    } catch (error) {
      console.error("Error checking brand voice:", error);
      setAlert({
        show: true,
        title: "Error",
        description:
          "An unexpected error occurred while checking brand voice. Please try again.",
        type: "error",
      });
    }
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setIsSignInLoading(true);

    const form = e.currentTarget as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.ok && !result.error) {
        const session = await fetch("/api/auth/session").then((res) =>
          res.json()
        );
        if (session?.accessToken) await checkBrandVoice(session.accessToken);
      } else {
        setAlert({
          show: true,
          title: "Error",
          description: result?.error || "Failed to sign in.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setAlert({
        show: true,
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsSignInLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSignInLoading(true);
    try {
      const result = await signIn("google", { redirect: false });

      if (result?.ok && !result.error) {
        const session = await fetch("/api/auth/session").then((res) =>
          res.json()
        );
        if (session?.accessToken) await checkBrandVoice(session.accessToken);
      } else {
        setAlert({
          show: true,
          title: "Error",
          description: result?.error || "Failed to sign in with Google.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setAlert({
        show: true,
        title: "Error",
        description: "Failed to sign in with Google. Please try again.",
        type: "error",
      });
    } finally {
      setIsGoogleSignInLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignInLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/request-reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotPasswordEmail }),
        }
      );

      const data = await response.json();
      setAlert({
        show: true,
        title: response.ok ? "Success" : "Error",
        description:
          data.msg ||
          (response.ok
            ? "Password reset email sent."
            : "Failed to send reset email."),
        type: response.ok ? "success" : "error",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      setAlert({
        show: true,
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsSignInLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {/* <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center space-x-2"
          onClick={handleGoogleSignIn}
          disabled={isGoogleSignInLoading || isSignInLoading}
        >
          {isGoogleSignInLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              <span>Sign in with Google</span>
            </>
          )}
        </Button> */}

        {/* <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div> */}

        <form className="space-y-4" onSubmit={handleSignIn}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                required
                className="w-full px-3 py-2 border rounded-md"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="text-sm p-0">
                  Forgot password?
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Forgot Password</DialogTitle>
                  <DialogDescription>
                    Enter your email address and we&apos;ll send you a link to
                    reset your password.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgotPasswordEmail">Email</Label>
                    <Input
                      id="forgotPasswordEmail"
                      type="email"
                      placeholder="name@example.com"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSignInLoading || isGoogleSignInLoading}
                  >
                    {isSignInLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSignInLoading || isGoogleSignInLoading}
          >
            {isSignInLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>

      {alert.show && (
        <Alert
          className="fixed bottom-4 right-4 w-auto max-w-sm"
          variant={alert.type === "success" ? "default" : "destructive"}
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
