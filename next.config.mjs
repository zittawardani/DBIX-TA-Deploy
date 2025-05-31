/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  env: {
    UNISAT_API_KEY: process.env.UNISAT_API_KEY
  },
  images: {
    remotePatterns: [
      {
        hostname: 'next-cdn.unisat.io',
        protocol: 'https'
      }
    ]
  }
};

export default nextConfig;
