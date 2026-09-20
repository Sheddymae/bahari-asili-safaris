import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import PageShell from '@/components/PageShell';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getPost(slug: string) {
  const admin = getSupabaseAdmin();
  const { data } = await admin.from('cms_content').select('*').eq('content_type', 'blog').eq('locale', 'en').eq('slug', slug).eq('status', 'published').maybeSingle();
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Article not found — Bahari Asili Safaris' };
  return { title: post.seo_title || post.title, description: post.seo_description || post.excerpt || undefined, alternates: { canonical: `/blog/${post.slug}` }, openGraph: { title: post.title, description: post.excerpt || undefined, images: post.image ? [post.image] : undefined } };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return <PageShell><article className="bg-sand-50 py-12 lg:py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"><header className="mb-10">{post.category && <p className="mb-3 text-xs font-bold uppercase tracking-widest text-safari-500">{post.category}</p>}<h1 className="font-poppins text-3xl font-bold text-foreground sm:text-5xl">{post.title}</h1>{(post.author || post.published_at) && <p className="mt-4 text-sm text-muted-foreground">{post.author ? `By ${post.author}` : ''}{post.author && post.published_at ? ' · ' : ''}{post.published_at ? new Date(post.published_at).toLocaleDateString() : ''}</p>}</header>{post.image && <div className="relative mb-10 h-64 overflow-hidden rounded-2xl sm:h-96"><Image src={post.image} alt={post.title} fill sizes="100vw" className="object-cover" priority /></div>}<div className="rounded-2xl bg-white p-6 shadow-sm sm:p-10"><p className="mb-8 text-lg leading-8 text-muted-foreground">{post.excerpt}</p><div className="whitespace-pre-wrap font-inter text-base leading-8 text-foreground">{post.body}</div></div></div></article></PageShell>;
}
