/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Use frontend as Turbopack root when using `npm run dev:turbopack` (avoids lockfile warning)
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
