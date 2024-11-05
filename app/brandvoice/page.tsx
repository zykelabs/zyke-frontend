'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import BrandVoiceCreator from '@/components/BrandVoice';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function BrandVoiceContent() {
  const searchParams = useSearchParams();
  const brandType = searchParams.get('brand_type') || 'big_brands';

  return <BrandVoiceCreator brandType={brandType} />;
}

export default function BrandVoicePage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <BrandVoiceContent />
      </Suspense>
    </ProtectedRoute>
  );
}