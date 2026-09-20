'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function LoginPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const reason = params.get('reason');

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [loading, user, router]);

  if (!loading && user) return null;

  return <div className="min-h-screen bg-sand-50"><AuthModal isOpen onClose={() => router.push('/')} defaultMode="signin" redirectTo={params.get('redirect')} reason={reason} /></div>;
}

export default function LoginPage() {
  return <Suspense fallback={<div className="min-h-screen bg-sand-50" />}><LoginPageInner /></Suspense>;
}
