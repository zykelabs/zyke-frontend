/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site: `next build` writes ./out, which can be served from
  // GitHub Pages, Vercel, Netlify, S3, or any plain web server.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
