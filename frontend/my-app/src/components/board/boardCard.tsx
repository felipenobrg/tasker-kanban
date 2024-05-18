'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
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

const truncateText = (description: string, maxLength: number): string => {
  if (description.length <= maxLength) {
    return description
  } else {
    const lastSpaceIndex = description.lastIndexOf(' ', maxLength)
    return description.substring(0, lastSpaceIndex) + '...'
  }
}

export default function BoardCard(props: BoardCardProps) {
  const queryClient = useQueryClient()
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

  const { mutate, isSuccess } = useMutation({
    mutationFn: UpdateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    },
  })

  const handleUpdateTask = (
    title: string,
    id: number,
    description: string,
    status: string,
  ) => {
    mutate({ id, title, description, status })
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
  }

  useEffect(() => {
    setTaskId(taskId)
  }, [taskId, setTaskId])

  useEffect(() => {
    setDialogOpen(false)
  }, [isSuccess])

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.dataTransfer.setData('taskId', id.toString())
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <>
      <div className="flex items-center justify-center flex-row">
        <div className="flex flex-col gap-4">
          <Card
            onClick={handleDialogOpen}
            className="flex flex-col bg-gray-800 w-[18rem] h-28 p-3 cursor-pointer rounded group"
            draggable
            key={data.ID}
          >
            <div className="flex flex-col items-start justify-start flex-1">
              <h2 className="text-gray-200 text-base font-bold group-hover:text-indigo-500">
                {truncateText(data.title, 30)}
              </h2>
              <p className="text-gray-300 text-sm break-words mt-2 font-medium">
                {truncateText(data.description, 35)}
              </p>
            </div>
          </Card>
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
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          handleDeleteTask={() => handleDeleteTask(data.ID)}
        />
      )}
    </>
  )
}
