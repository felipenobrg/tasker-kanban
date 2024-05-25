import { Flag, ListFilter } from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '../ui/dropdown-menu'
import { priorityOptions } from './board'
import getPriorityColor from '@/helpers/getPriorityColors'
import { useFilter } from '@/context/filterContext'

export default function DropdownFilter() {
  const { setSelect } = useFilter()

  const handleSelect = (value: string) => {
    setSelect(value)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="hidden md:flex">
        <Button variant="outline">
          <ListFilter />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2 space-y-2">
        <Button
          variant="ghost"
          className="flex items-center justify-between w-full"
          onClick={() => handleSelect('All')}
        >
          <span>Todos</span>
        </Button>
        {priorityOptions.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className="flex items-center justify-between w-full"
            onClick={() => handleSelect(item.name)}
          >
            <span>{item.name}</span>
            <Flag
              size={18}
              color={getPriorityColor(item.name)}
              fill={getPriorityColor(item.name)}
            />
          </Button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
