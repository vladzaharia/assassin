import { createContext } from 'react'

export interface NameContextProps {
	name: string | undefined
	setName: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const NameContext = createContext<NameContextProps | undefined>(undefined)
