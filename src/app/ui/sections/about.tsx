import Image from 'next/image'
import ItemLink from '../components/item-link'
import {
  GitHubIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon
} from '../components/SvgIcons'

export default function About () {
  return (
    <section
      id='about'
      className='mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24'
      aria-label='About me'
    >
      <header className='sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0'>
        <h2 className='text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only'>
          About
        </h2>
      </header>
      <article>
        <figure className='flex justify-center'>
          <Image
            width={200}
            height={200}
            className='w-auto rounded-full'
            src='/images/hero/profile.png'
            alt='Frainer Encarnacion profile picture'
          />
        </figure>
        <ul className='ml-1 mt-4 mb-4 flex items-center justify-center' aria-label='Social media'>
          <ItemLink title='Github' href='https://github.com/fraineralex'>
            <GitHubIcon />
          </ItemLink>

          <ItemLink
            title='Linkedin'
            href='https://www.linkedin.com/in/fraineralex'
          >
            <LinkedinIcon />
          </ItemLink>

          <ItemLink title='Instagram' href='https://instagram.com/frainer.alex'>
            <InstagramIcon />
          </ItemLink>

          <ItemLink title='Twitter' href='https://twitter.com/fraineralex'>
            <TwitterIcon />
          </ItemLink>
          <ItemLink title='Github' href='https://github.com/fraineralex'>
            <GitHubIcon />
          </ItemLink>

          <ItemLink
            title='Linkedin'
            href='https://www.linkedin.com/in/fraineralex'
          >
            <LinkedinIcon />
          </ItemLink>

          <ItemLink title='Instagram' href='https://instagram.com/frainer.alex'>
            <InstagramIcon />
          </ItemLink>

          <ItemLink title='Twitter' href='https://twitter.com/fraineralex'>
            <TwitterIcon />
          </ItemLink>
          <ItemLink title='Github' href='https://github.com/fraineralex'>
            <GitHubIcon />
          </ItemLink>

          <ItemLink
            title='Linkedin'
            href='https://www.linkedin.com/in/fraineralex'
          >
            <LinkedinIcon />
          </ItemLink>

          <ItemLink title='Instagram' href='https://instagram.com/frainer.alex'>
            <InstagramIcon />
          </ItemLink>

          <ItemLink title='Twitter' href='https://twitter.com/fraineralex'>
            <TwitterIcon />
          </ItemLink>
          
        </ul>
        <p className='mb-4'>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod
          consequatur, distinctio, doloribus vitae expedita in consequuntur ipsa
          laudantium labore asperiores quia impedit, sit animi dolores eligendi
          id voluptates?
        </p>
        <p className='mb-4'>
          Doloribus corporis totam nostrum illo quisquam, nisi earum iste! Sunt
          corrupti in, nostrum sint voluptates autem doloremque! Cum aliquid at
          tempore odit quidem minima dignissimos molestiae quibusdam non,
          facilis quo quaerat voluptate esse iure temporibus nostrum a ad vel.
        </p>
        <p className='mb-4'>
          Dolore rem recusandae necessitatibus ab consequatur dolorum, libero
          commodi. Excepturi eveniet, accusamus harum officia quod natus in quos
          voluptates qui adipisci hic sed quisquam voluptate vero inventore ea
          magnam porro ut voluptas aliquam?
        </p>
      </article>
    </section>
  )
}
