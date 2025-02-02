/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static1.anpoimages.com",
      },
    ],
  },
};

export default nextConfig;
