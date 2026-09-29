const allowedTags = new Set(['p','br','strong','b','em','i','u','h1','h2','h3','blockquote','ul','ol','li','a','span']);

export function sanitizeRichText(input: unknown): string {
  if (typeof input !== 'string') return '';
  let html = input;
  html = html.replace(/<\/?(script|style|iframe|object|embed|form|input|button|textarea|select|svg|math)[^>]*>/gi, '');
  html = html.replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  html = html.replace(/javascript\s*:/gi, '');

  html = html.replace(/<([a-z0-9-]+)([^>]*)>/gi, (full, rawTag, rawAttrs) => {
    const tag = String(rawTag).toLowerCase();
    if (!allowedTags.has(tag)) return '';
    if (tag === 'br') return '<br>';
    if (tag === 'a') {
      const match = String(rawAttrs).match(/href\s*=\s*["']([^"']+)["']/i);
      if (!match) return '<a>';
      const href = match[1].trim();
      if (!/^(https?:\/\/|mailto:|tel:|\/)/i.test(href)) return '<a>';
      return `<a href="${href.replace(/"/g, '&quot;')}"${href === '/booking' || href === '/contact' ? ' class="content-cta"' : ''} rel="noopener noreferrer">`;
    }
    if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'p' || tag === 'blockquote') {
      const alignment = String(rawAttrs).match(/text-align\s*:\s*(left|center|right)/i);
      return alignment ? `<${tag} style="text-align:${alignment[1].toLowerCase()}">` : `<${tag}>`;
    }
    if (tag === 'span') {
      const size = String(rawAttrs).match(/font-size\s*:\s*(0\.9rem|1rem|1.15rem)/i);
      return size ? `<span style="font-size:${size[1]}">` : '<span>';
    }
    return `<${tag}>`;
  });

  html = html.replace(/<\/([a-z0-9-]+)>/gi, (full, rawTag) => {
    const tag = String(rawTag).toLowerCase();
    return allowedTags.has(tag) ? `</${tag}>` : '';
  });
  return html.trim();
}

export function richTextToHtml(value: string | null | undefined): string {
  if (!value) return '<p></p>';
  return /<[a-z][\s\S]*>/i.test(value)
    ? sanitizeRichText(value)
    : value.split(/\n\s*\n/).map(block => `<p>${block.trim().replace(/\n/g, '<br>')}</p>`).filter(x => x !== '<p></p>').join('');
}
