import { BoardProvider } from '@/context/boardContext'
import { DialogProvider } from '@/context/dialogContext'
import { ThemeProvider } from 'next-themes'
import React from 'react'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <BoardProvider>
      <DialogProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </DialogProvider>
    </BoardProvider>
  )
}
