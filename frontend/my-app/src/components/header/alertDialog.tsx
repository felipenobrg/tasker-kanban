import { useBoard } from '@/context/boardContext'
import DeleteBoard from '@/lib/boards/deleteBoard'
import {
  AlertDialog as Alert,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'

interface AlertDialogProps {
  isDialogOpen: boolean
  setIsAlertOpen: (open: boolean) => void
  setIsDialogOpen: (open: boolean) => void
  handleCancelDelete: () => void
}

export default function AlertDialog(props: AlertDialogProps) {
  const { isDialogOpen, setIsDialogOpen, handleCancelDelete, setIsAlertOpen } =
    props

  const { boardId } = useBoard()

  const handleDeleteBoard = async () => {
    if (boardId !== null) {
      await DeleteBoard({ id: boardId })
      setIsDialogOpen(false)
      setIsAlertOpen(false)
      window.location.reload()
    } else {
      console.error('Cannot delete board: boardId is null')
    }
  }

  return (
    <Alert open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o
            board.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancelDelete}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteBoard}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </Alert>
  )
}
