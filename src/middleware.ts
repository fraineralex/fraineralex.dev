import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from './i18n-config'

import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

export function getLocale (request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  )

  const locale = matchLocale(languages, locales, i18n.defaultLocale)

  return locale
}

export function middleware (request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Remove the default locale from the pathname if present
  if (
    pathname.startsWith(`/${i18n.defaultLocale}/`) &&
    getLocale(request) === i18n.defaultLocale
  ) {
    const newUrl = new URL(
      pathname.replace(`/${i18n.defaultLocale}`, ''),
      request.url
    )
    return NextResponse.redirect(newUrl)
  }

  if (
    pathname.startsWith(`/${i18n.defaultLocale}`) &&
    getLocale(request) === i18n.defaultLocale
  ) {
    const newUrl = new URL(
      pathname.replace(`${i18n.defaultLocale}`, ''),
      request.url
    )
    return NextResponse.redirect(newUrl)
  }

  // // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
  // // If you have one
  if (
    [
      '/manifest.json',
      '/manifest.webmanifest',
      '/favicon.ico',
      '/images/hero/profile.jpg',
      '/blog/rss.xml',
      '/resume.pdf',
      '/curriculum.pdf',
      '/plane.html',
      '/es-og.webp',
      '/og.webp',
      // Projects
      '/images/projects/blog.webp',
      '/images/projects/chess.webp',
      '/images/projects/es-og-projects.webp',
      '/images/projects/hacker_news.webp',
      '/images/projects/og-projects.webp',
      '/images/projects/quizzes.webp',
      '/images/projects/realestate.webp',
      // Hero
      '/images/hero/itla.webp',
      '/images/hero/profile.webp',
      // Experience
      '/images/experience/ipp.webp',
      '/images/experience/lifter.webp',
      '/images/experience/nelmix.webp',
      // blog
      '/images/blog/es-og.webp',
      '/images/blog/og.webp',
      '/images/blog/es-tags-og.webp',
      '/images/blog/profile.webp',
      '/images/blog/tags-og.webp',
      // Tags
      '/images/blog/tags/css.webp',
      '/images/blog/tags/git.ico',
      '/images/blog/tags/go.webp',
      '/images/blog/tags/javascript.webp',
      '/images/blog/tags/next.ico',
      '/images/blog/tags/node.webp',
      '/images/blog/tags/odoo.ico',
      '/images/blog/tags/performance.webp',
      '/images/blog/tags/personal.webp',
      '/images/blog/tags/productivity.webp',
      '/images/blog/tags/python.webp',
      '/images/blog/tags/terminal.webp',
      '/images/blog/tags/typescript.webp',
      '/images/blog/tags/work.webp',
      // Posts / Content
      '/images/blog/posts/content/additional-hooks.webp',
      '/images/blog/posts/content/basic-hooks.webp',
      '/images/blog/posts/content/git-commit.webp',
      // Posts / Cover
      '/images/blog/posts/cover/crafting-react-hooks.webp',
      '/images/blog/posts/cover/how-to-install-nvm.webp',
      '/images/blog/posts/cover/master-git-commit-message.webp',
      // Posts / Cover / RSS
      '/images/blog/posts/cover/rss/crafting-react-hooks.png',
      '/images/blog/posts/cover/rss/how-to-install-nvm.png',
      '/images/blog/posts/cover/rss/master-git-commit-message.png',
      // Fonts
      '/fonts/CircularXXWeb-Bold.woff2',
      '/fonts/CircularXXWeb-Book.woff2'
    ].includes(pathname)
  )
    return

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    if (locale === i18n.defaultLocale) return

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    )
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
