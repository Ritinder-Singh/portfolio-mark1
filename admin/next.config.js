/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Base path for deployment behind reverse proxy
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Allow images from external sources
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

module.exports = nextConfig;
