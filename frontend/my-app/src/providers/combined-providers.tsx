'use client'

import { BoardProvider } from '@/context/boardContext'
import { DialogProvider } from '@/context/dialogContext'
import { FilterProvider } from '@/context/filterContext'
import { TaskProvider } from '@/context/taskContext'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from 'react-query'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  const queryClient = new QueryClient()

  return (
    <SessionProvider>
      <BoardProvider>
        <DialogProvider>
          <FilterProvider>
            <TaskProvider>
              <QueryClientProvider client={queryClient}>
                <ToastContainer theme="dark" />
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  {children}
                </ThemeProvider>
              </QueryClientProvider>
            </TaskProvider>
          </FilterProvider>
        </DialogProvider>
      </BoardProvider>
    </SessionProvider>
  )
}
