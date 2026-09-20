'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase as supabaseClient } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

const AUTH_CHANNEL = 'bahari-auth-activity';
const SIGNOUT_KEY = 'bahari-auth-signout';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabaseClient.auth.getSession().then(({ data: { session: nextSession } }) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
      if (nextSession) {
        fetch('/api/auth/activity', {
          method: 'POST',
          headers: { 'x-auth-activity-force': '1' },
          keepalive: true,
        }).catch(() => undefined);
      }
    });

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);

      if (nextSession && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED')) {
        fetch('/api/auth/activity', {
          method: 'POST',
          headers: { 'x-auth-activity-force': '1' },
          keepalive: true,
        }).catch(() => undefined);
      }
    });

    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(AUTH_CHANNEL) : null;
    const handleCrossTabSignOut = (event: MessageEvent) => {
      if (event.data?.type !== 'signout') return;
      void supabaseClient.auth.signOut();
    };
    channel?.addEventListener('message', handleCrossTabSignOut);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === SIGNOUT_KEY && event.newValue) void supabaseClient.auth.signOut();
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      channel?.removeEventListener('message', handleCrossTabSignOut);
      channel?.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const signOut = async () => {
    await supabaseClient.auth.signOut();
    try {
      localStorage.removeItem('bahari-auth-last-activity');
      localStorage.setItem(SIGNOUT_KEY, String(Date.now()));
    } catch {}
    try {
      const channel = new BroadcastChannel(AUTH_CHANNEL);
      channel.postMessage({ type: 'signout' });
      channel.close();
    } catch {}
    await fetch('/api/auth/signout', { method: 'POST', keepalive: true }).catch(() => undefined);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
