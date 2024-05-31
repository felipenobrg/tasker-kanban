import getBoard from '@/lib/boards/getBoard'
import GetBoardById from '@/lib/boards/getBoardById'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useCallback, useState } from 'react'
import DialogNewBoard from '../dialogs/dialogNewBoard/dialogNewBoard'
import { Button } from '../ui/button'
import { Sheet, SheetTrigger, SheetContent } from '../ui/sheet'
import { ClipboardCheck, LayoutPanelLeft, Link, Menu, Plus } from 'lucide-react'
import ChangeThemeButton from './changeThemeButton'
import { useBoard } from '@/context/boardContext'
import { useTheme } from 'next-themes'

export default function HamburguerMenu() {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Mudar menu de navegação</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <div className="flex justify-start items-start flex-col gap-2">
          <div className="flex items-center w-full">
            <p className="flex items-center gap-2 font-bold text-xl">
              <ClipboardCheck />
              Tasker
            </p>
          </div>
          <div className="flex-1">
            <div className="flex justify-start mb-3 mt-8">
              <p
                className="text-sm className={`${
                    theme === 'dark' ? 'text-gray-300 ' : 'text-gray-300'
                  } hover:text-primary`}"
              >
                Todos os quadros ( {boardSize.length === 0 ? '0' : boardSize} )
              </p>
            </div>
            {boardData.map((item) => (
              <nav
                key={item.ID}
                className={`grid items-start px-2 gap-3 text-sm font-medium lg:px-4 relative mt-2 mb-2 rounded-l-lg rounded-r-full w-full hover:bg-gray-400 text-indigo-500  ${
                  activeLink === item.ID.toString() ? 'bg-indigo-500' : ''
                }`}
              >
                <Button
                  onClick={() => handleLinkClick(item.ID)}
                  className={`flex justify-start items-center gap-2 rounded-lg px-3 py-2 w-full transition-all cursor-pointer border-none ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  } hover:text-primary`}
                  variant="ghost"
                >
                  <LayoutPanelLeft
                    size={20}
                    className={`${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    } hover:text-primary`}
                  />
                  {item.name}
                </Button>
              </nav>
            ))}
            <Button
              className="mt-3 flex items-center  flex-row gap-1 text-indigo-500  hover:rounded-l-lg rounded-r-full hover:text-indigo-600"
              onClick={openDialog}
              variant="ghost"
            >
              <LayoutPanelLeft size={20} /> <Plus size={15} /> Criar Novo Quadro
            </Button>
            <div className="mt-10 gap-2">
              <ChangeThemeButton />
            </div>
          </div>
          {isDialogOpen && (
            <DialogNewBoard isOpen={isDialogOpen} onClose={closeDialog} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
