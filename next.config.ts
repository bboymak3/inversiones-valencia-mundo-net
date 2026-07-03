import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages: usa el adapter @cloudflare/next-on-pages
  output: undefined,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  images: {
    // Cloudflare Pages no soporta el optimizador de imágenes nativo
    unoptimized: true,
  },
};

export default nextConfig;
