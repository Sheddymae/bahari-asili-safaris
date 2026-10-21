'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { ArrowRight, Check, Copy, Mail, MapPin, MessageCircle, Share2 } from 'lucide-react';

export type BrandButtonVariant = 'primary' | 'secondary' | 'accent';

type BrandButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: BrandButtonVariant;
  children: ReactNode;
};

export function BrandButton({
  href,
  variant = 'primary',
  className = '',
  children,
  type = 'button',
  ...buttonProps
}: BrandButtonProps) {
  const classes = `button-brand button-brand--${variant} ${className}`.trim();
  if (href) {
    return <Link href={href} className={classes} aria-disabled={buttonProps.disabled || undefined}>{children}</Link>;
  }
  return <button {...buttonProps} type={type} className={classes}>{children}</button>;
}

export function Section({
  children,
  className = '',
  id,
  tone = 'default',
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: 'default' | 'sand' | 'ocean';
}) {
  const toneClass = tone === 'sand' ? 'bg-[var(--brand-sand)]' : tone === 'ocean' ? 'bg-[var(--brand-primary-deep)] text-white' : 'bg-white';
  return <section id={id} className={`section-brand ${toneClass} ${className}`.trim()}><div className="container-brand">{children}</div></section>;
}

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--brand-sand)]">
      {image ? (
        <div className="absolute inset-0 -z-10">
          <Image src={image} alt={imageAlt || ''} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
        </div>
      ) : null}
      <div className={`container-brand py-14 sm:py-20 lg:py-28 ${image ? 'text-white' : ''}`}>
        {eyebrow ? <p style={image ? { color: '#fff' } : undefined} className="eyebrow-brand">{eyebrow}</p> : null}
        <h1 style={image ? { color: '#fff' } : undefined} className="heading-display">{title}</h1>
        {description ? <p style={image ? { color: 'rgb(255 255 255 / 0.9)' } : undefined} className="body-readable mt-5 text-base sm:text-lg">{description}</p> : null}
        {children ? <div className="mt-7 flex flex-wrap items-center gap-3">{children}</div> : null}
      </div>
    </section>
  );
}

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 text-sm">
      <ol className="flex flex-wrap items-center gap-2 text-[var(--brand-text-muted)]">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href && index < items.length - 1
              ? <Link href={item.href} className="underline-offset-4 hover:underline focus-visible:underline">{item.label}</Link>
              : <span aria-current={index === items.length - 1 ? 'page' : undefined}>{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function BrandBadge({ children, tone = 'ocean' }: { children: ReactNode; tone?: 'ocean' | 'sand' | 'accent' | 'neutral' }) {
  const styles = {
    ocean: 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary-deep)]',
    sand: 'bg-[var(--brand-sand)] text-[var(--brand-text)]',
    accent: 'bg-[var(--brand-secondary)]/20 text-[var(--brand-text)]',
    neutral: 'bg-slate-100 text-slate-800',
  };
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold leading-5 ${styles[tone]}`}>{children}</span>;
}

type ImageCardProps = {
  title: string;
  href: string;
  image: string;
  imageAlt: string;
  description?: string;
  eyebrow?: string;
  duration?: string;
  tags?: string[];
  priceLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

function ImageCard({
  title, href, image, imageAlt, description, eyebrow, duration, tags = [],
  priceLabel, secondaryHref, secondaryLabel,
}: ImageCardProps) {
  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--brand-border)] bg-white shadow-[var(--shadow-sm)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-[var(--brand-sand)] focus-visible:outline-offset-[-4px]" aria-label={title}>
        <Image src={image} alt={imageAlt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        {duration ? <span className="absolute left-3 top-3"><BrandBadge>{duration}</BrandBadge></span> : null}
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {eyebrow ? <p className="mb-2 text-xs font-bold uppercase tracking-[.12em] text-[var(--brand-primary-deep)]">{eyebrow}</p> : null}
        <h3 className="text-xl font-bold leading-snug text-[var(--brand-text)]">{title}</h3>
        {description ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--brand-text-muted)]">{description}</p> : null}
        {tags.length ? <div className="mt-4 flex flex-wrap gap-2">{tags.map(tag => <BrandBadge key={tag} tone="sand">{tag}</BrandBadge>)}</div> : null}
        <div className="mt-auto pt-5">
          {priceLabel ? <p className="mb-4 text-sm font-semibold text-[var(--brand-text)]">{priceLabel}</p> : null}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href={href} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--brand-primary-deep)] underline-offset-4 hover:underline">
              View details <ArrowRight aria-hidden="true" size={16} />
            </Link>
            {secondaryHref && secondaryLabel ? <Link href={secondaryHref} className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--brand-text-muted)] underline underline-offset-4 hover:text-[var(--brand-primary-deep)]">{secondaryLabel}</Link> : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export function SafariCard(props: ImageCardProps) { return <ImageCard {...props} />; }
export function DestinationTile(props: ImageCardProps) { return <ImageCard {...props} />; }
export function ExcursionCard(props: ImageCardProps) { return <ImageCard {...props} />; }

export function TrustStrip({ items }: { items: Array<{ label: string; detail?: string }> }) {
  return (
    <div className="border-y border-[var(--brand-border)] bg-white">
      <ul className="container-brand grid grid-cols-1 divide-y divide-[var(--brand-border)] py-2 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
        {items.map(item => <li key={item.label} className="flex min-h-16 items-center gap-3 px-3 py-3 sm:border-r sm:last:border-r-0">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary-deep)]"><Check size={18} aria-hidden="true" /></span>
          <span><span className="block text-sm font-semibold text-[var(--brand-text)]">{item.label}</span>{item.detail ? <span className="mt-0.5 block text-xs leading-5 text-[var(--brand-text-muted)]">{item.detail}</span> : null}</span>
        </li>)}
      </ul>
    </div>
  );
}

export function ReviewSlot({ title = 'Guest reviews', message = 'Verified guest feedback will appear here once approved for publication.' }: { title?: string; message?: string }) {
  return (
    <section aria-label={title} className="rounded-[var(--radius-lg)] border border-dashed border-[var(--brand-border)] bg-[var(--brand-surface-soft)] p-6 sm:p-8">
      <p className="font-semibold text-[var(--brand-text)]">{title}</p>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--brand-text-muted)]">{message}</p>
    </section>
  );
}

export function FAQAccordion({ items }: { items: Array<{ question: string; answer: ReactNode }> }) {
  return (
    <div className="divide-y divide-[var(--brand-border)] border-y border-[var(--brand-border)]">
      {items.map(item => <details key={item.question} className="group py-4">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[var(--brand-text)] marker:content-none focus-visible:rounded-sm">
          {item.question}
          <span aria-hidden="true" className="text-xl text-[var(--brand-primary)] transition-transform group-open:rotate-45">+</span>
        </summary>
        <div className="max-w-[68ch] pb-2 pt-3 text-sm leading-7 text-[var(--brand-text-muted)]">{item.answer}</div>
      </details>)}
    </div>
  );
}

export function ShareBar({ title, url }: { title: string; url?: string }) {
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState('');
  const getUrl = () => url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = () => `${title} ${getUrl()}`;
  const copyLink = async () => {
    setShareError('');
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setShareError('Copy is unavailable in this browser. Select and copy the page URL.');
    }
  };
  const nativeShare = async () => {
    setShareError('');
    if (!navigator.share) {
      await copyLink();
      return;
    }
    try { await navigator.share({ title, text: title, url: getUrl() }); }
    catch (error) { if (error instanceof Error && error.name !== 'AbortError') setShareError('Sharing is unavailable right now.'); }
  };
  const encoded = encodeURIComponent(shareText());
  const mailto = `mailto:?subject=${encodeURIComponent(title)}&body=${encoded}`;
  const whatsapp = `https://wa.me/?text=${encoded}`;
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Share this page">
      <a className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[var(--brand-border)] px-3 text-sm font-semibold text-[var(--brand-text)] hover:bg-[var(--brand-sand)]" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} aria-hidden="true" /> WhatsApp</a>
      <a className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[var(--brand-border)] px-3 text-sm font-semibold text-[var(--brand-text)] hover:bg-[var(--brand-sand)]" href={mailto}><Mail size={16} aria-hidden="true" /> Email</a>
      <button type="button" onClick={copyLink} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[var(--brand-border)] px-3 text-sm font-semibold text-[var(--brand-text)] hover:bg-[var(--brand-sand)]">{copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}{copied ? 'Copied' : 'Copy link'}</button>
      <button type="button" onClick={nativeShare} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[var(--brand-border)] px-3 text-sm font-semibold text-[var(--brand-text)] hover:bg-[var(--brand-sand)]"><Share2 size={16} aria-hidden="true" /> Share</button>
      {shareError ? <p role="status" className="basis-full text-sm text-[var(--brand-text-muted)]">{shareError}</p> : null}
    </div>
  );
}

export function FormField({
  label,
  id,
  error,
  hint,
  children,
  required = false,
}: {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-[var(--brand-text)]">{label}{required ? <span aria-hidden="true"> *</span> : null}</label>
      {children}
      {hint ? <p id={`${id}-hint`} className="text-xs leading-5 text-[var(--brand-text-muted)]">{hint}</p> : null}
      {error ? <p id={`${id}-error`} role="alert" className="text-sm font-medium text-red-700">{error}</p> : null}
    </div>
  );
}

export function MobileStickyBar({
  whatsappHref,
  planHref = '/build-your-safari',
  planLabel = 'Plan my safari',
  whatsappLabel = 'WhatsApp',
}: {
  whatsappHref: string;
  planHref?: string;
  planLabel?: string;
  whatsappLabel?: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--brand-border)] bg-white/95 p-3 pb-[calc(.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgb(17_51_59_/_8%)] backdrop-blur sm:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="button-brand button-brand--secondary"><MessageCircle size={17} aria-hidden="true" /> {whatsappLabel}</a>
        <Link href={planHref} className="button-brand button-brand--primary">{planLabel} <ArrowRight size={17} aria-hidden="true" /></Link>
      </div>
    </div>
  );
}

export function LocationLabel({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 text-sm text-[var(--brand-text-muted)]"><MapPin size={15} aria-hidden="true" />{children}</span>;
}
