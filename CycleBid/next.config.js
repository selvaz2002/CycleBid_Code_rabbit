const path = require('path')

/** @type {import('next').NextConfig} */

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
  reactStrictMode: false,
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  },
}
