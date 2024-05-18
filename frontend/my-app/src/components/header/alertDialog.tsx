import { useBoard } from '@/context/boardContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
  boardName: string | null
  setIsAlertOpen: (open: boolean) => void
  setIsDialogOpen: (open: boolean) => void
  handleCancelDelete: () => void
  setBoardName: (name: string) => void
}

export default function AlertDialog(props: AlertDialogProps) {
  const {
    isDialogOpen,
    boardName,
    setIsDialogOpen,
    handleCancelDelete,
    setIsAlertOpen,
    setBoardName,
  } = props
  const queryClient = useQueryClient()
  const { boardId } = useBoard()
  const { mutate: mutateBoard } = useMutation({
    mutationFn: DeleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    },
  })
  const handleDeleteBoard = () => {
    if (boardId !== null) {
      mutateBoard({ id: boardId })
      setIsDialogOpen(false)
      setIsAlertOpen(false)
      setBoardName('')
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
            board <strong>{boardName}</strong>.
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
