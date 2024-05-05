import { useState } from 'react'
import { EllipsisVertical } from 'lucide-react'
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface MenubarTaskProps {
  handleDeleteTask?: (id: number) => void
  id: number
}

export default function MenubarTask(props: MenubarTaskProps) {
  const { handleDeleteTask, id } = props

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDeleteConfirmation = () => {
    setIsDialogOpen(true)
  }

  const handleCancelDelete = () => {
    setIsDialogOpen(false)
  }

  const handleContinueDelete = () => {
    if (handleDeleteTask) {
      handleDeleteTask(id)
      setIsDialogOpen(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="justify-end outline-none">
        <div className="justify-end">
          <EllipsisVertical size={20} className="cursor-pointer" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleDeleteConfirmation}>
          <p className="text-red-500">Deletar tarefa</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <AlertDialog open={isDialogOpen} onOpenChange={handleCancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a
              tarefa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleContinueDelete}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  )
}
