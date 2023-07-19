import { createContext } from 'react'
import { Theme } from '../types'

export interface ThemeContextProps {
	theme: Theme
	setTheme: React.Dispatch<React.SetStateAction<Theme>>
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)
