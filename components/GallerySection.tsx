'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/ScrollReveal';
import { getGalleryImages, type GalleryImageRow } from '@/lib/supabase';

type CategoryKey = 'safari' | 'coast' | 'culture' | 'marine' | 'sunsets';

interface GalleryImage {
  id: number | string;
  src: string;
  alt: string;
  caption: string;
  category: CategoryKey;
}

// Static fallback — used only if the `gallery_images` table isn't reachable
// yet (Supabase not configured, or migration not run). Keeps the section
// working out of the box; captions here mirror the DB seed data.
const fallbackImages: GalleryImage[] = [
  { id: 'fallback-1', src: '/images/gallery/safari-lions.png', alt: 'African lions pride resting in golden grassland', caption: 'Tsavo East — a pride resting off the Voi road, 7am', category: 'safari' },
  { id: 'fallback-2', src: '/images/gallery/safari-elephants.png', alt: 'Herd of African elephants in savanna landscape', caption: 'Tsavo East — red-dust elephants near Aruba Dam', category: 'safari' },
  { id: 'fallback-3', src: '/images/gallery/safari-giraffe.png', alt: 'Tall giraffe standing in Kenyan savanna', caption: 'Taita Hills — Maasai giraffe at sundown', category: 'safari' },
  { id: 'fallback-4', src: '/images/gallery/safari-zebra.png', alt: 'Wild zebra herd grazing in African savanna', caption: 'Amboseli — zebra herd with Kilimanjaro behind', category: 'safari' },
  { id: 'fallback-5', src: '/images/gallery/safari-sunset.png', alt: 'Golden sunset over African savanna', caption: 'Tsavo — sunset over the Yatta Plateau', category: 'sunsets' },
  { id: 'fallback-6', src: '/images/gallery/coast-beach.png', alt: 'Tropical Kenyan beach paradise with white sand', caption: 'Watamu — the beach in front of our office', category: 'coast' },
  { id: 'fallback-7', src: '/images/gallery/marine-coral.png', alt: 'Colorful coral reef and tropical marine life', caption: 'Watamu Marine Park — coral gardens snorkel stop', category: 'marine' },
  { id: 'fallback-8', src: '/images/gallery/safari-leopard.png', alt: 'Spotted leopard resting on acacia tree branch', caption: 'Tsavo West — leopard spotted by guide Joseph', category: 'safari' },
  { id: 'fallback-9', src: '/images/gallery/lodge-luxury.png', alt: 'Luxury safari lodge exterior with thatched roof', caption: 'Voi Wildlife Lodge — main lodge at golden hour', category: 'safari' },
];

const ROTATE_MS = 5000;
const CROSSFADE_MS = 1200;
const SLOTS = 6; // strict 3 columns x 2 rows

/**
 * CrossfadeCell
 *
 * Renders one grid cell. Every image assigned to this cell is stacked
 * absolutely on top of each other; only the `pos`-th one has opacity 1.
 * Because all layers share the same CSS opacity transition, the outgoing
 * image fades out and the incoming one fades in at the same time — a true
 * crossfade with no gap and no dependency on mount/unmount animation
 * timing (which is what made the previous AnimatePresence-driven grid
 * intermittently render nothing).
 */
function CrossfadeCell({
  track,
  paused,
  onOpen,
}: {
  track: GalleryImage[];
  paused: boolean;
  onOpen: (img: GalleryImage) => void;
}) {
  const [pos, setPos] = useState(0);

  useEffect(() => {
    if (paused || track.length <= 1) return;
    const id = setInterval(() => {
      setPos((p) => (p + 1) % track.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [paused, track.length]);

  if (track.length === 0) return null;
  const activeImg = track[pos];

  return (
    <button
      onClick={() => onOpen(activeImg)}
      className="group relative w-full h-full rounded-2xl overflow-hidden shadow-card"
    >
      {track.map((img, i) => (
        <div
          key={img.id}
          className="absolute inset-0"
          style={{
            opacity: i === pos ? 1 : 0,
            transition: `opacity ${CROSSFADE_MS}ms ease-in-out`,
          }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <p className="absolute bottom-2 left-2 right-2 font-inter text-[11px] text-white opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2 text-left">
        {activeImg.caption}
      </p>
    </button>
  );
}

export default function GallerySection() {
  const { t } = useLanguage();
  const [dbImages, setDbImages] = useState<GalleryImage[] | null>(null);
  const [active, setActive] = useState<CategoryKey | 'all'>('all');
  const [paused, setPaused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getGalleryImages().then((rows: GalleryImageRow[]) => {
      if (cancelled || rows.length === 0) return;
      setDbImages(
        rows.map((r) => ({
          id: r.id,
          src: r.src,
          alt: r.alt,
          caption: r.caption || r.alt,
          category: r.category,
        }))
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const images = dbImages ?? fallbackImages;

  const categories: { key: CategoryKey | 'all'; label: string }[] = [
    { key: 'all', label: t.gallery?.filters?.all ?? 'All' },
    { key: 'safari', label: t.gallery?.filters?.safari ?? 'Safari & Wildlife' },
    { key: 'coast', label: t.gallery?.filters?.coast ?? 'Watamu & the Coast' },
    { key: 'culture', label: t.gallery?.filters?.culture ?? 'Culture & Heritage' },
    { key: 'marine', label: t.gallery?.filters?.marine ?? 'Marine & Snorkeling' },
  ];

  const filtered = useMemo(
    () => (active === 'all' ? images : images.filter((img) => img.category === active)),
    [active, images]
  );

  // Split the filtered set round-robin into SLOTS tracks, one per grid cell.
  // Each cell independently crossfades through its own track, so as soon as
  // there's at least 1 image per cell something renders — no pagination,
  // no page-count/dots math that can silently end up empty.
  const tracks = useMemo(() => {
    const t: GalleryImage[][] = Array.from({ length: SLOTS }, () => []);
    filtered.forEach((img, i) => {
      t[i % SLOTS].push(img);
    });
    return t.filter((track) => track.length > 0);
  }, [filtered]);

  const closeLightbox = () => setLightboxIndex(null);
  const showPrev = () =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  const showNext = () => setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
  const openLightbox = (img: GalleryImage) => {
    const idx = filtered.findIndex((f) => f.id === img.id);
    if (idx !== -1) setLightboxIndex(idx);
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex]);

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-ocean-50 border border-ocean-100 rounded-full px-4 py-1.5 mb-4">
              <Camera className="w-3.5 h-3.5 text-ocean-700" />
              <span className="font-inter text-xs font-semibold text-ocean-700 uppercase tracking-wider">
                {t.gallery?.label ?? 'Gallery'}
              </span>
            </div>
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-3">
              {t.gallery?.title ?? 'Moments from the journey'}
            </h2>
            <p className="font-inter text-muted-foreground text-base max-w-2xl mx-auto">
              {t.gallery?.subtitle ?? 'Wildlife, coastline and everything in between'}
            </p>
          </div>
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal delay={80}>
          <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActive(cat.key)}
                className={`font-inter text-sm font-medium px-5 py-2 rounded-full border transition-all ${
                  active === cat.key
                    ? 'bg-ocean-700 text-white border-ocean-700 shadow-sm'
                    : 'bg-white text-foreground border-border hover:border-ocean-600 hover:text-ocean-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Strict 3x2 grid, each cell crossfading through its own track */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative"
        >
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
            style={{ gridAutoRows: '180px' }}
          >
            {tracks.map((track) => (
              <CrossfadeCell
                key={track[0].id}
                track={track}
                paused={paused || lightboxIndex !== null}
                onOpen={openLightbox}
              />
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="font-inter text-muted-foreground">{t.gallery?.comingSoon ?? 'Photo coming soon'}</p>
          </div>
        )}
      </div>

      {/* Lightbox — shows the human caption, not a generic "Image N" */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center animate-fade-in"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={filtered[lightboxIndex].alt}
        >
          <button
            onClick={closeLightbox}
            aria-label="Close"
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-7 h-7" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); showPrev(); }}
            aria-label="Previous image"
            className="absolute left-3 sm:left-6 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="flex flex-col items-center gap-4 max-w-4xl w-full px-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-[90vw] sm:w-full h-[65vh]">
              <Image src={filtered[lightboxIndex].src} alt={filtered[lightboxIndex].alt} fill sizes="90vw" className="object-contain" />
            </div>
            <p className="font-inter text-sm sm:text-base text-white/90 text-center max-w-2xl">
              {filtered[lightboxIndex].caption}
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            aria-label="Next image"
            className="absolute right-3 sm:right-6 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </section>
  );
}