export const runtime = 'edge'

import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const getRedis = () => {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
  })
}

export async function POST (req: NextRequest): Promise<NextResponse> {
  const redis = getRedis()
  if (!redis) {
    return new NextResponse('Redis not configured', { status: 503 })
  }

  if (req.headers.get('Content-Type') !== 'application/json') {
    return new NextResponse('must be json', { status: 400 })
  }

  const body = await req.json()
  let slug: string | undefined = undefined
  if ('slug' in body) {
    slug = body.slug
  }
  if (!slug) {
    return new NextResponse('Slug not found', { status: 400 })
  }
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? req.headers.get('x-real-ip')
  if (ip) {
    // Hash the IP in order to not store it directly in your db.
    const buf = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(ip)
    )
    const hash = Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // deduplicate the ip for each slug
    const isNew = await redis.set(['deduplicate', hash, slug].join(':'), true, {
      nx: true,
      ex: 24 * 60 * 60
    })
    if (!isNew) {
      return new NextResponse(null, { status: 202 })
    }
  }
  await redis.incr(['pageviews', 'posts', slug].join(':'))
  return new NextResponse(null, { status: 202 })
}
