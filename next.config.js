/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  // lib/pdf-brand.ts and lib/pdf-stamp.ts load public/images/logo/logo-horizontal.png
  // and public/images/bahari-asili-stamp.png with fs.readFile() at request time so
  // the PDF generators (invoice/voucher/itinerary/quotation/receipt) can embed them.
  // Next's serverless file tracer can't see through that dynamic path, so on Vercel
  // those two PNGs were never copied into the API routes' function bundles —
  // fs.readFile() then throws ENOENT, the catch in loadBrandLogo()/loadBrandStamp()
  // swallows it, and the PDF silently renders with a text-only header and no stamp.
  // This explicitly includes both files in every API route's bundle so they're
  // actually present at runtime in production, not just in `next dev`.
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': [
        './public/images/logo/logo-horizontal.png',
        './public/images/bahari-asili-stamp.png',
      ],
    },
  },
};
module.exports = nextConfig;
