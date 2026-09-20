'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, BookOpen, Download, Settings, LogOut, Phone, Mail,
  Calendar, Users, CheckCircle, Clock, FileText, MessageCircle,
  ChevronRight, Anchor, Shield, Eye
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Booking } from '@/lib/supabase';
import AuthModal from '@/components/AuthModal';

const WHATSAPP_NUMBER = '254101923355';

type Tab = 'bookings' | 'vouchers' | 'settings' | 'profile';

function StatusBadge({ status }: { status: string }) {
  const { t } = useLanguage();
  const isConfirmed = status === 'confirmed';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-inter font-semibold ${
      isConfirmed
        ? 'bg-[#0e7490]/10 text-primary'
        : 'bg-[#f97316]/10 text-accent'
    }`}>
      {isConfirmed ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
      {isConfirmed ? t.account.confirmed : t.account.pending}
    </span>
  );
}

async function downloadVoucherForBooking(booking: Booking, currentLocale: Booking['locale']) {
  const { generateVoucherPDF } = await import('@/lib/voucher-generator');
  // Booking's own stored locale wins when set (it reflects the language the
  // customer was actually using when they booked); otherwise fall back to
  // whatever language they're currently browsing in.
  const { dataUrl } = await generateVoucherPDF(booking, booking.locale || currentLocale);
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${booking.booking_ref}.pdf`;
  link.click();
}

export default function AccountPage() {
  const { user, signOut, loading } = useAuth();
  const { t, locale } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: '', whatsapp: '' });
  const [profileSaved, setProfileSaved] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ newPassword: '', confirmPassword: '' });
  const [settingsMsg, setSettingsMsg] = useState('');
  const [settingsMsgOk, setSettingsMsgOk] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setAuthOpen(true);
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      const meta = user.user_metadata || {};
      setProfileForm({
        fullName: meta.full_name || '',
        whatsapp: meta.whatsapp || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && activeTab === 'bookings') {
      fetchBookings();
    }
  }, [user, activeTab]);

  const fetchBookings = async () => {
    setBookingsLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    if (!error && data) {
      setBookings(data as Booking[]);
    } else if (error) {
      console.error('Unable to load customer bookings:', error.message);
      setBookings([]);
    }
    setBookingsLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    await supabase.auth.updateUser({
      data: {
        full_name: profileForm.fullName,
        whatsapp: profileForm.whatsapp,
      },
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleChangePassword = async () => {
    if (settingsForm.newPassword !== settingsForm.confirmPassword) {
      setSettingsMsgOk(false);
      setSettingsMsg(t.account.passwordsDontMatch);
      return;
    }
    if (settingsForm.newPassword.length < 6) {
      setSettingsMsgOk(false);
      setSettingsMsg(t.account.passwordTooShort);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: settingsForm.newPassword });
    if (error) {
      setSettingsMsgOk(false);
      setSettingsMsg(error.message);
    } else {
      setSettingsMsgOk(true);
      setSettingsMsg(t.account.passwordUpdatedSuccess);
      setSettingsForm({ newPassword: '', confirmPassword: '' });
    }
  };

  const buildWhatsAppMsg = (booking: Booking) => {
    const msg = [
      '*Bahari Asili Safaris — Booking Inquiry*',
      `Ref: ${booking.booking_ref}`,
      `Name: ${booking.first_name} ${booking.last_name}`,
      `Safari: ${booking.safari_name}`,
      `Date: ${booking.arrival_date}`,
    ].join('\n');
    return encodeURIComponent(msg);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-inter text-muted-foreground">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-ocean-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-ocean-600" />
          </div>
          <h2 className="font-poppins font-bold text-2xl text-foreground mb-2">{t.account.signInToContinue}</h2>
          <p className="font-inter text-muted-foreground text-sm mb-6">{t.account.accessDesc}</p>
          <button
            onClick={() => setAuthOpen(true)}
            className="bg-ocean-700 hover:bg-ocean-800 text-white font-poppins font-semibold px-8 py-3 rounded-xl transition-all"
          >
            {t.account.signInSignUp}
          </button>
          <a href="/" className="block mt-4 font-inter text-sm text-muted-foreground hover:text-foreground">
            {t.authSession.exploreSite}
          </a>
        </div>
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} defaultMode="signin" />
      </div>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || t.account.traveler;
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'bookings', label: t.account.tabBookings, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'vouchers', label: t.account.tabVouchers, icon: <FileText className="w-4 h-4" /> },
    { id: 'profile', label: t.account.tabProfile, icon: <User className="w-4 h-4" /> },
    { id: 'settings', label: t.account.tabSettings, icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-muted">
      {/* Top nav */}
      <nav className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2" aria-label={t.authSession.backToWebsite}>
            <div className="w-8 h-8 bg-safari-500 rounded-full flex items-center justify-center">
              <Anchor className="w-4 h-4 text-white" />
            </div>
            <span className="font-poppins font-bold text-ocean-700 text-base">Bahari Asili</span>
          </a>
          <div className="flex items-center gap-4">
            <span className="font-inter text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            <button
              onClick={async () => { await signOut(); router.push('/'); }}
              className="flex items-center gap-1.5 font-inter text-sm text-destructive hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">{t.account.signOut}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-ocean-700 to-ocean-900 rounded-3xl p-6 sm:p-8 mb-8 text-white">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-poppins font-bold text-2xl sm:text-3xl">
                {t.account.welcomeBack}, {displayName}
              </h1>
              <p className="font-inter text-white/70 text-sm mt-1">{user.email}</p>
              <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-white/80 text-sm">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="font-inter">{bookings.length} {bookings.length !== 1 ? t.account.bookingPlural : t.account.bookingSingular}</span>
                </div>
                <a href="/" className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors">
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="font-inter">{t.account.backToHomepage}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-inter font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-ocean-700 text-white shadow-sm'
                  : 'bg-white text-foreground hover:bg-muted border border-border'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          <button
            onClick={async () => { await signOut(); router.push('/'); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-inter font-medium text-sm bg-white text-destructive hover:bg-[#ef4444]/10 border border-border transition-all whitespace-nowrap ml-auto"
          >
            <LogOut className="w-4 h-4" />
            {t.account.logout}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-poppins font-bold text-foreground text-xl">{t.account.tabBookings}</h2>
              <a href="/" className="font-inter text-sm text-ocean-700 font-medium hover:text-ocean-800">
                {t.account.newBooking}
              </a>
            </div>

            {bookingsLoading ? (
              <div className="bg-white rounded-2xl border border-border p-12 text-center">
                <div className="w-8 h-8 border-3 border-ocean-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="font-inter text-muted-foreground text-sm">{t.account.loadingBookings}</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-border p-12 text-center">
                <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="font-poppins font-semibold text-foreground text-lg mb-2">{t.account.noBookingsYet}</h3>
                <p className="font-inter text-muted-foreground text-sm mb-4">{t.account.noBookingsDesc}</p>
                <a href="/" className="inline-flex items-center gap-2 bg-ocean-700 hover:bg-ocean-800 text-white font-poppins font-semibold text-sm px-5 py-2.5 rounded-xl transition-all">
                  {t.authSession.exploreSite}
                </a>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden lg:block bg-white rounded-2xl border border-border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted border-b border-border">
                        <th className="px-5 py-3.5 text-left font-inter font-semibold text-xs text-muted-foreground uppercase tracking-wide">{t.account.tableRef}</th>
                        <th className="px-5 py-3.5 text-left font-inter font-semibold text-xs text-muted-foreground uppercase tracking-wide">{t.account.tableSafariTour}</th>
                        <th className="px-5 py-3.5 text-left font-inter font-semibold text-xs text-muted-foreground uppercase tracking-wide">{t.account.tableDate}</th>
                        <th className="px-5 py-3.5 text-left font-inter font-semibold text-xs text-muted-foreground uppercase tracking-wide">{t.account.tableGuests}</th>
                        <th className="px-5 py-3.5 text-left font-inter font-semibold text-xs text-muted-foreground uppercase tracking-wide">{t.account.tableStatus}</th>
                        <th className="px-5 py-3.5 text-left font-inter font-semibold text-xs text-muted-foreground uppercase tracking-wide">{t.account.tableActions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {bookings.map(b => (
                        <tr key={b.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-5 py-4">
                            <span className="font-poppins font-bold text-safari-600 text-sm">{b.booking_ref}</span>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-inter font-medium text-foreground text-sm truncate max-w-[180px]">{b.safari_name}</p>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-foreground text-sm">
                              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="font-inter">{b.arrival_date}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-foreground text-sm">
                              <Users className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="font-inter">
                                {b.adults}A
                                {b.children > 0 && (
                                  <> {b.children}C{b.kids_ages && b.kids_ages.length > 0 ? ` (${b.kids_ages.join(', ')} ${t.account.yrsShort})` : ''}</>
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={b.reservation_status || 'pending'} />
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => downloadVoucherForBooking(b, locale)}
                                className="flex items-center gap-1.5 text-ocean-700 hover:text-ocean-900 text-xs font-inter font-semibold bg-ocean-50 hover:bg-ocean-100 px-3 py-1.5 rounded-lg transition-all"
                              >
                                <Download className="w-3.5 h-3.5" />
                                {t.account.voucherBtn}
                              </button>
                              <a
                                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMsg(b)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-primary hover:text-primary text-xs font-inter font-semibold bg-[#0e7490]/10 hover:bg-[#0e7490]/10 px-3 py-1.5 rounded-lg transition-all"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                {t.account.whatsappBtn}
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="lg:hidden space-y-3">
                  {bookings.map(b => (
                    <div key={b.id} className="bg-white rounded-2xl border border-border p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="font-poppins font-bold text-safari-600 text-sm">{b.booking_ref}</span>
                          <p className="font-inter font-medium text-foreground text-sm mt-0.5">{b.safari_name}</p>
                        </div>
                        <StatusBadge status={b.reservation_status || 'pending'} />
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.arrival_date}</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {b.adults} {t.account.adultsShort}
                          {b.children > 0 && (
                            <>, {b.children}{b.kids_ages && b.kids_ages.length > 0 ? ` (${b.kids_ages.join(', ')} ${t.account.yrsShort})` : ''}</>
                          )}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => downloadVoucherForBooking(b, locale)}
                          className="flex-1 flex items-center justify-center gap-1.5 text-ocean-700 text-xs font-semibold bg-ocean-50 px-3 py-2 rounded-lg"
                        >
                          <Download className="w-3.5 h-3.5" />
                          {t.account.downloadVoucherBtn}
                        </button>
                        <a
                          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMsg(b)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 text-primary text-xs font-semibold bg-[#0e7490]/10 px-3 py-2 rounded-lg"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          {t.account.chatBtn}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'vouchers' && (
          <div className="space-y-4">
            <h2 className="font-poppins font-bold text-foreground text-xl">{t.account.myVouchersTitle}</h2>

            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-border p-12 text-center">
                <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="font-poppins font-semibold text-foreground text-lg mb-2">{t.account.noVouchersYet}</h3>
                <p className="font-inter text-muted-foreground text-sm">{t.account.noVouchersDesc}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map(b => (
                  <div key={b.id} className="bg-white rounded-2xl border border-border overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="bg-gradient-to-br from-ocean-700 to-ocean-900 px-4 py-5 text-white">
                      <p className="font-inter text-xs text-white/60 mb-1">{t.account.bookingReference}</p>
                      <p className="font-poppins font-black text-xl text-safari-300">{b.booking_ref}</p>
                    </div>
                    <div className="px-4 py-4">
                      <p className="font-inter font-semibold text-foreground text-sm mb-1 truncate">{b.safari_name}</p>
                      <p className="font-inter text-muted-foreground text-xs flex items-center gap-1.5 mb-3">
                        <Calendar className="w-3 h-3" />
                        {b.arrival_date}
                      </p>
                      <div className="flex items-center justify-between">
                        <StatusBadge status={b.reservation_status || 'pending'} />
                        <button
                          onClick={() => downloadVoucherForBooking(b, locale)}
                          className="flex items-center gap-1.5 text-ocean-700 hover:text-ocean-900 text-xs font-semibold font-inter transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          {t.account.downloadPDF}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-lg space-y-6">
            <h2 className="font-poppins font-bold text-foreground text-xl">{t.account.profileTitle}</h2>

            <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
              <div>
                <label className="font-inter text-sm font-medium text-foreground block mb-1.5">{t.account.fullNameLabel}</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={e => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder={t.account.fullNamePlaceholder}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl font-inter text-sm text-foreground outline-none focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100 bg-muted"
                  />
                </div>
              </div>

              <div>
                <label className="font-inter text-sm font-medium text-foreground block mb-1.5">{t.account.emailLabel}</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl font-inter text-sm text-muted-foreground bg-muted cursor-not-allowed"
                  />
                </div>
                <p className="font-inter text-xs text-muted-foreground mt-1">{t.account.emailCannotChange}</p>
              </div>

              <div>
                <label className="font-inter text-sm font-medium text-foreground block mb-1.5">{t.account.whatsappNumberLabel}</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    value={profileForm.whatsapp}
                    onChange={e => setProfileForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="+254101923355"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl font-inter text-sm text-foreground outline-none focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100 bg-muted"
                  />
                </div>
              </div>

              {profileSaved && (
                <div className="flex items-center gap-2 bg-[#0e7490]/10 border border-[#0e7490]/30 rounded-xl px-4 py-3">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <p className="font-inter text-sm text-primary">{t.account.profileSavedMsg}</p>
                </div>
              )}

              <button
                onClick={handleSaveProfile}
                className="w-full bg-ocean-700 hover:bg-ocean-800 text-white font-poppins font-semibold py-3 rounded-xl transition-all"
              >
                {t.account.saveProfileBtn}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-lg space-y-6">
            <h2 className="font-poppins font-bold text-foreground text-xl">{t.account.settingsTitle}</h2>

            <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
              <h3 className="font-poppins font-semibold text-foreground">{t.account.changePasswordTitle}</h3>

              <div>
                <label className="font-inter text-sm font-medium text-foreground block mb-1.5">{t.account.newPasswordLabel}</label>
                <input
                  type="password"
                  value={settingsForm.newPassword}
                  onChange={e => setSettingsForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder={t.account.newPasswordPlaceholder}
                  className="w-full px-4 py-3 border border-border rounded-xl font-inter text-sm text-foreground outline-none focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100 bg-muted"
                />
              </div>

              <div>
                <label className="font-inter text-sm font-medium text-foreground block mb-1.5">{t.account.confirmPasswordLabel}</label>
                <input
                  type="password"
                  value={settingsForm.confirmPassword}
                  onChange={e => setSettingsForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder={t.account.confirmPasswordPlaceholder}
                  className="w-full px-4 py-3 border border-border rounded-xl font-inter text-sm text-foreground outline-none focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100 bg-muted"
                />
              </div>

              {settingsMsg && (
                <div className={`flex items-center gap-2 rounded-xl px-4 py-3 ${
                  settingsMsgOk ? 'bg-[#0e7490]/10 border border-[#0e7490]/30' : 'bg-[#ef4444]/10 border border-[#ef4444]/30'
                }`}>
                  {settingsMsgOk
                    ? <CheckCircle className="w-4 h-4 text-primary" />
                    : <Eye className="w-4 h-4 text-destructive" />
                  }
                  <p className={`font-inter text-sm ${settingsMsgOk ? 'text-primary' : 'text-destructive'}`}>{settingsMsg}</p>
                </div>
              )}

              <button
                onClick={handleChangePassword}
                className="w-full bg-ocean-700 hover:bg-ocean-800 text-white font-poppins font-semibold py-3 rounded-xl transition-all"
              >
                {t.account.updatePasswordBtn}
              </button>
            </div>

            <div className="bg-[#ef4444]/10 rounded-2xl border border-[#ef4444]/30 p-6">
              <h3 className="font-poppins font-semibold text-destructive mb-2">{t.account.signOutSectionTitle}</h3>
              <p className="font-inter text-sm text-destructive mb-4">{t.account.signOutDesc}</p>
              <button
                onClick={async () => { await signOut(); router.push('/'); }}
                className="flex items-center gap-2 bg-destructive hover:bg-destructive text-white font-poppins font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                {t.account.signOut}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
