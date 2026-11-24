import type { Metadata } from 'next';
import BlogContentClient from '@/components/BlogContentClient';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const metadata: Metadata = {
  title: 'Kenya Safari Blog & Travel Stories',
  description: 'Kenya travel stories, safari guides, destination advice and practical planning ideas for your East African trip.',
  openGraph: { title: 'Kenya Safari Blog & Travel Stories', description: 'Kenya travel stories, safari guides, destination advice and practical planning ideas for your East African trip.', type: 'website', url: '/blog' },
  twitter: { card: 'summary', title: 'Kenya Safari Blog & Travel Stories', description: 'Kenya travel stories, safari guides, destination advice and practical planning ideas for your East African trip.' },
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  let posts: any[] = [];
  try {
    const admin = getSupabaseAdmin();
    const { data } = await admin.from('cms_content').select('slug,title,excerpt,image,category,author,published_at').eq('content_type', 'blog').eq('locale', 'en').eq('status', 'published').order('published_at', { ascending: false });
    posts = data || [];
  } catch {
    posts = [];
  }
  return <BlogContentClient posts={posts} />;
}
