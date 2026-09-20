'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';

function SignupPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [loading, user, router]);

  if (!loading && user) return null;

  return <div className="min-h-screen bg-sand-50"><AuthModal isOpen onClose={() => router.push('/')} defaultMode="signup" redirectTo={params.get('redirect')} /></div>;
}

export default function SignupPage() {
  return <Suspense fallback={<div className="min-h-screen bg-sand-50" />}><SignupPageInner /></Suspense>;
}
