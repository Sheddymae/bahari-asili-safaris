import { safaris } from '@/lib/safari-catalogue';
import { buildProgramGuide } from '@/lib/program-guide';
import { programMarkdown } from '@/lib/program-markdown';
import { SITE_URL } from '@/lib/site';
import { findSafariByRouteSlug, safariRouteSlug } from '@/lib/safari-slugs';


export const dynamic = 'force-static';

export function generateStaticParams() {
  return safaris.map((safari) => ({ slug: safariRouteSlug(safari) }));
}

/**
 * Markdown version of a program page. Accepts both /programs/{slug} and
 * /programs/{slug}.md so it can be linked from llms.txt and fetched by
 * assistants that do not execute JavaScript.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = decodeURIComponent(slug).replace(/\.md$/i, '');
  const safari = findSafariByRouteSlug(safaris, id);

  if (!safari) {
    return new Response('Program not found', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  const routeSlug = safariRouteSlug(safari);
  if (routeSlug !== id) {
    return Response.redirect(new URL(`/programs/${routeSlug}.md`, SITE_URL), 301);
  }
  const site = SITE_URL;
  const guide = { ...buildProgramGuide(safari), slug: routeSlug };
  const body = programMarkdown(safari, guide, site);

  return new Response(body, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
      'x-robots-tag': 'index, follow',
    },
  });
}
