// ProtectedRoute.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import LoaderSpinner from "./LoaderSpinner";

interface ProtectedRouteProps {
  children: ReactNode;
  requireBrandVoice?: boolean;
}

export default function ProtectedRoute({
  children,
  requireBrandVoice = false,
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasBrandVoice, setHasBrandVoice] = useState<boolean | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/signin");
      return;
    }

    const checkBrandVoice = async () => {
      if (!requireBrandVoice) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/brand_voice_info/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setHasBrandVoice(!!data.brandVoice);
        } else if (response.status === 404) {
          setHasBrandVoice(false);
        }
      } catch (error) {
        console.error("Error checking brand voice:", error);
        setHasBrandVoice(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkBrandVoice();
  }, [session, status, requireBrandVoice, router]);

  useEffect(() => {
    if (!isLoading && requireBrandVoice && hasBrandVoice === false) {
      router.push("/user-type"); // Redirect to brand voice setup if required
    }
  }, [isLoading, hasBrandVoice, requireBrandVoice, router]);

  if (
    isLoading ||
    status === "loading" ||
    (requireBrandVoice && hasBrandVoice === null)
  ) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderSpinner /> {/* Loading spinner component */}
      </div>
    );
  }

  return <>{children}</>;
}
