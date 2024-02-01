import { BlogCard } from './blog-card'
import { Search } from 'lucide-react'
import { allPosts } from 'contentlayer/generated'

export const SearchResult = ({ searchTerm }: { searchTerm: string }) => {
  const filteredPosts = allPosts.filter(post => {
    const title = post.title.toLowerCase()
    const description = post.description.toLowerCase()
    const tags = post.tags?.map(tag => tag.toLowerCase())
    const body = post.body.code?.toLowerCase()
    const search = searchTerm.toLowerCase()

    return (
      title.includes(search) ||
      description.includes(search) ||
      tags?.includes(search) ||
      body?.includes(search)
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
