/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  swcMinify: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**'
      }
    ]
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude 'canvas' from client-side bundling
      config.externals.push('canvas')
    }

    return config
  },

  experimental: {
    optimizeCss: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
      },
      resolveAlias: {
        underscore: 'lodash',
        mocha: { browser: 'mocha/browser-entry.js' }
      }
    }
  },

  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}'
    }
  },

  reactStrictMode: true
}

module.exports = nextConfig
