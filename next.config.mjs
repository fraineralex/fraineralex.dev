import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  productionBrowserSourceMaps: true,
	experimental: {
		mdxRs: true,
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

export default withContentlayer(nextConfig);
