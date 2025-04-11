import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

const nextConfig = {
  reactStrictMode: true,
} as const;

const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
} as const;

// @ts-ignore - Ignoring type mismatch between next-pwa and Next.js types
const config = withPWA(pwaConfig)(nextConfig);

export default config;