'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';

export default function Navbar() {
  const { t } = useLanguage();
  const { user, signOut, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'signin' | 'signup' }>({ open: false, mode: 'signin' });

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const close = () => setIsUserMenuOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setIsMobileOpen(false);
      setIsUserMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const navLinks = useMemo(() => [
    { label: t.nav.tours, href: '/tours' },
    { label: t.nav.excursions, href: '/excursions' },
    { label: t.nav.destinations, href: '/destinations' },
    { label: t.nav.services, href: '/services' },
    { label: t.homeExtras.buildCta, href: '/build-your-safari' },
    { label: t.nav.about, href: '/about' },
    { label: t.nav.contact, href: '/contact' },
  ], [t]);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || t.nav.myAccount;

  const handleMobileNavClick = useCallback(() => setIsMobileOpen(false), []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 will-change-transform ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-white/10 backdrop-blur-md border-b border-white/20 py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" prefetch className="flex items-center flex-shrink-0 hover:opacity-80 transition-opacity">
              <Image src="/images/logo/logo-horizontal.png" alt="Bahari Asili Safaris" width={1752} height={798} priority className="h-8 sm:h-10 w-auto" />
            </Link>

            <div className="hidden xl:flex items-center gap-6">
              {navLinks.map(link => <Link key={link.href} href={link.href} prefetch className={`nav-link font-inter font-medium text-sm transition-colors pb-0.5 cursor-pointer ${isScrolled ? 'text-foreground hover:text-ocean-700' : 'text-white/90 hover:text-white'}`}>{link.label}</Link>)}
            </div>

            <div className="hidden xl:flex items-center gap-3">
              {!loading && (user ? (
                <div className="relative" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} aria-haspopup="true" aria-expanded={isUserMenuOpen} className={`flex items-center gap-2 font-inter text-sm font-semibold px-4 py-2 rounded-full border-2 transition-all ${isScrolled ? 'border-ocean-700 text-ocean-700 hover:bg-ocean-700 hover:text-white bg-white' : 'border-white text-white hover:bg-white hover:text-ocean-700'}`}>
                    <div className="w-6 h-6 rounded-full bg-safari-500 flex items-center justify-center flex-shrink-0"><User className="w-3.5 h-3.5 text-white" /></div>
                    {t.authSession.myDashboard}<ChevronDown className={`w-3 h-3 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isUserMenuOpen && <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-border overflow-hidden z-50 min-w-[220px]">
                    <div className="px-4 py-3 border-b border-border"><p className="font-inter font-semibold text-foreground text-sm truncate">{displayName}</p><p className="font-inter text-xs text-muted-foreground truncate">{user.email}</p></div>
                    <Link href="/dashboard" className="flex items-center gap-2 w-full px-4 py-3 text-sm font-inter text-foreground hover:bg-muted transition-colors"><User className="w-4 h-4 text-muted-foreground" />{t.authSession.myDashboard}</Link>
                    <button onClick={() => { signOut(); setIsUserMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-3 text-sm font-inter text-destructive hover:bg-[#ef4444]/10 transition-colors border-t border-border"><LogOut className="w-4 h-4" />{t.nav.signOut}</button>
                  </div>}
                </div>
              ) : <div className="flex items-center gap-2">
                <button onClick={() => setAuthModal({ open: true, mode: 'signin' })} className={`font-inter text-sm font-medium px-4 py-2 rounded-full transition-all ${isScrolled ? 'text-foreground hover:text-ocean-700' : 'text-white/90 hover:text-white'}`}>{t.nav.signIn}</button>
                <button onClick={() => setAuthModal({ open: true, mode: 'signup' })} className={`font-inter text-sm font-semibold px-5 py-2 rounded-full border-2 transition-all ${isScrolled ? 'border-ocean-700 text-ocean-700 hover:bg-ocean-700 hover:text-white' : 'border-white text-white hover:bg-white hover:text-ocean-700'}`}>{t.nav.register}</button>
              </div>)}
            </div>

            <div className="xl:hidden flex items-center gap-3">
              <button onClick={() => setIsMobileOpen(!isMobileOpen)} aria-label={t.nav.myAccount} aria-expanded={isMobileOpen} aria-controls="mobile-menu" className={`p-2 rounded-lg ${isScrolled ? 'text-foreground' : 'text-white'}`}>
                {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {isMobileOpen && <div id="mobile-menu" className="xl:hidden mt-4 bg-white rounded-2xl shadow-xl border border-border overflow-hidden animate-in slide-in-from-top-2">
            <div className="px-4 py-3 space-y-1">{navLinks.map(link => <Link key={link.href} href={link.href} prefetch onClick={handleMobileNavClick} className="block py-2.5 px-3 font-inter font-medium text-foreground hover:text-ocean-700 hover:bg-sand-50 rounded-lg transition-colors cursor-pointer">{link.label}</Link>)}</div>
            <div className="border-t border-border px-4 py-3 space-y-2">{user ? <><Link href="/dashboard" onClick={() => setIsMobileOpen(false)} className="block text-center font-inter text-sm font-semibold px-4 py-2.5 bg-ocean-700 text-white rounded-xl">{t.nav.myAccount}</Link><button onClick={signOut} className="w-full text-center font-inter text-sm font-medium px-4 py-2.5 border border-[#ef4444]/30 text-destructive rounded-xl">{t.nav.signOut}</button></> : <><button onClick={() => { setIsMobileOpen(false); setAuthModal({ open: true, mode: 'signin' }); }} className="block w-full text-center font-inter text-sm font-medium px-4 py-2.5 border border-border text-foreground rounded-xl">{t.nav.signIn}</button><button onClick={() => { setIsMobileOpen(false); setAuthModal({ open: true, mode: 'signup' }); }} className="block w-full text-center font-inter text-sm font-semibold px-4 py-2.5 bg-ocean-700 text-white rounded-xl">{t.nav.register}</button></>}</div>
          </div>}
        </div>
      </nav>
      <AuthModal isOpen={authModal.open} onClose={() => setAuthModal({ open: false, mode: 'signin' })} defaultMode={authModal.mode} />
    </>
  );
}
