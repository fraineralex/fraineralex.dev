import 'server-only'
import { allPosts } from '@/lib/posts'
import { allTags, Tag } from './tags'

export { allTags }
export type { Tag }

export const displayTags: Tag[] = [
  ...new Set(
    allPosts
      .flatMap(post => {
        return (
          post.tags.map(
            tag => allTags.find(t => t.name === tag) || ({} as Tag)
          ) || []
        )
      })
      .sort((a, b) => a.label.length - b.label.length)
  )
]
