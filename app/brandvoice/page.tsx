'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import BrandVoiceCreator from '@/components/BrandVoice';
import { useSearchParams } from 'next/navigation';

export default function BrandVoicePage() {
  const searchParams = useSearchParams();
  const brandType = searchParams.get('brand_type') || 'big_brands';

  return (
    <ProtectedRoute>
      <BrandVoiceCreator brandType={brandType} />
    </ProtectedRoute>
  );
}
