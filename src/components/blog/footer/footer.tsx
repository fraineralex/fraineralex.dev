import SocialMedia from './social-media'

export default function Footer () {
  return (
    <footer className='py-6 lg:py-12 text-center'>
      {/* <p className='text-sm text-zinc-100' data-test='footer-text'>
        &copy;{new Date().getFullYear().toString()} Frainer Encarnación
      </p> */}
      <SocialMedia />
    </footer>
  )
}
