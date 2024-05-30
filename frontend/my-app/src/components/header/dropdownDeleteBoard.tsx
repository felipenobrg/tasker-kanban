import { EllipsisVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'

interface DropdownDeleteBoardProps {
  handleEllipsisClick: () => void
  handleDeleteConfirmation: () => void
}

export default function DropdownDeleteBoard(props: DropdownDeleteBoardProps) {
  const { handleEllipsisClick, handleDeleteConfirmation } = props
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="justify-end">
        <Button variant="ghost" onClick={handleEllipsisClick}>
          <EllipsisVertical size={18} className="cursor-pointer" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleDeleteConfirmation}>
          <p className="text-red-400">Deletar quadro</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
