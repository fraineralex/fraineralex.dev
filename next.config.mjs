import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
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
        source: '/blog',
        destination: '/en/blog',
				locale: false
      }
    ]
  }
};

export default withContentlayer(nextConfig);
