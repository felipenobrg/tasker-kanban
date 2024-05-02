import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'

interface FilterContextType {
  boardId: number | null
  setBoardId: Dispatch<SetStateAction<number | null>>
}
const FilterContext = createContext<FilterContextType>({
  boardId: null,
  setBoardId: () => {},
})

export const useBoardId = () => useContext(FilterContext)

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [boardId, setBoardId] = useState<number | null>(null)

  return (
    <FilterContext.Provider value={{ boardId, setBoardId }}>
      {children}
    </FilterContext.Provider>
  )
}
