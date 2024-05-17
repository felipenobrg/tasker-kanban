'use client'

import * as React from 'react'
import BoardCard from './boardCard'
import { Circle } from 'lucide-react'
import { useEffect } from 'react'
import UpdateTask from '@/lib/task/updateTask'
import { useBoard } from '@/context/boardContext'
import GetBoardById from '@/lib/boards/getBoardById'
import { useTask } from '@/context/taskContext'

const statusOptions = [
  { status: 'Pendente', circleColor: 'gray' },
  { status: 'Em andamento', circleColor: 'purple' },
  { status: 'Feito', circleColor: 'green' },
]

export default function Board() {
  const { boardId } = useBoard()
  const { setTaskData, taskData } = useTask()

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    newStatus: string,
  ) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('taskId')
    const updatedTasks = taskData.map((task) =>
      task.ID.toString() === taskId ? { ...task, status: newStatus } : task,
    )
    try {
      await Promise.all(updatedTasks.map((task) => UpdateTask(task)))
      setTaskData(updatedTasks)
    } catch (error) {
      console.error('Error updating tasks:', error)
    }
  }

  useEffect(() => {
    if (boardId) {
      const fetchBoardData = async () => {
        try {
          const boardResponse = await GetBoardById({ id: boardId })
          const boardData = boardResponse.data
          setTaskData(boardData.tasks || [])
        } catch (error) {
          console.error('Error fetching tasks:', error)
        }
      }
      fetchBoardData()
    }
  }, [boardId, setTaskData])

  const taskCounts = statusOptions.reduce(
    (acc, option) => {
      acc[option.status] = taskData.filter(
        (task) => task.status === option.status,
      ).length
      return acc
    },
    {} as { [key: string]: number },
  )

  console.log('taskData', taskData)

  return (
    <main className="flex flex-1 gap-4 p-4 lg:gap-6 lg:p-6 relative">
      <div className="flex flex-col items-center gap-4">
        <div className="flex">
          {statusOptions.map(({ status, circleColor }) => (
            <div
              key={status}
              className="flex flex-col ml-20 items-center bg-muted/40 p-8 rounded w-[20rem]"
              onDrop={(e) => handleDrop(e, status)}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="flex items-center justify-center gap-2">
                <Circle size={18} color={circleColor} fill={circleColor} />
                <p className="mb-2 mt-2 ml-2 text-sm text-gray-400">
                  {status} ({taskCounts[status]})
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
