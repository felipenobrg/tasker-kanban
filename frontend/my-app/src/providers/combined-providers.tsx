'use client'

import { BoardProvider } from '@/context/boardContext'
import { DialogProvider } from '@/context/dialogContext'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import React from 'react'

interface ProvidersProps {
  children: React.ReactNode
  session: any
}

export default function Providers({ children, session }: ProvidersProps) {
  console.log('SESSION', session)
  return (
    <SessionProvider session={session}>
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
    </SessionProvider>
  )
}
