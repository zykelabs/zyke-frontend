/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
      return config
  },eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
