'use client'

import * as React from 'react'
import { ClipboardCheck, LayoutPanelLeft, Plus } from 'lucide-react'
import Link from 'next/link'
import DialogNewBoard from '../dialogs/dialogNewBoard/dialogNewBoard'
import { useCallback, useEffect, useState } from 'react'
import getBoard from '@/lib/boards/getBoard'
import { useBoard } from '@/context/boardContext'
import GetBoardById from '@/lib/boards/getBoardById'
import ChangeThemeButton from '../header/changeThemeButton'
import { useQuery } from '@tanstack/react-query'
import { useTheme } from 'next-themes'

export default function Sidebar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [boardSize, setBoardSize] = useState<number[]>([])
  const [activeLink, setActiveLink] = useState<string>('')
  const { setBoardId, setBoardName, setBoardData, boardData } = useBoard()
  const { theme } = useTheme()

  const { data: board, isLoading } = useQuery({
    queryKey: ['board'],
    queryFn: getBoard,
    retry: false,
  })

  useEffect(() => {
    if (board && board.data && board.data.boards) {
      setBoardData(board.data.boards)
    } else {
      setBoardData([])
    }
  }, [board, setBoardData])

  const openDialog = () => {
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
  }

  const handleLinkClick = useCallback(
    async (id: number) => {
      setActiveLink(id.toString())
      try {
        const tasksResponse = await GetBoardById({ id: id })
        const tasksData = tasksResponse.data
        const boardId = tasksData.ID
        const boardName = tasksData.name

        setBoardName(boardName)
        setBoardId(boardId)
        setBoardData((prevBoard) =>
          prevBoard.map((item) => {
            if (item.ID === id) {
              return tasksData
            }
            return item
          }),
        )
      } catch (error) {
        console.error('Error fetching tasks by board name:', error)
      }
    },
    [setBoardData, setBoardId, setBoardName],
  )

  useEffect(() => {
    if (!isLoading && boardData.length > 0) {
      setBoardSize([boardData.length])
      if (!activeLink) {
        setActiveLink(boardData[0].ID.toString())
        handleLinkClick(boardData[0].ID)
      }
    }
  }, [boardData, isLoading, activeLink, handleLinkClick])

  return (
    <div className="border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <ClipboardCheck />
            Tasker
          </Link>
        </div>
        <div className="flex-1">
          <div className="mt-3 mb-3 ml-5">
            <p
              className="text-smclassName={`${
                    theme === 'dark' ? 'text-gray-300 ' : 'text-gray-300'
                  } hover:text-primary`}"
            >
              Todos os boards ({boardSize.length === 0 ? '0' : boardSize})
            </p>
          </div>
          {boardData.map((item) => (
            <nav
              key={item.ID}
              className={`grid items-start px-2 gap-3 text-sm font-medium lg:px-4 relative mt-2 mb-2 rounded-l-lg rounded-r-full w-11/12 hover:bg-gray-400 text-indigo-500  ${
                activeLink === item.ID.toString() ? 'bg-indigo-500' : ''
              }`}
            >
              <button
                onClick={() => handleLinkClick(item.ID)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 w-11/12 transition-all cursor-pointer border-none ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                } hover:text-primary`}
              >
                <LayoutPanelLeft
                  size={20}
                  className={`${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  } hover:text-primary`}
                />
                {item.name}
              </button>
            </nav>
          ))}
          <Link
            href="/"
            className="mt-3 flex items-center  flex-row gap-1 text-indigo-500 ml-7 hover:rounded-l-lg rounded-r-full"
            onClick={openDialog}
          >
            <LayoutPanelLeft size={20} /> <Plus size={15} /> Criar Novo Board
          </Link>
          <div className="mt-10 ml-5 gap-2">
            <ChangeThemeButton />
          </div>
        </div>
        {isDialogOpen && (
          <DialogNewBoard isOpen={isDialogOpen} onClose={closeDialog} />
        )}
      </div>
    </div>
  )
}
