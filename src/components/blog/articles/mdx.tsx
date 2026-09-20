// @ts-nocheck
import * as React from "react";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import BlogAutoplayVideo from "@/components/blog/blog-autoplay-video";
import JevPlaygroundEmbed from "@/components/blog/jev-playground-embed";

const components = {
	Image,
	JevPlayground: JevPlaygroundEmbed,
	BlogAutoplayVideo,
};

interface MdxProps {
	source: string;
}

export async function Mdx({ source }: MdxProps) {
	return (
		<div className="mdx">
			<MDXRemote
				source={source}
				components={components}
				options={{
					mdxOptions: {
						remarkPlugins: [remarkGfm],
						rehypePlugins: [
							rehypeSlug,
							[
								rehypePrettyCode,
								{
									theme: "github-dark",
								},
							],
							[
								rehypeAutolinkHeadings,
								{
									properties: {
										className: ["subheading-anchor"],
										ariaLabel: "Link to section",
									},
								},
							],
						],
					},
				}}
			/>
		</div>
	);
}
