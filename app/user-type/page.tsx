'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import UserType from '@/components/UserType';

export default function AccountSelectionPage() {
  return (
    <ProtectedRoute>
      <UserType />
    </ProtectedRoute>
  );
}
