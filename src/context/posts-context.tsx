'use client'

import { createContext, useContext, ReactNode } from 'react'
import type { Post } from '@/types/post'

const PostsContext = createContext<Post[]>([])

export function PostsProvider({ children, posts }: { children: ReactNode; posts: Post[] }) {
  return <PostsContext.Provider value={posts}>{children}</PostsContext.Provider>
}

export function usePosts() {
  return useContext(PostsContext)
}
