/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development', // Disable PWA in development mode
  });
  
  const nextConfig = {
  };
  
  module.exports = withPWA(nextConfig);
  