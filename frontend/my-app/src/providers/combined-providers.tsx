'use client'

import { BoardProvider } from '@/context/boardContext'
import { DialogProvider } from '@/context/dialogContext'
import { FilterProvider } from '@/context/filterContext'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import React from 'react'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <BoardProvider>
        <DialogProvider>
          <FilterProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </FilterProvider>
        </DialogProvider>
      </BoardProvider>
    </SessionProvider>
  )
}
