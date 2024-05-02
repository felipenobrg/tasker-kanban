'use client'

import * as React from 'react'
import { LayoutPanelLeft, Plus, SquareCheckBig } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import DialogNewBoard from '../dialogs/dialogNewBoard/dialogNewBoard'
import { useEffect, useState } from 'react'
import getBoard from '@/lib/boards/getBoard'
import { Data } from '@/types/board'
import { useBoard } from '@/context/boardContext'

export default function Sidebar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [boardNamesSide, setBoardNamesSide] = useState<string[]>([])
  const [boardSize, setBoardSize] = useState<number[]>([])
  const [activeLink, setActiveLink] = useState<string>('')
  const { setBoardId, setBoardName, boardName, boardId } = useBoard()

  const openDialog = () => {
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
  }

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const boardDataResponse = await getBoard()
        const boardData = boardDataResponse.data
        const names = boardData.map((board: Data) => board.name)
        const boardId = boardData.map((board: Data) => board.ID)
        setBoardName(names)
        setBoardNamesSide(names)
        setBoardId(boardId)
        setBoardSize(boardData.length)
      } catch (error) {
        console.error('Error fetching board:', error)
      }
    }
    fetchBoard()
  }, [])

  console.log('BOARDNAME', boardName)
  console.log('boardId', boardId)

  const handleLinkClick = async (item: string) => {
    setActiveLink(item)
    await getBoard()
  }

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <SquareCheckBig className="h-6 w-6" />
            <span className="">Tasker</span>
          </Link>
        </div>
        <div className="flex-1">
          <div className="mt-3 mb-3 ml-5">
            <p className="text-sm text-gray-400">
              Todos os boards ({boardSize.length === 0 ? '0' : boardSize})
            </p>
          </div>
          {boardNamesSide.map((item, index) => (
            <nav
              key={index}
              className={`grid items-start px-2 text-sm font-medium lg:px-4 relative rounded-l-lg rounded-r-full w-11/12 ${
                activeLink === item ? 'bg-indigo-500' : ''
              }`}
            >
              <Link
                href="/"
                onClick={() => handleLinkClick(item)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LayoutPanelLeft size={20} className="text-white" />
                <p className="text-white">{item}</p>
              </Link>
            </nav>
          ))}
          <Button
            variant="ghost"
            className="mt-3 flex items-center flex-row gap-1 text-indigo-500 ml-3"
            onClick={openDialog}
          >
            <LayoutPanelLeft size={20} /> <Plus size={15} /> Criar Novo Board
          </Button>
        </div>
      </div>
      <DialogNewBoard isOpen={isDialogOpen} onClose={closeDialog} />
    </div>
  )
}
