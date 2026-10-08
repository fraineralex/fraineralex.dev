import type React from 'react'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '~/components/theme-provider'
import './globals.css'
import './embed.css'

export const metadata = { title: 'Viollet app preview', robots: { index: false, follow: false } }

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='es' className='dark' suppressHydrationWarning>
			<body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`} suppressHydrationWarning>
				<ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false}>
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
