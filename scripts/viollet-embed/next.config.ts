import type { NextConfig } from 'next'
import path from 'node:path'
import fs from 'node:fs'

const shims = path.resolve(__dirname, 'src/components/landing/prototype/shims')

function mapRequest(req: string): string | null {
	if (/^(?:~|@)\/server\/actions\/statements$/.test(req)) return path.resolve(__dirname, 'embed-shims/statements.ts')
	const m = req.match(/^(?:~|@)\/server\/actions\/([\w-]+)$/)
	if (m) {
		const f = path.join(shims, `${m[1]}-actions.ts`)
		return fs.existsSync(f) ? f : path.join(shims, 'empty.ts')
	}
	if (/^(?:~|@)\/server\/db\/schema/.test(req)) return path.join(shims, 'db-schema.ts')
	if (/^(?:~|@)\/server\//.test(req)) return path.join(shims, 'empty.ts')
	if (/^(?:~|@)\/env(\.js)?$/.test(req)) return path.join(shims, 'env.ts')
	if (req === '@clerk/nextjs') return path.resolve(__dirname, 'embed-shims/clerk.tsx')
	return null
}

const nextConfig: NextConfig = {
	output: 'export',
	basePath: '/embeds/viollet-app',
	trailingSlash: true,
	images: { unoptimized: true },
	typescript: { ignoreBuildErrors: true },
	productionBrowserSourceMaps: false,
	webpack: (config, { webpack }) => {
		config.plugins.push(
			new webpack.NormalModuleReplacementPlugin(/.*/, (resource: { request: string }) => {
				const to = mapRequest(resource.request)
				if (to) resource.request = to
			})
		)
		return config
	}
}

export default nextConfig
