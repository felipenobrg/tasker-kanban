'use client'

import { Task } from '@/types/task'
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'

interface TaskContextType {
  taskData: Task[]
  taskId: number | null
  setTaskId: Dispatch<SetStateAction<number | null>>
  setTaskData: Dispatch<SetStateAction<Task[]>>
}

const TaskContext = createContext<TaskContextType>({} as TaskContextType)

export const useTask = () => useContext(TaskContext)

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [taskData, setTaskData] = useState<Task[]>([])
  const [taskId, setTaskId] = useState<number | null>(null)

  return (
    <TaskContext.Provider value={{ taskId, taskData, setTaskId, setTaskData }}>
      {children}
    </TaskContext.Provider>
  )
}
