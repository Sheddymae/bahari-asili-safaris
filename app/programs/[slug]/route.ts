import { safaris } from '@/lib/safari-catalogue';
import { buildProgramGuide } from '@/lib/program-guide';
import { programMarkdown } from '@/lib/program-markdown';
import { SITE_URL } from '@/lib/site';


export const dynamic = 'force-static';

export function generateStaticParams() {
  return safaris.map((safari) => ({ slug: safari.id }));
}

/**
 * Markdown version of a program page. Accepts both /programs/{slug} and
 * /programs/{slug}.md so it can be linked from llms.txt and fetched by
 * assistants that do not execute JavaScript.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = decodeURIComponent(slug).replace(/\.md$/i, '');
  const safari = safaris.find((item) => item.id === id);

  if (!safari) {
    return new Response('Program not found', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  const site = SITE_URL;
  const body = programMarkdown(safari, buildProgramGuide(safari), site);

  return new Response(body, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
      'x-robots-tag': 'index, follow',
    },
  });
}
