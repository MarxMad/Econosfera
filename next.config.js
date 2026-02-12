/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // En dev, evitar caché de webpack que puede dejar referencias a chunks viejos (ej. 174.js)
  webpack: (config, { dev }) => {
    if (dev) config.cache = false;
    return config;
  },
};
module.exports = nextConfig;
