import { X } from 'lucide-react'
import { lazy } from 'react'
const Modal = lazy(() => import('./modal'))

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function SubscribeModal ({ open, setOpen }: Props) {
  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      <article className='fixed left-0 right-0 top-48 z-50 max-w-xl flex-col items-center overflow-hidden rounded-2xl p-6 shadow-slate-400 shadow-md border-2 border-slate-400 bg-[#1F222A] flex m-auto align-middle'>
        <button
          className='text-white absolute right-3 top-3 hover:scale-110 hover:text-teal-300'
          onClick={() => setOpen(false)}
        >
          <X className='w-6 h-6' />
        </button>
        <iframe
          rel='preconnect'
          title='Subscribe to my newsletter'
          src='https://fraineralex.substack.com/embed'
          height='320'
          className='flex mx-auto align-middle border-0'
        />
      </article>
    </Modal>
  )
}
