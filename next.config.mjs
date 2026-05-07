/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1"],
  // Body size limit for API routes (moved from experimental)
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export default nextConfig;
