import type { ReactNode } from 'react'
export * from '../src/components/landing/prototype/shims/clerk'
export function UNSAFE_PortalProvider({ children }: { children: ReactNode; getContainer?: unknown }) {
	return <>{children}</>
}
