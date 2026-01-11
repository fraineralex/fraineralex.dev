import 'server-only'
import { unstable_cache } from 'next/cache'
import { getRedis } from './redis'

// Cached view count for a single post (5 minute cache)
export const getViewCount = unstable_cache(
  async (slug: string): Promise<number> => {
    const redis = getRedis()
    if (!redis) return 0
    const views = await redis.get<number>(['pageviews', 'posts', slug].join(':'))
    return views ?? 0
  },
  ['post-views'],
  { revalidate: 300, tags: ['views'] } // 5 minute cache
)

// Cached bulk view counts for blog listing (5 minute cache)  
export const getAllViewCounts = unstable_cache(
  async (slugs: string[]): Promise<Record<string, number>> => {
    const redis = getRedis()
    if (!redis || slugs.length === 0) return {}
    
    const keys = slugs.map(slug => ['pageviews', 'posts', slug].join(':'))
    const views = await redis.mget<number[]>(...keys)
    
    return slugs.reduce((acc, slug, i) => {
      acc[slug] = views[i] ?? 0
      return acc
    }, {} as Record<string, number>)
  },
  ['all-views'],
  { revalidate: 300, tags: ['views'] } // 5 minute cache
)
