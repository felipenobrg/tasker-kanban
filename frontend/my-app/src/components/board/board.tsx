'use client'

import * as React from 'react'
import BoardCard from './boardCard'
import { Circle } from 'lucide-react'
import { useEffect } from 'react'
import { useBoard } from '@/context/boardContext'
import GetBoardById from '@/lib/boards/getBoardById'
import { useTask } from '@/context/taskContext'
import { useQuery } from '@tanstack/react-query'
import Spinner from '@/assets/spinner'
import { useTheme } from 'next-themes'

const statusOptions = [
  { status: 'Pendente', circleColor: 'gray' },
  { status: 'Em andamento', circleColor: 'purple' },
  { status: 'Feito', circleColor: 'green' },
]

export default function Board() {
  const { boardId } = useBoard()
  const { setTaskData, taskData } = useTask()
  const { theme } = useTheme()

  const { data: boardData, isLoading } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => GetBoardById({ id: boardId }),
    retry: false,
  })

  useEffect(() => {
    if (boardData) {
      setTaskData(boardData.data.tasks || [])
    }
  }, [boardData, setTaskData])

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    )

  const taskCounts = statusOptions.reduce(
    (acc, option) => {
      acc[option.status] = taskData.filter(
        (task) => task.status === option.status,
      ).length
      return acc
    },
    {} as { [key: string]: number },
  )

  return (
    <main className="flex flex-1 gap-4 p-4 lg:gap-6 lg:p-6 relative">
      <div className="flex flex-col items-center gap-4">
        <div className="flex">
          {statusOptions.map(({ status, circleColor }) => (
            <div
              key={status}
              className={`flex flex-col ml-20 items-center ${theme === 'dark' ? 'bg-muted/40' : 'bg-gray-200'} rounded w-[20rem]`}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="flex items-center justify-center gap-2 mt-4">
                <Circle size={18} color={circleColor} fill={circleColor} />
                <p className="mb-2 text-md text-gray-400">
                  {status} ( {taskCounts[status]} )
                </p>
              </div>
              <div className="flex items-center flex-col gap-5 mt-3">
                {taskData
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <BoardCard
                      key={task.ID}
                      taskId={task.ID}
                      data={task}
                      statusOption={statusOptions}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
