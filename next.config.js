/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  // The booking API reads EMAIL_TO server-side. Keep the production admin
  // recipient deterministic so a missing Vercel EMAIL_TO variable cannot
  // silently disable owner notifications.
  env: {
    EMAIL_TO: 'sheddymae02@gmail.com',
  },
};
module.exports = nextConfig;
