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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface MenubarTaskProps {
  handleDeleteTask?: (id: number, description: string, status: string) => void
}

export default function MenubarTask(props: MenubarTaskProps) {
  const { handleDeleteTask } = props
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDeleteConfirmation = () => {
    setIsDialogOpen(true)
  }

  const handleCancelDelete = () => {
    setIsDialogOpen(false)
  }

  const handleContinueDelete = () => {
    setIsDialogOpen(false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="justify-end">
        <div className="justify-end">
          <EllipsisVertical size={20} className="cursor-pointer" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <button onClick={handleDeleteConfirmation}>
            <p className="text-red-500">Deletar tarefa</p>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <AlertDialog open={isDialogOpen} onDismiss={handleCancelDelete}>
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
