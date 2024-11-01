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
    if (status === "loading") {
      return; // Do nothing while loading
    }

    if (!session) {
      router.push("/signin");
      return;
    }

    const checkBrandVoice = async () => {
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
          if (data.brandVoice) {
            setHasBrandVoice(true);
          } else {
            setHasBrandVoice(false);
          }
        } else if (response.status === 404) {
          setHasBrandVoice(false);
        } else {
          // Handle other response statuses
          console.error("Failed to fetch brand voice:", response.statusText);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  useEffect(() => {
    if (isLoading) return;
  }, []);

  if (isLoading || status === "loading" || hasBrandVoice === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderSpinner /> {/* Replace with your preferred loading component */}
      </div>
    );
  }

  return <>{children}</>;
}