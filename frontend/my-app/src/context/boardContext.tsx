'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'

interface BoardContextType {
  boardId: number | null
  setBoardId: Dispatch<SetStateAction<number | null>>
  boardName: string | null
  setBoardName: Dispatch<SetStateAction<string | null>>
}

const BoardContext = createContext<BoardContextType>({} as BoardContextType)

export const useBoard = () => useContext(BoardContext)

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [boardName, setBoardName] = useState<string | null>('')
  const [boardId, setBoardId] = useState<number | null>(null)

  return (
    <BoardContext.Provider
      value={{ boardId, boardName, setBoardId, setBoardName }}
    >
      {children}
    </BoardContext.Provider>
  )
}
