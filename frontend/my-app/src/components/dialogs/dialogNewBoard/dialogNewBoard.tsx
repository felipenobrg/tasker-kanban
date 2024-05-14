import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import PostBoard from '@/lib/boards/postBoard'
import { FormEvent, useState } from 'react'
import { useBoard } from '@/context/boardContext'
import { Plus } from 'lucide-react'
import { useQueryClient } from 'react-query'

interface DialogNewBoardProps {
  isOpen: boolean
  onClose: () => void
}

export default function DialogNewBoard({
  isOpen,
  onClose,
}: DialogNewBoardProps) {
  const [boardName, setBoardName] = useState('')
  const { setBoardId, setBoardName: setContextBoardName } = useBoard()
  const queryClient = useQueryClient()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await PostBoard({ boardName })
      const newBoardId = response.data.ID
      setBoardId(newBoardId)
      setContextBoardName(boardName)
      onClose()
      queryClient.invalidateQueries('boardData')
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  return (
    <Dialog.Root modal open={isOpen} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed inset-0">
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </Dialog.Overlay>{' '}
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 rounded-lg shadow-md bg-gray-900 p-5 w-[25rem] h-80 flex flex-col gap-2 justify-center">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex justify-start items-center">
            <h1 className="flex items-center text-lg font-bold gap-2">
              <Plus />
              Adicionar novo Board
            </h1>
          </div>
          <p className="text-sm mt-2">Nome do Board</p>
          <Input
            type="text"
            className="w-full"
            placeholder="e.g Web Design"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
          />
          <Button type="submit" className="mt-5">
            Criar novo Board
          </Button>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
