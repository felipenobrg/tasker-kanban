'use client'

import { useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import updateSubtasks from '@/lib/subtasks/updateSubtask'
import GetSubtaskById from '@/lib/subtasks/getSubtaskById'

interface SubTaskCardProps {
  name: string
  subtaskId: number | undefined
  status: string
}

export default function SubtaskCard(props: SubTaskCardProps) {
  const { name, subtaskId, status } = props
  const [isChecked, setIsChecked] = useState(status === 'Enabled')

  useEffect(() => {
    setIsChecked(status === 'Enabled')
  }, [status])

  const handleCheckboxChange = (newCheckedState: boolean) => {
    setIsChecked(newCheckedState)
    const newStatus = newCheckedState ? 'Enabled' : 'Disabled'
    handleUpdateSubstaskStatus(subtaskId, newStatus)
  }

  const handleUpdateSubstaskStatus = async (
    id: number | undefined,
    newStatus: string,
  ) => {
    if (id !== undefined) {
      try {
        await updateSubtasks({ name, id, status: newStatus })
      } catch (error) {
        console.error('Error updating subtask:', error)
      }
    } else {
      console.error('Subtask ID is undefined')
    }
  }

  return (
    <div className="bg-gray-800 w-[20rem] p-2 rounded-lg">
      <div className="flex items-center">
        <Checkbox
          id="terms"
          checked={isChecked}
          disabled={status === 'Disabled'}
          onCheckedChange={handleCheckboxChange}
        />
        <label
          htmlFor="terms"
          className={`ml-2 text-sm ${isChecked ? 'line-through text-gray-400' : ''}`}
        >
          {name}
        </label>
      </div>
    </div>
  )
}
