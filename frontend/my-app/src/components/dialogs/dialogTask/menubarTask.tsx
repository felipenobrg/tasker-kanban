import { EllipsisVertical } from 'lucide-react'
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'

interface MenubarTaskProps {
  handleDeleteTask: (id: number, description: string, status: string) => void
}

export default function MenubarTask(props: MenubarTaskProps) {
  const { handleDeleteTask } = props
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="justify-end">
        <div className="justify-end">
          <EllipsisVertical size={20} className="cursor-pointer" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <button>
            <p className="text-red-600">Deletar tarefa</p>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
