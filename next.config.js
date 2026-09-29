/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // CMS images are stored in Supabase Storage and selected at runtime from the admin Media Library.
    // Allow Supabase's project storage host so next/image can optimize those customer-facing images.
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
  // The booking API reads EMAIL_TO server-side. Keep the production admin
  // recipient deterministic so a missing Vercel EMAIL_TO variable cannot
  // silently disable owner notifications.
  env: {
    EMAIL_TO: 'bahariasilisafaris@gmail.com',
  },
};
module.exports = nextConfig;
