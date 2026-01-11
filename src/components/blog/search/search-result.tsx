import dynamic from 'next/dynamic'
const BlogCard = dynamic(() => import('./blog-card'))
import { Search } from 'lucide-react'
import { usePosts } from '@/context/posts-context'
import { Locale } from '@/i18n-config'

export const SearchResult = ({
  searchTerm,
  lang
}: {
  searchTerm: string
  lang: Locale
}) => {
  const posts = usePosts()
  const filteredPosts = posts.filter(post => {
    const title = post.title.toLowerCase()
    const description = post.description.toLowerCase()
    const tags = post.tags?.map(tag => tag.toLowerCase())
    const search = searchTerm.toLowerCase()

    return (
      post.lang === lang &&
      post.published &&
      (title.includes(search) ||
        description.includes(search) ||
        tags?.some(tag => tag.includes(search)))
    )
  })

  return (
    <>
      {filteredPosts.length > 0 ? (
        <div
          dir='ltr'
          className='w-full overflow-y-auto overflow-x-hidden'
          style={{ position: 'relative' }}
        >
          <div className='w-full h-full'>
            <div style={{ minWidth: '100%', display: 'table' }}>
              <div className='mt-2 rounded pb-10 md:mt-5 md:max-w-5xl md:mr-5'>
                {filteredPosts.map((blog, index) => (
                  <BlogCard key={index} blog={blog} />
                ))}
                <div className='self-center text-center font-heading font-semibold text-slate-200 mt-10'>
                  <p className='text-md'>You've reached the end! 👋</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='relative w-full'>
          <div className='my-4 flex flex-row items-center justify-center text-slate-300'>
            <Search className='h-5 w-5 me-2' />
            <h2 id='radix-:rh:' className='font-normal'>
              No articles found
            </h2>
          </div>
        </div>
      )}
    </>
  )
}

export default SearchResult
