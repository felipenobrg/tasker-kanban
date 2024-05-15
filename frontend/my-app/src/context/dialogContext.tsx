'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react'

interface DialogContextType {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const DialogContext = createContext<DialogContextType>({} as DialogContextType)

export const useDialog = () => useContext(DialogContext)

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <DialogContext.Provider value={{ isOpen, onOpen, onClose }}>
      {children}
    </DialogContext.Provider>
  )
}
