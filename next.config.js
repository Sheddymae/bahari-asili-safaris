/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    // CMS images are stored in Supabase Storage and selected at runtime from the admin Media Library.
    // Allow Supabase's project storage host so next/image can optimize those customer-facing images.
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
};
module.exports = nextConfig;
