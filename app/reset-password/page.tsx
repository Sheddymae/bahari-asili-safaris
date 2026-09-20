'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Lock, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let mounted = true;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const finishCheck = (hasSession: boolean) => {
      if (!mounted) return;
      setReady(hasSession);
      setChecking(false);
    };

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        finishCheck(true);
      } else {
        timeout = setTimeout(() => finishCheck(false), 3500);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        finishCheck(true);
      }
    });

    return () => {
      mounted = false;
      if (timeout) clearTimeout(timeout);
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError(t.auth.passwordTooShort);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.auth.passwordMismatch);
      return;
    }

    setSaving(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      setSuccess(t.auth.passwordUpdated);
      setTimeout(() => router.replace('/dashboard'), 900);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.common.error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-lg items-center justify-center">
        <section className="w-full overflow-hidden rounded-[28px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] ring-1 ring-black/5">
          <div className="relative overflow-hidden bg-gradient-to-br from-ocean-800 via-ocean-700 to-[#12384d] px-6 py-7 text-white sm:px-8 sm:py-8">
            <div className="absolute -right-16 -top-20 h-44 w-44 rounded-full bg-white/10" />
            <div className="absolute -bottom-28 -left-20 h-48 w-48 rounded-full bg-cyan-300/10" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                <KeyRound className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-poppins text-2xl font-bold sm:text-[28px]">{t.auth.resetPasswordTitle}</h1>
                <p className="mt-1.5 font-inter text-sm leading-5 text-white/75">{t.auth.resetPasswordDesc}</p>
              </div>
            </div>
          </div>

          <div className="px-5 py-6 sm:px-8 sm:py-8">
            {checking ? (
              <div className="flex min-h-52 flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 className="h-7 w-7 animate-spin text-ocean-700" />
                <p className="font-inter text-sm">{t.common.loading}</p>
              </div>
            ) : !ready ? (
              <div className="py-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <XCircle className="h-7 w-7" />
                </div>
                <h2 className="mt-4 font-poppins text-xl font-semibold text-slate-900">{t.auth.resetLinkInvalid}</h2>
                <p className="mt-2 font-inter text-sm leading-6 text-slate-500">{t.auth.resetLinkInvalid}</p>
                <button type="button" onClick={() => router.replace('/login')} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-ocean-700 px-5 py-3 font-inter text-sm font-semibold text-white hover:bg-ocean-800">
                  <ArrowLeft className="h-4 w-4" />
                  {t.auth.backToSignIn}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="rounded-2xl border border-ocean-100 bg-ocean-50/70 p-4">
                  <div className="flex gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-ocean-700" />
                    <p className="font-inter text-sm leading-5 text-ocean-900">{t.auth.resetPasswordDesc}</p>
                  </div>
                </div>

                <PasswordField
                  id="new-password"
                  label={t.auth.newPassword}
                  value={password}
                  onChange={setPassword}
                  show={showPassword}
                  onToggle={() => setShowPassword((value) => !value)}
                  ariaLabel={showPassword ? t.auth.hidePassword : t.auth.showPassword}
                  autoComplete="new-password"
                />

                <PasswordField
                  id="confirm-password"
                  label={t.auth.confirmPassword}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  show={showConfirm}
                  onToggle={() => setShowConfirm((value) => !value)}
                  ariaLabel={showConfirm ? t.auth.hidePassword : t.auth.showPassword}
                  autoComplete="new-password"
                />

                {error && (
                  <div role="alert" className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p className="font-inter text-sm leading-5">{error}</p>
                  </div>
                )}

                {success && (
                  <div role="status" className="flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <p className="font-inter text-sm leading-5">{success}</p>
                  </div>
                )}

                <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ocean-700 py-3.5 font-poppins text-sm font-semibold text-white shadow-lg shadow-ocean-700/20 transition hover:bg-ocean-800 disabled:cursor-not-allowed disabled:opacity-60">
                  {saving ? <><Loader2 className="h-4 w-4 animate-spin" />{t.auth.processing}</> : <><Lock className="h-4 w-4" />{t.auth.updatePassword}</>}
                </button>

                <button type="button" onClick={() => router.replace('/login')} className="mx-auto flex items-center gap-2 font-inter text-sm font-semibold text-ocean-700 hover:text-ocean-900">
                  <ArrowLeft className="h-4 w-4" />
                  {t.auth.backToSignIn}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
  ariaLabel,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
  ariaLabel: string;
  autoComplete: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-inter text-sm font-semibold text-slate-800">{label}</label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id={id}
          type={show ? 'text' : 'password'}
          required
          minLength={6}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 font-inter text-sm text-slate-900 outline-none transition focus:border-ocean-600 focus:bg-white focus:ring-4 focus:ring-ocean-100"
        />
        <button type="button" onClick={onToggle} aria-label={ariaLabel} title={ariaLabel} className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-ocean-200">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
