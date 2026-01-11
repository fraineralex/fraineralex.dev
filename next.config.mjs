import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
	images: {
		formats: ['image/avif', 'image/webp'],
		minimumCacheTTL: 31536000, // 1 year cache for images
	},
	async rewrites() {
    return [
      {
        source: '/',
        destination: '/en',
        locale: false
      },
      {
        source: '/projects',
        destination: '/en/projects',
        locale: false
      },
      {
        source: '/blog/:slug*',
        destination: '/en/blog/:slug*',
        locale: false
      },
    ]
  }
};

const withMDX = createMDX({})

export default withMDX(nextConfig);
