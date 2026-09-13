'use client';

import { BookOpen } from 'lucide-react';
import PageShell from '@/components/PageShell';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BlogPage() {
  const { t } = useLanguage();
  return (
    <PageShell>
      <section className="py-24 lg:py-32 bg-sand-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-ocean-50 flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 text-ocean-700" />
          </div>
          <h1 className="font-poppins font-bold text-3xl text-foreground mb-3">{t.blog.comingSoonTitle}</h1>
          <p className="font-inter text-muted-foreground">
            {t.blog.comingSoonDesc}
          </p>
        </div>
      </section>
    </PageShell>
  );
}
