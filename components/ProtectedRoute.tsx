// components/ProtectedRoute.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import LoaderSpinner from './LoaderSpinner'; // Optional: Replace with your loading component

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading

    if (!session && status === 'unauthenticated') {
      router.push('/signin'); // Updated redirect path
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderSpinner /> {/* Replace with your preferred loading component */}
      </div>
    );
  }

  if (!session) {
    return null; // Or a fallback UI
  }

  return <>{children}</>;
}
