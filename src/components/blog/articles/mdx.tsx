// @ts-nocheck
import * as React from "react";
import Image from "next/image";
import { useMDXComponent } from "next-contentlayer/hooks";

function clsx(...args: any) {
	return args.filter(Boolean).join(" ");
}

const components = {
	Image,
};

interface MdxProps {
	code: string;
}

export function Mdx({ code }: MdxProps) {
	const Component = useMDXComponent(code);

	return (
		<div className="mdx">
			<Component components={components} />
		</div>
	);
}
