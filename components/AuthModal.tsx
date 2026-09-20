'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2, ShieldCheck, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
  redirectTo?: string | null;
  reason?: string | null;
}

type Mode = 'signin' | 'signup' | 'forgot' | 'verify';

const otpCopy = {
  en: {
    title: 'Verify your email',
    desc: 'Enter the one time code we sent to your email address.',
    code: 'Verification code',
    codePlaceholder: 'Enter your 8 digit code',
    verify: 'Verify email',
    resend: 'Resend code',
    sent: 'A verification code has been sent to your email.',
    verified: 'Email verified successfully. Your account is ready.',
    invalid: 'The verification code is invalid or has expired.',
    emailNotConfirmed: 'Please verify your email before signing in.',
    resendSuccess: 'A new verification code has been sent.',
    back: 'Back',
  },
  it: {
    title: 'Verifica la tua email',
    desc: 'Inserisci il codice monouso che abbiamo inviato al tuo indirizzo email.',
    code: 'Codice di verifica',
    codePlaceholder: 'Inserisci il codice di 8 cifre',
    verify: 'Verifica email',
    resend: 'Invia di nuovo il codice',
    sent: 'Abbiamo inviato un codice di verifica alla tua email.',
    verified: 'Email verificata. Il tuo account è pronto.',
    invalid: 'Il codice di verifica non è valido o è scaduto.',
    emailNotConfirmed: 'Verifica la tua email prima di accedere.',
    resendSuccess: 'Abbiamo inviato un nuovo codice di verifica.',
    back: 'Indietro',
  },
  fr: {
    title: 'Vérifiez votre email',
    desc: 'Saisissez le code à usage unique envoyé à votre adresse email.',
    code: 'Code de vérification',
    codePlaceholder: 'Saisissez votre code à 8 chiffres',
    verify: 'Vérifier l’email',
    resend: 'Renvoyer le code',
    sent: 'Un code de vérification a été envoyé à votre email.',
    verified: 'Email vérifié. Votre compte est prêt.',
    invalid: 'Le code de vérification est invalide ou a expiré.',
    emailNotConfirmed: 'Veuillez vérifier votre email avant de vous connecter.',
    resendSuccess: 'Un nouveau code de vérification a été envoyé.',
    back: 'Retour',
  },
  es: {
    title: 'Verifica tu correo',
    desc: 'Introduce el código de un solo uso que enviamos a tu correo.',
    code: 'Código de verificación',
    codePlaceholder: 'Introduce tu código de 8 dígitos',
    verify: 'Verificar correo',
    resend: 'Reenviar código',
    sent: 'Hemos enviado un código de verificación a tu correo.',
    verified: 'Correo verificado. Tu cuenta está lista.',
    invalid: 'El código de verificación no es válido o ha caducado.',
    emailNotConfirmed: 'Verifica tu correo antes de iniciar sesión.',
    resendSuccess: 'Se ha enviado un nuevo código de verificación.',
    back: 'Atrás',
  },
  de: {
    title: 'E-Mail bestätigen',
    desc: 'Geben Sie den einmaligen Code ein, den wir an Ihre E-Mail gesendet haben.',
    code: 'Bestätigungscode',
    codePlaceholder: '8 stelligen Code eingeben',
    verify: 'E-Mail bestätigen',
    resend: 'Code erneut senden',
    sent: 'Ein Bestätigungscode wurde an Ihre E-Mail gesendet.',
    verified: 'E-Mail bestätigt. Ihr Konto ist bereit.',
    invalid: 'Der Bestätigungscode ist ungültig oder abgelaufen.',
    emailNotConfirmed: 'Bitte bestätigen Sie Ihre E-Mail, bevor Sie sich anmelden.',
    resendSuccess: 'Ein neuer Bestätigungscode wurde gesendet.',
    back: 'Zurück',
  },
  ar: {
    title: 'تحقق من بريدك الإلكتروني',
    desc: 'أدخل الرمز لمرة واحدة الذي أرسلناه إلى بريدك الإلكتروني.',
    code: 'رمز التحقق',
    codePlaceholder: 'أدخل الرمز المكون من 8 أرقام',
    verify: 'تحقق من البريد الإلكتروني',
    resend: 'إعادة إرسال الرمز',
    sent: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني.',
    verified: 'تم التحقق من البريد الإلكتروني. حسابك جاهز.',
    invalid: 'رمز التحقق غير صالح أو انتهت صلاحيته.',
    emailNotConfirmed: 'يرجى التحقق من بريدك الإلكتروني قبل تسجيل الدخول.',
    resendSuccess: 'تم إرسال رمز تحقق جديد.',
    back: 'رجوع',
  },
  zh: {
    title: '验证您的邮箱',
    desc: '请输入我们发送到您邮箱的一次性验证码。',
    code: '验证码',
    codePlaceholder: '请输入 8 位验证码',
    verify: '验证邮箱',
    resend: '重新发送验证码',
    sent: '验证码已发送到您的邮箱。',
    verified: '邮箱验证成功。您的账户已准备就绪。',
    invalid: '验证码无效或已过期。',
    emailNotConfirmed: '请先验证您的邮箱再登录。',
    resendSuccess: '新的验证码已发送。',
    back: '返回',
  },
  sw: {
    title: 'Thibitisha barua pepe yako',
    desc: 'Weka msimbo wa matumizi moja tuliotuma kwenye barua pepe yako.',
    code: 'Msimbo wa uthibitishaji',
    codePlaceholder: 'Weka msimbo wa tarakimu 8',
    verify: 'Thibitisha barua pepe',
    resend: 'Tuma msimbo tena',
    sent: 'Msimbo wa uthibitishaji umetumwa kwenye barua pepe yako.',
    verified: 'Barua pepe imethibitishwa. Akaunti yako iko tayari.',
    invalid: 'Msimbo wa uthibitishaji si sahihi au umeisha muda.',
    emailNotConfirmed: 'Thibitisha barua pepe yako kabla ya kuingia.',
    resendSuccess: 'Msimbo mpya wa uthibitishaji umetumwa.',
    back: 'Rudi',
  },
} as const;

export default function AuthModal({ isOpen, onClose, defaultMode = 'signin', redirectTo, reason }: AuthModalProps) {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const copy = otpCopy[locale as keyof typeof otpCopy] || otpCopy.en;
  const safeRedirect = (() => { try { const value = redirectTo || '/dashboard'; if (!value.startsWith('/') || value.startsWith('//')) return '/dashboard'; const url = new URL(value, 'https://bahari.local'); return url.origin === 'https://bahari.local' && !url.pathname.startsWith('/api/') ? `${url.pathname}${url.search}${url.hash}` : '/dashboard'; } catch { return '/dashboard'; } })();
  const callbackUrl = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeRedirect)}`;
  const resetPasswordUrl = () => `${window.location.origin}/reset-password`;
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) setMode(defaultMode);
  }, [isOpen, defaultMode]);

  useEffect(() => {
    if (isOpen && reason === 'inactive') setError(t.authSession.signedOutInactive);
    if (isOpen && reason === 'auth_error') setError(t.authSession.authError);
  }, [isOpen, reason, t]);

  const reset = () => {
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setFullName('');
    setOtp('');
    setError('');
    setSuccess('');
    setLoading(false);
    setResending(false);
  };

  const switchMode = (nextMode: 'signin' | 'signup') => {
    setMode(nextMode);
    setPassword('');
    setShowPassword(false);
    setOtp('');
    setError('');
    setSuccess('');
  };

  const beginVerification = () => {
    setMode('verify');
    setOtp('');
    setError('');
    setSuccess(copy.sent);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: resetPasswordUrl(),
      });
      if (resetError) throw resetError;
      setSuccess(t.auth.resetSent);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.common.error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') return handleForgotPassword(e);
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'verify') {
        const token = otp.replace(/\D/g, '');
        if (!email || token.length < 6) {
          setError(copy.invalid);
          return;
        }

        const { error: verifyError } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'email',
        });

        if (verifyError) throw verifyError;

        setSuccess(copy.verified);
        setTimeout(() => {
          reset();
          onClose();
          router.push(safeRedirect);
        }, 500);
        return;
      }

      if (mode === 'signup') {
        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: callbackUrl(),
          },
        });

        if (signupError) throw signupError;

        // With Supabase email confirmation enabled, signUp returns no active
        // session until the confirmation code is verified.
        if (data.session) {
          setSuccess(t.auth.accountCreated);
          setTimeout(() => {
            reset();
            onClose();
            router.push(safeRedirect);
          }, 500);
        } else {
          beginVerification();
        }
        return;
      }

      const { error: signinError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signinError) {
        if (/email not confirmed|email.*confirm/i.test(signinError.message)) {
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email,
            options: {
              emailRedirectTo: callbackUrl(),
            },
          });
          if (resendError) throw resendError;
          beginVerification();
          setError(copy.emailNotConfirmed);
          return;
        }
        throw signinError;
      }

      reset();
      onClose();
      router.push(safeRedirect);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.common.error;
      if (msg.includes('already registered') || msg.includes('already exists')) {
        setError(t.auth.emailExistsError);
      } else if (msg.includes('Invalid login credentials')) {
        setError(t.auth.invalidCredentialsError);
      } else if (/invalid|expired|token/i.test(msg) && mode === 'verify') {
        setError(copy.invalid);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!email || resending) return;
    setResending(true);
    setError('');
    setSuccess('');

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: callbackUrl(),
        },
      });
      if (resendError) throw resendError;
      setSuccess(copy.resendSuccess);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.common.error);
    } finally {
      setResending(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callbackUrl() },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isAuthForm = mode === 'signin' || mode === 'signup';
  const title =
    mode === 'verify' ? copy.title :
    mode === 'forgot' ? t.auth.forgotTitle :
    mode === 'signin' ? t.auth.signInTitle : t.auth.signUpTitle;
  const description =
    mode === 'verify' ? copy.desc :
    mode === 'forgot' ? t.auth.forgotDesc :
    mode === 'signin' ? t.auth.signInDesc : t.auth.signUpDesc;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative z-10 w-full max-w-[500px] max-h-[calc(100vh-24px)] overflow-y-auto rounded-[28px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.35)] ring-1 ring-black/5"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-ocean-800 via-ocean-700 to-[#12384d] px-6 pb-7 pt-6 text-white sm:px-8 sm:pt-7">
          <div className="absolute -right-16 -top-20 h-44 w-44 rounded-full bg-white/10" />
          <div className="absolute -bottom-28 -left-20 h-48 w-48 rounded-full bg-cyan-300/10" />
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative flex items-center gap-4 pr-10">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
              {mode === 'forgot' ? <KeyRound className="h-6 w-6" /> : mode === 'verify' ? <ShieldCheck className="h-6 w-6" /> : <User className="h-6 w-6" />}
            </div>
            <div>
              <h2 id="auth-modal-title" className="font-poppins text-[25px] font-bold leading-tight sm:text-[28px]">{title}</h2>
              <p className="mt-1.5 max-w-sm font-inter text-sm leading-5 text-white/75">{description}</p>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-8 sm:py-7">
          {isAuthForm && (
            <>
              <div className="mb-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1.5">
                {(['signin', 'signup'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    className={`rounded-xl py-2.5 font-inter text-sm font-semibold transition-all ${mode === m ? 'bg-white text-ocean-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {m === 'signin' ? t.auth.signInTab : t.auth.signUpTab}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3.5 font-inter text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t.auth.googleBtn}
              </button>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="font-inter text-xs font-medium text-slate-400">{t.auth.orDivider}</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
            </>
          )}

          {mode === 'forgot' ? (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="rounded-2xl border border-ocean-100 bg-ocean-50/70 p-4">
                <div className="flex gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-ocean-700" />
                  <p className="font-inter text-sm leading-5 text-ocean-900">{t.auth.forgotDesc}</p>
                </div>
              </div>
              <div>
                <label htmlFor="forgot-email" className="mb-2 block font-inter text-sm font-semibold text-slate-800">{t.auth.email}</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input id="forgot-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.auth.emailPlaceholder} className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 font-inter text-sm text-slate-900 outline-none transition focus:border-ocean-600 focus:bg-white focus:ring-4 focus:ring-ocean-100" />
                </div>
              </div>
              {error && <Message type="error" text={error} />}
              {success && <Message type="success" text={success} />}
              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ocean-700 py-3.5 font-poppins text-sm font-semibold text-white shadow-lg shadow-ocean-700/20 transition hover:bg-ocean-800 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />{t.auth.processing}</> : <><Mail className="h-4 w-4" />{t.auth.sendResetLink}</>}
              </button>
              <button type="button" onClick={() => switchMode('signin')} className="mx-auto flex items-center gap-2 font-inter text-sm font-semibold text-ocean-700 hover:text-ocean-900">
                <ArrowLeft className="h-4 w-4" />{t.auth.backToSignIn}
              </button>
            </form>
          ) : mode === 'verify' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="rounded-2xl border border-ocean-100 bg-ocean-50 p-4">
                <p className="font-inter text-sm text-ocean-900 break-all"><strong>{email}</strong></p>
              </div>
              <div>
                <label htmlFor="verification-code" className="mb-2 block font-inter text-sm font-semibold text-slate-800">{copy.code}</label>
                <input id="verification-code" type="text" inputMode="numeric" autoComplete="one-time-code" required maxLength={8} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))} placeholder={copy.codePlaceholder} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-center font-inter text-xl font-semibold tracking-[0.35em] text-slate-900 outline-none transition focus:border-ocean-600 focus:bg-white focus:ring-4 focus:ring-ocean-100" />
              </div>
              {error && <Message type="error" text={error} />}
              {success && <Message type="success" text={success} />}
              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ocean-700 py-3.5 font-poppins text-sm font-semibold text-white shadow-lg shadow-ocean-700/20 transition hover:bg-ocean-800 disabled:opacity-60">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />{t.auth.processing}</> : <><ShieldCheck className="h-4 w-4" />{copy.verify}</>}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => switchMode('signin')} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 font-inter text-sm font-semibold text-slate-700 hover:bg-slate-50"><ArrowLeft className="h-4 w-4" />{copy.back}</button>
                <button type="button" onClick={resendCode} disabled={resending} className="rounded-2xl border border-ocean-200 py-3 font-inter text-sm font-semibold text-ocean-700 hover:bg-ocean-50 disabled:opacity-60">{resending ? t.auth.processing : copy.resend}</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label htmlFor="auth-name" className="mb-2 block font-inter text-sm font-semibold text-slate-800">{t.auth.fullName}</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input id="auth-name" type="text" required autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t.auth.fullNamePlaceholder} className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 font-inter text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-ocean-600 focus:bg-white focus:ring-4 focus:ring-ocean-100" />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="auth-email" className="mb-2 block font-inter text-sm font-semibold text-slate-800">{t.auth.email}</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input id="auth-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.auth.emailPlaceholder} className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 font-inter text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-ocean-600 focus:bg-white focus:ring-4 focus:ring-ocean-100" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="auth-password" className="font-inter text-sm font-semibold text-slate-800">{t.auth.password}</label>
                  {mode === 'signin' && (
                    <button type="button" onClick={() => { setError(''); setSuccess(''); setMode('forgot'); }} className="font-inter text-xs font-semibold text-ocean-700 hover:text-ocean-900 sm:text-sm">
                      {t.auth.forgotPassword}
                    </button>
                  )}
                </div>
                <div className="relative flex h-[52px] items-center rounded-2xl border border-slate-200 bg-slate-50 transition focus-within:border-ocean-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-ocean-100">
                  <Lock className="pointer-events-none ml-3.5 h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? t.auth.passwordMin : t.auth.passwordPlaceholder}
                    className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3.5 font-inter text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? t.auth.hidePassword : t.auth.showPassword}
                    title={showPassword ? t.auth.hidePassword : t.auth.showPassword}
                    className="mr-1.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ocean-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <Message type="error" text={error} />}
              {success && <Message type="success" text={success} />}

              <button type="submit" disabled={loading} className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-ocean-700 py-3.5 font-poppins text-sm font-semibold text-white shadow-lg shadow-ocean-700/20 transition hover:bg-ocean-800 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />{t.auth.processing}</> : mode === 'signin' ? <><KeyRound className="h-4 w-4" />{t.auth.signInTab}</> : <><User className="h-4 w-4" />{t.auth.signUpTitle}</>}
              </button>
            </form>
          )}

          {isAuthForm && (
            <p className="mt-5 text-center font-inter text-xs leading-5 text-slate-400">
              {mode === 'signin' ? t.auth.signUpPrompt : t.auth.signInPrompt}{' '}
              <button type="button" onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')} className="font-semibold text-ocean-700 hover:text-ocean-900">
                {mode === 'signin' ? t.auth.signUpTab : t.auth.signInTab}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Message({ type, text }: { type: 'error' | 'success'; text: string }) {
  if (type === 'success') {
    return (
      <div role="status" className="flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        <p className="font-inter text-sm leading-5">{text}</p>
      </div>
    );
  }

  return (
    <div role="alert" className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="font-inter text-sm leading-5">{text}</p>
    </div>
  );
}
