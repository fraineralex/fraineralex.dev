'use client'

import { createContext, useContext, ReactNode } from 'react'
import type { PostMeta } from '@/types/post'

const PostsContext = createContext<PostMeta[]>([])

export function PostsProvider({ children, posts }: { children: ReactNode; posts: PostMeta[] }) {
  return <PostsContext.Provider value={posts}>{children}</PostsContext.Provider>
}

export function usePosts() {
  return useContext(PostsContext)
}
