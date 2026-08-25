import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'ecommerce.routemisr.com' },
    ],
    minimumCacheTTL: 60,
  },
  compress: true,
  experimental: {
    optimizePackageImports: ['react-icons', 'framer-motion', 'lucide-react'],
  },
  reactStrictMode: true,
};

export default nextConfig;