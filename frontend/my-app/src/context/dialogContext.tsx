import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'

interface DialogContextType {
  dialogOpen: boolean
  setDialogOpen: Dispatch<SetStateAction<boolean>>
}

const DialogContext = createContext<DialogContextType>({
  dialogOpen: false,
  setDialogOpen: () => {},
})

export const useDialog = () => useContext(DialogContext)

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <DialogContext.Provider value={{ dialogOpen, setDialogOpen }}>
      {children}
    </DialogContext.Provider>
  )
}
