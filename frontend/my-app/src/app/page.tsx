'use client'

import Sidebar from '@/components/sidebar/sidebar'
import Header from '@/components/header/header'
import Board from '@/components/board/board'
import { useState } from 'react'
import { FilterProvider } from '@/context/filterContext'

export default function Home() {
  const [darkTheme, setDarkTheme] = useState(true)

  const toggleTheme = () => {
    setDarkTheme((prevTheme) => !prevTheme)
  }

  return (
    <div
      className={`grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ${darkTheme ? 'dark' : ''}`}
    >
      <FilterProvider>
        <Sidebar />
        <div className="flex flex-col">
          <Header toggleTheme={toggleTheme} />
          <Board />
        </div>
      </FilterProvider>
    </div>
  )
}
