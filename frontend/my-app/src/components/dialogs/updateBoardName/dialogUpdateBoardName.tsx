import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { FormEvent, useState, useEffect } from 'react'
import { Edit } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTheme } from 'next-themes'
import UpdateBoard from '@/lib/boards/updateBoard'
import { useBoard } from '@/context/boardContext'

interface DialogNewBoardProps {
  isOpen: boolean
  onClose: () => void
}

export default function DialogUpdateBoardName({
  isOpen,
  onClose,
}: DialogNewBoardProps) {
  const queryClient = useQueryClient()
  const { theme } = useTheme()
  const { boardName: BoardNameContext } = useBoard()
  const [boardName, setBoardName] = useState(BoardNameContext ?? '')

  useEffect(() => {
    setBoardName(BoardNameContext ?? '')
  }, [BoardNameContext])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      mutateBoard({ boardName })
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const { mutate: mutateBoard } = useMutation({
    mutationFn: UpdateBoard,
    onSuccess: () => {
      onClose()
      queryClient.invalidateQueries({ queryKey: ['board'] })
    },
  })

  return (
    <Dialog.Root modal open={isOpen} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-90 z-50" />
      <Dialog.Content
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 rounded-lg shadow-md  p-5 w-[25rem] h-80 flex flex-col gap-2 justify-center ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-gray-200'
        }`}
      >
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex justify-start items-center">
            <h1 className="flex items-center text-lg font-bold gap-2">
              <Edit />
              Editar nome do Quadro
            </h1>
          </div>
          <p className="text-sm mt-2">Nome do Quadro</p>
          <Input
            type="text"
            className="w-full"
            onChange={(e) => setBoardName(e.target.value)}
            value={boardName}
          />
          <Button type="submit" className="mt-5">
            Editar
          </Button>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
