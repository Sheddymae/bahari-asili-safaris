'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';
import InactivityWarningModal from './InactivityWarningModal';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SessionGuard() {
  const { user, session, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading && user && session) {
      fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ accessToken: session.access_token }),
      }).catch(() => undefined);
    }
  }, [loading, user, session]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === 'TOKEN_REFRESHED' && nextSession) {
        fetch('/api/auth/session', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ accessToken: nextSession.access_token }) }).catch(() => undefined);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    try { localStorage.setItem('bahari-auth-signout', String(Date.now())); } catch {}
    try { const channel = new BroadcastChannel('bahari-auth-activity'); channel.postMessage({ type: 'signout' }); channel.close(); } catch {}
    await fetch('/api/auth/signout', { method: 'POST', keepalive: true }).catch(() => undefined);
    router.replace('/login?reason=inactive');
  };

  const { warning, staySignedIn } = useInactivityTimeout(Boolean(user && session), signOut);

  useEffect(() => {
    if (!loading && !user && (pathname === '/dashboard' || pathname.startsWith('/dashboard/'))) {
      router.replace('/login');
    }
  }, [loading, user, pathname, router]);

  if (!warning) return null;
  return <InactivityWarningModal onStaySignedIn={staySignedIn} />;
}
