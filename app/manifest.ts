import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bahari Asili Safaris',
    short_name: 'Bahari Asili',
    description: 'Kenya safaris, coastal excursions and transfers from Watamu.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f5ee',
    theme_color: '#0e7490',
    icons: [
      { src: '/images/logo/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/images/logo/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
