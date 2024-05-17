'use client'

import { Task } from '@/types/task'
import { Card } from '../ui/card'
import { useState, useEffect } from 'react'
import DeleteTask from '@/lib/task/deleteTask'
import UpdateTask from '@/lib/task/updateTask'
import DialogEditTask from '../dialogs/dialogEditTask/dialogEditTask'
import { useTask } from '@/context/taskContext'

interface BoardCardProps {
  data: Task
  taskId: number
  statusOption: { status: string; circleColor: string }[]
}

const truncateDescription = (
  description: string,
  maxLength: number,
): string => {
  if (description.length <= maxLength) {
    return description
  } else {
    const lastSpaceIndex = description.lastIndexOf(' ', maxLength)
    return description.substring(0, lastSpaceIndex) + '...'
  }
}

export default function BoardCard(props: BoardCardProps) {
  const { data, statusOption, taskId } = props
  const [dialogOpen, setDialogOpen] = useState(false)
  const { setTaskId, taskData, setTaskData } = useTask()

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleDeleteTask = async (id: number, event?: React.MouseEvent) => {
    event?.stopPropagation()
    await DeleteTask({ id })
    const updatedTasks = taskData.filter((item) => item.ID !== id)
    setTaskData(updatedTasks)
    setDialogOpen(false)
  }

  const handleUpdateTask = async (
    title: string,
    id: number,
    description: string,
    status: string,
  ) => {
    try {
      await UpdateTask({ id, title, description, status })
      const updatedTask = {
        ...taskData.find((item) => item.ID === id),
        title,
        description,
        status,
      }
      const updatedTasks = taskData.map((item) =>
        item.ID === id ? updatedTask : item,
      )
      setTaskData(updatedTasks as Task[])
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  useEffect(() => {
    setTaskId(taskId)
  }, [taskId, setTaskId])

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.dataTransfer.setData('taskId', id.toString())
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <>
      <div className="flex items-center justify-center flex-row">
        <div
          onDragStart={(e) => handleDragStart(e, data.ID)}
          onDragOver={handleDragOver}
          className="flex flex-col gap-4"
          draggable
        >
          {taskData
            .filter((item) => item.status === data.status)
            .map((item) => (
              <Card
                key={item.ID}
                onClick={handleDialogOpen}
                className="flex flex-col bg-gray-800 w-[18rem] h-28 p-3 cursor-pointer rounded"
                draggable
              >
                <div className="flex flex-col items-start justify-start flex-1">
                  <h2 className="text-gray-200 text-base font-bold">
                    {item.title}
                  </h2>
                  <p className="text-gray-300 text-sm break-words mt-2 font-medium">
                    {truncateDescription(item.description, 35)}
                  </p>
                </div>
              </Card>
            ))}
        </div>
      </div>
      {dialogOpen && (
        <DialogEditTask
          statusOption={statusOption}
          initialDescription={data.description}
          initialStatus={data.status}
          title={data.title}
          id={data.ID}
          taskId={taskId}
          setDialogOpen={setDialogOpen}
          onUpdateTask={handleUpdateTask}
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          handleDeleteTask={() => handleDeleteTask(data.ID)}
        />
      )}
    </>
  )
}
