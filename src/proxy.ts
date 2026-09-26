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

export function proxy (request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Feed routes still need locale redirects; all other files bypass the proxy.
  const isBlogFeed = /^\/(?:en\/|es\/)?blog\/(?:rss|feed)\.xml$/.test(pathname)
  if (
    /^\/(?:images|fonts|content)(?:\/|$)/.test(pathname) ||
    (pathname.includes('.') && !isBlogFeed)
  ) return

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
  // Ignore framework endpoints and public asset directories.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images/|fonts/|content/).*)']
}
