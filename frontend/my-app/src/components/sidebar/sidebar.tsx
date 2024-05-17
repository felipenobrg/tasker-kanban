'use client'

import * as React from 'react'
import { LayoutPanelLeft, Plus, SquareCheckBig } from 'lucide-react'
import Link from 'next/link'
import DialogNewBoard from '../dialogs/dialogNewBoard/dialogNewBoard'
import { useCallback, useEffect, useState } from 'react'
import getBoard from '@/lib/boards/getBoard'
import { useBoard } from '@/context/boardContext'
import GetBoardById from '@/lib/boards/getBoardById'
import ChangeThemeButton from '../header/changeThemeButton'
import TaskerLogo from '../../assets/taskerBoardLogo.png'
import Image from 'next/image'

export default function Sidebar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [boardSize, setBoardSize] = useState<number[]>([])
  const [activeLink, setActiveLink] = useState<string>('')
  const [shouldFetchBoard, setShouldFetchBoard] = useState(true)
  const { setBoardId, setBoardName, setBoardData, boardData } = useBoard()

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
    if (shouldFetchBoard) {
      const fetchBoard = async () => {
        try {
          const boardDataResponse = await getBoard()
          const newBoardData = boardDataResponse.data.boards
          if (newBoardData.length > 0) {
            handleLinkClick(newBoardData[0].ID)
          }
          setBoardData(newBoardData)
          setBoardSize(newBoardData.length)
        } catch (error) {
          console.error('Error fetching board:', error)
        }
      }
      fetchBoard()
      setShouldFetchBoard(false)
    }
  }, [handleLinkClick, setBoardData, shouldFetchBoard])

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src={TaskerLogo} alt="Logo do Tasker" className="w-32 h-9" />
          </Link>
        </div>
        <div className="flex-1">
          <div className="mt-3 mb-3 ml-5">
            <p className="text-sm text-gray-400">
              Todos os boards ({boardSize.length === 0 ? '0' : boardSize})
            </p>
          </div>
          {boardData.map((item) => (
            <nav
              key={item.ID}
              className={`grid items-start px-2 gap-3 text-sm font-medium lg:px-4 relative mt-2 mb-2 rounded-l-lg rounded-r-full w-11/12 hover:bg-gray-400 text-indigo-500 ${
                activeLink === item.ID.toString() ? 'bg-indigo-500' : ''
              }`}
            >
              <button
                onClick={() => handleLinkClick(item.ID)}
                className="flex text-white items-center gap-2 rounded-lg px-3 py-2 w-11/12 text-muted-foreground transition-all bg-none cursor-pointer border-nonehover:text-primary"
              >
                <LayoutPanelLeft size={20} className="text-white" />
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
