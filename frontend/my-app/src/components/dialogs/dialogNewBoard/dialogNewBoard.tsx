import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import PostBoard from '@/lib/boards/postBoard'
import { FormEvent, useState } from 'react'

interface DialogNewBoardProps {
  isOpen: boolean
  onClose: () => void
}

export default function DialogNewBoard({
  isOpen,
  onClose,
}: DialogNewBoardProps) {
  const [boardName, setBoardName] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const board = await PostBoard({
        boardName,
      })
      onClose()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  return (
    <Dialog.Root modal open={isOpen} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black opacity-70"></Dialog.Overlay>
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 rounded shadow-md bg-gray-900 p-5 w-80 min-h-72 flex flex-col gap-2 justify-center">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex items-center">
            <h1 className="text-base font-bold">Adicionar novo Board</h1>
          </div>
          <p className="text-sm mt-2">Nome do Board</p>
          <Input
            type="text"
            className="w-full"
            placeholder="e.g Web Design"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
          />
          <Button type="submit" className="mt-3">
            Criar novo Board
          </Button>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
