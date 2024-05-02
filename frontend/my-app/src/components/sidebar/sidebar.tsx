import * as React from 'react'
import {
  HomeIcon,
  LayoutPanelLeft,
  Package2,
  Plus,
  SquareCheckBig,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'

export default function Sidebar() {
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
          <div className="mt-3 mb-3 ml-3">
            <p className="text-sm text-gray-400">Todos os boards (2)</p>
          </div>
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 bg-indigo-500 p-3 relative rounded-l-lg rounded-r-full w-11/12">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <LayoutPanelLeft size={20} className="text-white" />
              <p className="text-white"> Tasker Board</p>
            </Link>
          </nav>
          <Button
            variant="ghost"
            className="mt-3 flex items-center flex-row gap-1 text-indigo-500 ml-3"
          >
            <LayoutPanelLeft size={20} /> <Plus size={15} /> Criar Novo Board
          </Button>
        </div>
      </div>
    </div>
  )
}
