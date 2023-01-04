const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: process.env.NODE_ENV === 'production',
  swcMinify: true,

  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../')
  }
}

module.exports = nextConfig
