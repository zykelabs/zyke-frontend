'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import BrandProfile from '@/components/BrandProfile';

export default function BrandProfilePage() {
  return (
    <ProtectedRoute>
      <BrandProfile />
    </ProtectedRoute>
  );
}
