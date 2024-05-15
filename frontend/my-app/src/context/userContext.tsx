'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'

interface UserContextType {
  email: string
  setEmail: Dispatch<SetStateAction<string>>
  code: string
  setCode: Dispatch<SetStateAction<string>>
}

export const UserContext = createContext<UserContextType>({} as UserContextType)
UserContext.displayName = 'UserContext'

// export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState<string>('')
  const [code, setCode] = useState<string>('')

  return (
    <UserContext.Provider value={{ email, setEmail, code, setCode }}>
      {children}
    </UserContext.Provider>
  )
}