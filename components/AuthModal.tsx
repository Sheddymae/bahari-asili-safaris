'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

type Mode = 'signin' | 'signup' | 'verify';

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

export default function AuthModal({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const copy = otpCopy[locale as keyof typeof otpCopy] || otpCopy.en;
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

  const reset = () => {
    setEmail('');
    setPassword('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          router.push('/account');
        }, 500);
        return;
      }

      if (mode === 'signup') {
        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/account`,
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
            router.push('/account');
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
              emailRedirectTo: `${window.location.origin}/account`,
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
      router.push('/account');
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
          emailRedirectTo: `${window.location.origin}/account`,
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
      options: { redirectTo: `${window.location.origin}/account` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-10">
        <div className="bg-gradient-to-br from-ocean-700 to-ocean-900 px-8 pt-8 pb-6 text-white relative">
          <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            {mode === 'verify' ? <ShieldCheck className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-white" />}
          </div>
          <h2 className="font-poppins font-bold text-2xl">
            {mode === 'verify' ? copy.title : mode === 'signin' ? t.auth.signInTitle : t.auth.signUpTitle}
          </h2>
          <p className="font-inter text-white/70 text-sm mt-1">
            {mode === 'verify' ? copy.desc : mode === 'signin' ? t.auth.signInDesc : t.auth.signUpDesc}
          </p>
        </div>

        <div className="px-8 py-6">
          {mode !== 'verify' && (
            <>
              <div className="flex bg-muted rounded-xl p-1 mb-6">
                {(['signin', 'signup'] as const).map((m) => (
                  <button key={m} type="button" onClick={() => switchMode(m)} className={`flex-1 py-2 font-inter font-medium text-sm rounded-lg transition-all ${mode === m ? 'bg-white text-ocean-700 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                    {m === 'signin' ? t.auth.signInTab : t.auth.signUpTab}
                  </button>
                ))}
              </div>

              <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-3 border border-border rounded-xl py-3 font-inter font-medium text-foreground hover:bg-muted transition-all mb-4 disabled:opacity-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t.auth.googleBtn}
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-muted" />
                <span className="font-inter text-xs text-muted-foreground">{t.auth.orDivider}</span>
                <div className="flex-1 h-px bg-muted" />
              </div>
            </>
          )}

          {mode === 'verify' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-2xl bg-ocean-50 border border-ocean-100 p-4">
                <p className="text-sm text-ocean-900 break-all"><strong>{email}</strong></p>
              </div>
              <div>
                <label className="font-inter text-sm font-medium text-foreground block mb-1.5">{copy.code}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  maxLength={8}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder={copy.codePlaceholder}
                  className="w-full text-center tracking-[0.35em] text-xl font-semibold border border-border rounded-xl px-4 py-3 bg-muted outline-none focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100"
                />
              </div>
              {error && <div className="flex items-start gap-2 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl px-4 py-3"><AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" /><p className="font-inter text-sm text-destructive">{error}</p></div>}
              {success && <div className="bg-[#0e7490]/10 border border-[#0e7490]/30 rounded-xl px-4 py-3"><p className="font-inter text-sm text-primary">{success}</p></div>}
              <button type="submit" disabled={loading} className="w-full bg-ocean-700 hover:bg-ocean-800 disabled:opacity-60 text-white font-poppins font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> {t.auth.processing}</> : <><ShieldCheck className="w-4 h-4" /> {copy.verify}</>}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => switchMode('signin')} className="rounded-xl border border-border py-3 font-medium flex items-center justify-center gap-2"><ArrowLeft className="w-4 h-4" />{copy.back}</button>
                <button type="button" onClick={resendCode} disabled={resending} className="rounded-xl border border-ocean-200 text-ocean-700 py-3 font-medium disabled:opacity-60">{resending ? t.auth.processing : copy.resend}</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="font-inter text-sm font-medium text-foreground block mb-1.5">{t.auth.fullName}</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t.auth.fullNamePlaceholder} className="w-full pl-10 pr-4 py-3 border border-border rounded-xl font-inter text-sm text-foreground outline-none focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100 transition-all bg-muted" />
                  </div>
                </div>
              )}

              <div>
                <label className="font-inter text-sm font-medium text-foreground block mb-1.5">{t.auth.email}</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.auth.emailPlaceholder} className="w-full pl-10 pr-4 py-3 border border-border rounded-xl font-inter text-sm text-foreground outline-none focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100 transition-all bg-muted" />
                </div>
              </div>

              <div>
                <label className="font-inter text-sm font-medium text-foreground block mb-1.5">{t.auth.password}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type={showPassword ? 'text' : 'password'} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === 'signup' ? t.auth.passwordMin : t.auth.passwordPlaceholder} className="w-full pl-10 pr-11 py-3 border border-border rounded-xl font-inter text-sm text-foreground outline-none focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100 transition-all bg-muted" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <div className="flex items-start gap-2 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl px-4 py-3"><AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" /><p className="font-inter text-sm text-destructive">{error}</p></div>}
              {success && <div className="bg-[#0e7490]/10 border border-[#0e7490]/30 rounded-xl px-4 py-3"><p className="font-inter text-sm text-primary">{success}</p></div>}

              <button type="submit" disabled={loading} className="w-full bg-ocean-700 hover:bg-ocean-800 disabled:opacity-60 text-white font-poppins font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> {t.auth.processing}</> : mode === 'signin' ? t.auth.signInTab : t.auth.signUpTitle}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
