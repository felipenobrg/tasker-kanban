'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
interface SubTaskCardProps {
  name: string
}

export default function SubtaskCard(props: SubTaskCardProps) {
  const { name } = props
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = (newCheckedState: boolean) => {
    setIsChecked(newCheckedState)
  }

  return (
    <div className="bg-gray-800 w-[20rem] p-2 rounded-lg">
      <div className="flex items-center">
        <Checkbox
          id="terms"
          checked={isChecked}
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
