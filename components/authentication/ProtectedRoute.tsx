'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SessionProvider, useSession } from 'next-auth/react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRouteContent = ({ children }: ProtectedRouteProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  if (status === 'authenticated') {
    return <>{children}</>;
  }

  return null;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  return (
    <SessionProvider>
      <ProtectedRouteContent>{children}</ProtectedRouteContent>
    </SessionProvider>
  );
};

export default ProtectedRoute;
