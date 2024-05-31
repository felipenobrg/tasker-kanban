'use client'

import * as React from 'react'
import { useState } from 'react'
import AlertDialog from './alertDialog'
import { useBoard } from '@/context/boardContext'
import DropdownDeleteBoard from './dropdownDeleteBoard'
import Profile from '../profile/profile'
import HamburguerMenu from './hamburguerMenu'

export default function Header() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const { boardName, setBoardName } = useBoard()

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setIsAlertOpen(false)
  }

  const handleEllipsisClick = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleDeleteConfirmation = () => {
    setIsAlertOpen(true)
  }

  return (
    <header className="flex justify-end h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <HamburguerMenu />
      <div className="flex justify-end items-center ml-5 sm:w-fit w-full">
        <Profile />
        <DropdownDeleteBoard
          handleEllipsisClick={handleEllipsisClick}
          handleDeleteConfirmation={handleDeleteConfirmation}
        />
        {isAlertOpen && (
          <AlertDialog
            boardName={boardName}
            isDialogOpen={isAlertOpen}
            setIsDialogOpen={setIsDialogOpen}
            handleCancelDelete={handleCloseDialog}
            setIsAlertOpen={setIsAlertOpen}
            setBoardName={setBoardName}
          />
        )}
      </div>
    </header>
  )
}
