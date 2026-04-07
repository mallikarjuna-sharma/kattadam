/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@kattadam/data-layer"],
  experimental: {
    instrumentationHook: true,
  },
};

module.exports = nextConfig;
