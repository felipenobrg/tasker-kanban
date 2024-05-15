'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'

interface TaskContextType {
  taskId: number | null
  setTaskId: Dispatch<SetStateAction<number | null>>
}

const TaskContext = createContext<TaskContextType>({} as TaskContextType)

export const useTask = () => useContext(TaskContext)

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [taskId, setTaskId] = useState<number | null>(null)

  return (
    <TaskContext.Provider value={{ taskId, setTaskId }}>
      {children}
    </TaskContext.Provider>
  )
}
