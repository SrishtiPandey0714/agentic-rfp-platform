/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  experimental: {
    isrMemoryCacheSize: 0, // Disable ISR cache
  },
  // Add any other configurations you need
}

module.exports = nextConfig
