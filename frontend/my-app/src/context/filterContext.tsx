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
}

const FilterContext = createContext<FilterContextType>({
  filterValue: '',
  setFilterValue: () => {},
})

export const useFilter = () => useContext(FilterContext)

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filterValue, setFilterValue] = useState<string>('')

  return (
    <FilterContext.Provider value={{ filterValue, setFilterValue }}>
      {children}
    </FilterContext.Provider>
  )
}
