/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
      return config
  },
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
