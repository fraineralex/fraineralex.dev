import React, { ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) {
    return null
  }

  return createPortal(
    <>
      <div
        className='fixed inset-0 z-50 backdrop-blur-sm bg-zinc-900/500'
        onClick={onClose}
      />
      <div className='fixed left-0 right-0 top-0 z-50 mx-2 mt-32 max-w-[1200px] flex-col items-center overflow-hidden rounded-2xl p-6 shadow-md border border-slate-700 bg-slate-800 md:mx-8 lg:mx-auto lg:w-3/4 xl:w-2/3 md:max-h-50 max-h-132 flex'>
        {children}
      </div>
    </>,
    document.body
  )
}
