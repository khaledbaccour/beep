/** @type {import('next').NextConfig} */
const nextConfig = {
  // 'standalone' is only needed for Docker; Vercel handles bundling automatically.
  // Set NEXT_OUTPUT=standalone in Docker builds if needed.
  ...(process.env.NEXT_OUTPUT === 'standalone' ? { output: 'standalone' } : {}),
};

module.exports = nextConfig;
