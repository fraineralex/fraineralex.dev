import React, { ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export default function Modal ({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) {
    return null
  }

  return createPortal(
    <>
      <div
        className='fixed inset-0 z-50 backdrop-blur-sm bg-gray-500/20'
        onClick={onClose}
      />
      {children}
    </>,
    document.body
  )
}
