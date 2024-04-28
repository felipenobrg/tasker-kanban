'use client'

import { Task } from '@/types/task'
import { Card } from '../ui/card'
import { Reorder } from 'framer-motion'
import { useEffect, useState } from 'react'

interface BoardCardProps {
  data: Task[]
  status: string[]
}

export default function BoardCard(props: BoardCardProps) {
  const { data, status } = props
  const [task, setTask] = useState<Task[]>([])

  useEffect(() => {
    setTask(data)
  }, [data])

  return (
    <div className="flex flex-row ml-5">
      <div className="flex flex-col gap-4">
        {status.map((statusOption) => (
          <h1 key={statusOption} className="font-semibold mb-1">
            {statusOption}
          </h1>
        ))}
        <Reorder.Group
          className="flex flex-col gap-5"
          values={task}
          onReorder={setTask}
          axis="x"
        >
          {data.map((item) => (
            <Reorder.Item value={item} key={item.description}>
              <Card>
                <p className="text-gray-200 text-sm">{item.description}</p>
              </Card>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  )
}
