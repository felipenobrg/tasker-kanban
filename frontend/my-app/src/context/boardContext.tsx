'use client'

import { BoardData } from '@/types/board'
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
  boardName: string | null
  boardData: BoardData[]
  setBoardId: Dispatch<SetStateAction<number | null>>
  setBoardName: Dispatch<SetStateAction<string | null>>
  setBoardData: Dispatch<SetStateAction<BoardData[]>>
}

const BoardContext = createContext<BoardContextType>({} as BoardContextType)

export const useBoard = () => useContext(BoardContext)

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [boardData, setBoardData] = useState<BoardData[]>([])
  const [boardName, setBoardName] = useState<string | null>('')
  const [boardId, setBoardId] = useState<number | null>(null)

  return (
    <BoardContext.Provider
      value={{
        boardData,
        boardId,
        boardName,
        setBoardId,
        setBoardName,
        setBoardData,
      }}
    >
      {children}
    </BoardContext.Provider>
  )
}
