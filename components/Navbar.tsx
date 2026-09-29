'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, User, LogOut, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';
import { destinations } from '@/lib/destinations-data';
import { getLocalizedDestination } from '@/lib/destination-translations';

type DropdownKey = 'safaris' | 'destinations' | 'experiences';

type MenuLink = {
  label: string;
  href: string;
};

type DropdownMenu = {
  key: DropdownKey;
  label: string;
  items: MenuLink[];
};

export default function Navbar() {
  const { t, locale } = useLanguage();
  const { user, signOut, loading } = useAuth();
  const navRef = useRef<HTMLElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<DropdownKey | null>(null);
  const [mobileSection, setMobileSection] = useState<DropdownKey | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'signin' | 'signup' }>({
    open: false,
    mode: 'signin',
  });

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileOpen]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      if (isMobileOpen) {
        setIsMobileOpen(false);
        setMobileSection(null);
        requestAnimationFrame(() => mobileTriggerRef.current?.focus());
        return;
      }

      setOpenMenu(null);
      setIsUserMenuOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileOpen]);

  const localizedDestinations = useMemo(
    () => destinations.map((destination) => ({
      ...destination,
      displayName: getLocalizedDestination(destination, locale).name,
    })),
    [locale],
  );

  const kenyaDestinations = useMemo(
    () => localizedDestinations.filter((destination) => destination.country === 'Kenya'),
    [localizedDestinations],
  );

  const eastAfricaDestinations = useMemo(
    () => localizedDestinations.filter((destination) => destination.country !== 'Kenya'),
    [localizedDestinations],
  );

  const dropdownMenus = useMemo<DropdownMenu[]>(
    () => [
      {
        key: 'safaris',
        label: t.nav.tours,
        items: [
          { label: t.nav.browseAllSafaris, href: '/tours' },
          { label: t.tours.private, href: '/tours?tab=private' },
          { label: t.tours.groupJoining, href: '/tours?tab=group' },
          { label: t.tours.dayTrips, href: '/tours?tab=day' },
        ],
      },
      {
        key: 'destinations',
        label: t.nav.destinations,
        items: [
          ...kenyaDestinations.map((destination) => ({
            label: destination.displayName,
            href: `/destinations/${destination.slug}`,
          })),
          ...eastAfricaDestinations.map((destination) => ({
            label: destination.displayName,
            href: `/destinations/${destination.slug}`,
          })),
          { label: t.nav.viewAllDestinations, href: '/destinations' },
        ],
      },
      {
        key: 'experiences',
        label: t.nav.services,
        items: [
          { label: t.nav.excursions, href: '/excursions' },
          { label: t.nav.transfers, href: '/transfers' },
          { label: t.nav.services, href: '/services' },
        ],
      },
    ],
    [eastAfricaDestinations, kenyaDestinations, t],
  );

  const directLinks = useMemo<MenuLink[]>(
    () => [
      { label: t.nav.travelGuide, href: '/travel-guide' },
      { label: t.nav.about, href: '/about' },
      { label: t.nav.contact, href: '/contact' },
    ],
    [t],
  );

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || t.nav.myAccount;

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
    setMobileSection(null);
  }, []);

  const openAuth = useCallback((mode: 'signin' | 'signup') => {
    closeMobile();
    setAuthModal({ open: true, mode });
  }, [closeMobile]);

  const handleDropdownKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, key: DropdownKey) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      setOpenMenu(key);

      requestAnimationFrame(() => {
        const links = navRef.current?.querySelectorAll<HTMLAnchorElement>(
          `[data-dropdown="${key}"] a`,
        );
        if (!links?.length) return;
        links[event.key === 'ArrowUp' ? links.length - 1 : 0].focus();
      });
    },
    [],
  );

  const navTextClass = isScrolled
    ? 'text-foreground hover:text-ocean-700'
    : 'text-white/90 hover:text-white';

  const dropdownPanelClass = isScrolled
    ? 'bg-white/95 border-border shadow-xl'
    : 'bg-white/95 border-white/30 shadow-2xl';

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Primary navigation"
        className={[
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 py-3 shadow-lg backdrop-blur-md'
            : 'border-b border-white/20 bg-white/10 py-5 backdrop-blur-md',
        ].join(' ')}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              prefetch
              aria-label="Bahari Asili Safaris home"
              className="flex shrink-0 items-center rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700 focus-visible:ring-offset-2"
            >
              <Image
                src="/images/logo/logo-horizontal.png"
                alt="Bahari Asili Safaris"
                width={1752}
                height={798}
                priority
                className="h-8 w-auto sm:h-10"
              />
            </Link>

            <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 xl:flex 2xl:gap-4">
              {dropdownMenus.map((menu) => {
                const isOpen = openMenu === menu.key;
                return (
                  <div
                    key={menu.key}
                    className="relative"
                    data-dropdown={menu.key}
                    onMouseEnter={() => setOpenMenu(menu.key)}
                    onMouseLeave={() => setOpenMenu((current) => current === menu.key ? null : current)}
                  >
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      onClick={() => setOpenMenu(isOpen ? null : menu.key)}
                      onKeyDown={(event) => handleDropdownKeyDown(event, menu.key)}
                      className={`inline-flex min-h-11 items-center gap-1 rounded-lg px-2.5 py-2 font-inter text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700 focus-visible:ring-offset-2 2xl:px-3 ${navTextClass}`}
                    >
                      {menu.label}
                      <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                      <div
                        className={`absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-2xl border p-2 backdrop-blur-xl ${dropdownPanelClass} ${menu.key === 'destinations' ? 'w-[min(42rem,calc(100vw-2rem))]' : 'w-64'}`}
                        role="menu"
                        aria-label={menu.label}
                      >
                        {menu.key === 'destinations' ? (
                          <div className="grid grid-cols-2 gap-2 p-1">
                            <div>
                              <p className="px-3 pb-1 pt-2 font-inter text-[10px] font-semibold uppercase tracking-[0.16em] text-ocean-700">
                                {t.nav.kenya}
                              </p>
                              {kenyaDestinations.map((destination) => (
                                <Link
                                  key={destination.slug}
                                  href={`/destinations/${destination.slug}`}
                                  prefetch
                                  role="menuitem"
                                  className="flex min-h-10 items-center rounded-xl px-3 py-2 font-inter text-sm text-foreground transition-colors hover:bg-sand-50 focus-visible:bg-sand-50 focus-visible:outline-none"
                                >
                                  {destination.displayName}
                                </Link>
                              ))}
                            </div>
                            <div className="border-l border-border pl-2">
                              <p className="px-3 pb-1 pt-2 font-inter text-[10px] font-semibold uppercase tracking-[0.16em] text-ocean-700">
                                {t.nav.eastAfrica}
                              </p>
                              {eastAfricaDestinations.map((destination) => (
                                <Link
                                  key={destination.slug}
                                  href={`/destinations/${destination.slug}`}
                                  prefetch
                                  role="menuitem"
                                  className="flex min-h-10 items-center rounded-xl px-3 py-2 font-inter text-sm text-foreground transition-colors hover:bg-sand-50 focus-visible:bg-sand-50 focus-visible:outline-none"
                                >
                                  {destination.displayName}
                                </Link>
                              ))}
                            </div>
                            <Link
                              href="/destinations"
                              prefetch
                              role="menuitem"
                              className="col-span-2 mt-1 flex min-h-10 items-center justify-center rounded-xl bg-ocean-50 px-3 py-2 font-inter text-sm font-semibold text-ocean-700 transition-colors hover:bg-ocean-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700"
                            >
                              {t.nav.viewAllDestinations}
                            </Link>
                          </div>
                        ) : (
                          menu.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              prefetch
                              role="menuitem"
                              className="flex min-h-11 items-center rounded-xl px-3 py-2.5 font-inter text-sm font-medium text-foreground transition-colors hover:bg-sand-50 focus-visible:bg-sand-50 focus-visible:outline-none"
                            >
                              {item.label}
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {directLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch
                  className={`inline-flex min-h-11 items-center rounded-lg px-2.5 py-2 font-inter text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700 focus-visible:ring-offset-2 2xl:px-3 ${navTextClass}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden shrink-0 items-center gap-2 xl:flex">
              <Link
                href="/build-your-safari"
                prefetch
                className={`inline-flex min-h-11 items-center justify-center rounded-full border-2 px-4 py-2 font-inter text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 2xl:px-5 ${isScrolled ? 'border-ocean-700 bg-ocean-700 text-white hover:bg-ocean-800 focus-visible:ring-ocean-700' : 'border-white bg-white/10 text-white hover:bg-white hover:text-ocean-700 focus-visible:ring-white'}`}
              >
                {t.nav.planMySafari}
              </Link>

              {!loading && (user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setIsUserMenuOpen((open) => !open);
                      setOpenMenu(null);
                    }}
                    aria-haspopup="true"
                    aria-expanded={isUserMenuOpen}
                    className={`inline-flex min-h-11 items-center gap-2 rounded-full px-3 py-2 font-inter text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700 focus-visible:ring-offset-2 ${isScrolled ? 'bg-white text-ocean-700 hover:bg-ocean-50' : 'text-white hover:bg-white/15'}`}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-safari-500">
                      <User aria-hidden="true" className="h-3.5 w-3.5 text-white" />
                    </span>
                    {t.authSession.myDashboard}
                    <ChevronDown aria-hidden="true" className={`h-3 w-3 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full z-50 mt-2 min-w-[220px] overflow-hidden rounded-xl border border-border bg-white shadow-xl" role="menu">
                      <div className="border-b border-border px-4 py-3">
                        <p className="truncate font-inter text-sm font-semibold text-foreground">{displayName}</p>
                        <p className="truncate font-inter text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        role="menuitem"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex min-h-11 items-center gap-2 px-4 py-3 font-inter text-sm text-foreground transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                      >
                        <User aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                        {t.authSession.myDashboard}
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          signOut();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex min-h-11 w-full items-center gap-2 border-t border-border px-4 py-3 text-left font-inter text-sm text-destructive transition-colors hover:bg-[#ef4444]/10 focus-visible:outline-none"
                      >
                        <LogOut aria-hidden="true" className="h-4 w-4" />
                        {t.nav.signOut}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setAuthModal({ open: true, mode: 'signin' })}
                    className={`min-h-11 rounded-lg px-2.5 py-2 font-inter text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700 focus-visible:ring-offset-2 ${navTextClass}`}
                  >
                    {t.nav.signIn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthModal({ open: true, mode: 'signup' })}
                    className={`min-h-11 rounded-full border-2 px-4 py-2 font-inter text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 2xl:px-5 ${isScrolled ? 'border-ocean-700 text-ocean-700 hover:bg-ocean-700 hover:text-white focus-visible:ring-ocean-700' : 'border-white text-white hover:bg-white hover:text-ocean-700 focus-visible:ring-white'}`}
                  >
                    {t.nav.register}
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 xl:hidden">
              <Link
                href="/build-your-safari"
                prefetch
                onClick={closeMobile}
                className={`hidden min-h-11 items-center rounded-full border-2 px-3 py-2 font-inter text-xs font-semibold sm:inline-flex ${isScrolled ? 'border-ocean-700 bg-ocean-700 text-white' : 'border-white bg-white/10 text-white'}`}
              >
                {t.nav.planMySafari}
              </Link>
              <button
                ref={mobileTriggerRef}
                type="button"
                onClick={() => {
                  setIsMobileOpen((open) => !open);
                  setOpenMenu(null);
                  setIsUserMenuOpen(false);
                }}
                aria-label={isMobileOpen ? t.nav.closeMenu : t.nav.openMenu}
                aria-expanded={isMobileOpen}
                aria-controls="mobile-navigation"
                className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700 focus-visible:ring-offset-2 ${isScrolled ? 'text-foreground' : 'text-white'}`}
              >
                {isMobileOpen ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {isMobileOpen && (
            <div
              id="mobile-navigation"
              className="mt-3 max-h-[calc(100vh-5.5rem)] overflow-y-auto rounded-2xl border border-border bg-white shadow-xl xl:hidden"
            >
              <div className="border-b border-border px-4 py-4">
                <p className="px-2 pb-2 font-inter text-[10px] font-semibold uppercase tracking-[0.16em] text-ocean-700">
                  {t.nav.planYourTrip}
                </p>
                <Link
                  href="/build-your-safari"
                  prefetch
                  onClick={closeMobile}
                  className="flex min-h-12 items-center justify-center rounded-xl bg-ocean-700 px-4 py-3 font-inter text-sm font-semibold text-white shadow-sm transition-colors hover:bg-ocean-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700 focus-visible:ring-offset-2"
                >
                  {t.nav.planMySafari}
                </Link>
              </div>

              <div className="px-4 py-3">
                <p className="px-2 pb-2 font-inter text-[10px] font-semibold uppercase tracking-[0.16em] text-ocean-700">
                  {t.nav.exploreSection}
                </p>
                {dropdownMenus.map((menu) => {
                  const expanded = mobileSection === menu.key;
                  return (
                    <div key={menu.key} className="border-b border-border last:border-b-0">
                      <button
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={`mobile-${menu.key}`}
                        onClick={() => setMobileSection(expanded ? null : menu.key)}
                        className="flex min-h-12 w-full items-center justify-between rounded-xl px-2 py-3 text-left font-inter text-base font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700"
                      >
                        {menu.label}
                        <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                      </button>
                      {expanded && (
                        <div id={`mobile-${menu.key}`} className="pb-2 pl-3">
                          {menu.key === 'destinations' ? (
                            <>
                              {[...kenyaDestinations, ...eastAfricaDestinations].map((destination) => (
                                <Link
                                  key={destination.slug}
                                  href={`/destinations/${destination.slug}`}
                                  prefetch
                                  onClick={closeMobile}
                                  className="flex min-h-11 items-center rounded-lg px-3 py-2.5 font-inter text-sm text-muted-foreground transition-colors hover:bg-sand-50 hover:text-ocean-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700"
                                >
                                  {destination.displayName}
                                </Link>
                              ))}
                              <Link
                                href="/destinations"
                                prefetch
                                onClick={closeMobile}
                                className="flex min-h-11 items-center rounded-lg px-3 py-2.5 font-inter text-sm font-semibold text-ocean-700 hover:bg-ocean-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700"
                              >
                                {t.nav.viewAllDestinations}
                              </Link>
                            </>
                          ) : (
                            menu.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                prefetch
                                onClick={closeMobile}
                                className="flex min-h-11 items-center rounded-lg px-3 py-2.5 font-inter text-sm text-muted-foreground transition-colors hover:bg-sand-50 hover:text-ocean-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700"
                              >
                                {item.label}
                              </Link>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {directLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch
                    onClick={closeMobile}
                    className="flex min-h-12 items-center rounded-xl px-2 py-3 font-inter text-base font-semibold text-foreground transition-colors hover:bg-sand-50 hover:text-ocean-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-border px-4 py-4">
                <p className="px-2 pb-2 font-inter text-[10px] font-semibold uppercase tracking-[0.16em] text-ocean-700">
                  {t.nav.accountSection}
                </p>

                {!loading && (user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-2 py-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-safari-500">
                        <User aria-hidden="true" className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-inter text-sm font-semibold text-foreground">{displayName}</p>
                        <p className="truncate font-inter text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      prefetch
                      onClick={closeMobile}
                      className="flex min-h-11 items-center justify-center rounded-xl bg-ocean-700 px-4 py-2.5 font-inter text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700 focus-visible:ring-offset-2"
                    >
                      {t.authSession.myDashboard}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        signOut();
                        closeMobile();
                      }}
                      className="flex min-h-11 w-full items-center justify-center rounded-xl border border-destructive/30 px-4 py-2.5 font-inter text-sm font-medium text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                    >
                      {t.nav.signOut}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => openAuth('signin')}
                      className="min-h-11 rounded-xl border border-border px-4 py-2.5 font-inter text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700"
                    >
                      {t.nav.signIn}
                    </button>
                    <button
                      type="button"
                      onClick={() => openAuth('signup')}
                      className="min-h-11 rounded-xl bg-ocean-700 px-4 py-2.5 font-inter text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700 focus-visible:ring-offset-2"
                    >
                      {t.nav.register}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal({ open: false, mode: 'signin' })}
        defaultMode={authModal.mode}
      />
    </>
  );
}
