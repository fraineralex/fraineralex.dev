import { allTags } from '@/utils/data'

interface Props {
  hero: string
  heroSource?: string
  title?: string
  tags: string[]
  date: string
  readTime: string
  minRead?: string
}

export function RSSHeader ({
  hero,
  heroSource,
  title,
  tags,
  date,
  readTime,
  minRead
}: Props) {
  const site_url =
    process.env.NODE_ENV === 'production'
      ? 'https://frainer-blog.vercel.app'
      : 'http://localhost:3000'

  return `
    <header>
      <figure>
        <img
          alt="${title}"
          loading="lazy"
          decoding="async"
          data-nimg="1"
          src="${site_url}${hero}"
          style="margin-top: 2rem; color: transparent; min-width: 80%; border-radius: .75rem; margin-left: auto; margin-right: auto; width: 100%; height: auto;"
        />
        <figcaption style=" text-align: right; font-size: 0.875rem; line-height: 1.25rem; padding-inline-end: 2rem; color: darkgray; padding-inline-end: 2rem; padding-top: 0.25rem;  font-style: italic;">
          ${heroSource}
        </figcaption>
      </figure>
      <p style=" margin-left: auto; margin-right: auto; text-transform: uppercase; text-align: center; padding-bottom: 2rem;"
        ><span style="margin-bottom: 0;">
          <time datetime="${date}"
            >${Intl.DateTimeFormat(undefined, {
              dateStyle: 'medium'
            }).format(new Date(date))}</time
          >
          <span style="padding-left: 1rem; padding-right: 1rem;">•</span
          ><span style="margin-inline-end: 0;">${readTime} ${
    minRead || 'min read'
  }</span>
          <span style="padding-left: 1rem; padding-right: 1rem;">|</span>
          ${tags
            .map((tagName, index) => {
              const tag = allTags.find(tag => tag.name === tagName)
              return `
                  <a href="${site_url}/tags/${
                tag?.name || tagName
              }" style="color: black; text-decoration-line: underline; text-underline-offset: 4px;">
                    ${tag?.label || tagName}
                  </a>
                  ${
                    index !== (tags?.length ?? 0) - 1
                      ? `<span style="padding-left: 10px; padding-right: 10px;"> • </span>`
                      : ''
                  }
              `
            })
            .join('')}
          </span>
      </p>  
    </header>
  `
}
