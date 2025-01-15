/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development', // Disable PWA in development mode
  });
  
  const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'my-blob-store.public.blob.vercel-storage.com',
          port: '',
        },
      ],
    },
  };
  
  module.exports = withPWA(nextConfig);
  