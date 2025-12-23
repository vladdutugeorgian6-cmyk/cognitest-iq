/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      // Ignoră erorile de stil la construire
      ignoreDuringBuilds: true,
    },
    typescript: {
      // Ignoră erorile de tipuri la construire
      ignoreBuildErrors: true,
    },
  }
  
  module.exports = nextConfig





