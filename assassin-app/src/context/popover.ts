import { ReactNode, createContext } from 'react'

export const PopoverContainerContext = createContext<React.RefObject<HTMLDivElement> | undefined>(undefined)

export interface ErrorContextProviderProps {
	children?: ReactNode
}
