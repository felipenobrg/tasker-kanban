'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'

interface FilterContextType {
  filterValue: string
  setFilterValue: Dispatch<SetStateAction<string>>
  select: string
  setSelect: Dispatch<SetStateAction<string>>
}

const FilterContext = createContext<FilterContextType>({} as FilterContextType)

export const useFilter = () => useContext(FilterContext)

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filterValue, setFilterValue] = useState<string>('')
  const [select, setSelect] = useState<string>('')

  return (
    <FilterContext.Provider
      value={{ filterValue, select, setFilterValue, setSelect }}
    >
      {children}
    </FilterContext.Provider>
  )
}
