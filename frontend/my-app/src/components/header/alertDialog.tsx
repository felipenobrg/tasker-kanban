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
  setIsDialogOpen: (open: boolean) => void
  handleCancelDelete: () => void
  handleDeleteBoard: () => void
}

export default function AlertDialog(props: AlertDialogProps) {
  const {
    isDialogOpen,
    setIsDialogOpen,
    handleCancelDelete,
    handleDeleteBoard,
  } = props

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
