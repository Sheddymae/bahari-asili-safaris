'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { INACTIVITY_LIMIT_MS, INACTIVITY_WARNING_MS } from '@/lib/auth-config';

const CHANNEL_NAME = 'bahari-auth-activity';
const STORAGE_KEY = 'bahari-auth-last-activity';

export function useInactivityTimeout(enabled: boolean, onTimeout: () => Promise<void>) {
  const [warning, setWarning] = useState(false);
  const lastActivity = useRef(Date.now());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  const reset = useCallback(async (broadcast = true) => {
    if (!enabled) return;
    lastActivity.current = Date.now();
    setWarning(false);
    try { localStorage.setItem(STORAGE_KEY, String(lastActivity.current)); } catch {}
    if (broadcast) {
      try { channelRef.current?.postMessage({ type: 'activity', at: lastActivity.current }); } catch {}
    }
    fetch('/api/auth/activity', { method: 'POST', keepalive: true }).catch(() => undefined);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setWarning(false);
      return;
    }

    let mounted = true;
    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(CHANNEL_NAME) : null;
    channelRef.current = channel;

    const schedule = () => {
      if (!mounted) return;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      const elapsed = Date.now() - lastActivity.current;
      const warningDelay = Math.max(0, INACTIVITY_WARNING_MS - elapsed);
      const timeoutDelay = Math.max(0, INACTIVITY_LIMIT_MS - elapsed);
      warningRef.current = setTimeout(() => setWarning(true), warningDelay);
      timeoutRef.current = setTimeout(async () => {
        if (!mounted) return;
        if (Date.now() - lastActivity.current < INACTIVITY_LIMIT_MS) { schedule(); return; }
        await onTimeoutRef.current();
      }, timeoutDelay);
    };

    const sync = (at: number) => {
      if (!Number.isFinite(at)) return;
      if (at > lastActivity.current) {
        lastActivity.current = at;
        setWarning(false);
        schedule();
      }
    };

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'activity') sync(Number(event.data.at));
      if (event.data?.type === 'signout') onTimeoutRef.current();
    };
    channel?.addEventListener('message', onMessage);

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) sync(Number(event.newValue));
      if (event.key === 'bahari-auth-signout' && event.newValue) onTimeoutRef.current();
    };
    window.addEventListener('storage', onStorage);

    let ticking = false;
    let lastSent = 0;
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    const handleActivity = () => {
      if (ticking) return;
      ticking = true;
      window.setTimeout(() => {
        ticking = false;
        const now = Date.now();
        if (now - lastSent < 1000) return;
        lastSent = now;
        void reset(true);
        schedule();
      }, 150);
    };
    activityEvents.forEach(event => window.addEventListener(event, handleActivity, { passive: true }));

    try {
      const stored = Number(localStorage.getItem(STORAGE_KEY));
      if (Number.isFinite(stored) && stored > lastActivity.current) lastActivity.current = stored;
    } catch {}

    schedule();

    return () => {
      mounted = false;
      activityEvents.forEach(event => window.removeEventListener(event, handleActivity));
      window.removeEventListener('storage', onStorage);
      channel?.removeEventListener('message', onMessage);
      channel?.close();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      channelRef.current = null;
    };
  }, [enabled, reset]);

  const staySignedIn = useCallback(() => { void reset(true); }, [reset]);

  return { warning, staySignedIn };
}

export function useSignOutWithBroadcast() {
  return useCallback(async () => {
    try { await supabase.auth.signOut(); } finally {
      try { localStorage.setItem('bahari-auth-signout', String(Date.now())); } catch {}
      try { const channel = new BroadcastChannel(CHANNEL_NAME); channel.postMessage({ type: 'signout' }); channel.close(); } catch {}
      await fetch('/api/auth/signout', { method: 'POST', keepalive: true }).catch(() => undefined);
      window.location.href = '/login?reason=inactive';
    }
  }, []);
}
