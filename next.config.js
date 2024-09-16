/** @type {import('next').NextConfig} */
const nextConfig = {
  turboMode: true, // Enable Turbo Mode for faster builds and better performance
  optimizeFonts: true,
  optimizeCss: true,
  compress: true,
  poweredByHeader: false, // Remove X-Powered-By header for security
  generateEtags: false, // Disable ETag generation if not needed
  swcMinify: true,
  // Minimize inline JavaScript for faster First Contentful Paint
  httpAgentOptions: {
    keepAlive: false
  },
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
    optimizeCss: true // Optimize CSS for better performance
  },
  compress: true, // Enable gzip compression for responses
  swcMinify: true, // Use SWC for faster builds and smaller output
  modularizeImports: {
    // Example to reduce bundle size by modularizing libraries
    lodash: {
      transform: 'lodash/{{member}}'
    }
  }
}

module.exports = nextConfig
