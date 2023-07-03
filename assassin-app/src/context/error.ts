import { ReactNode, createContext } from 'react'

export type RequestErrorType = 'join' | 'leave' | 'gm' | 'room' | 'player'

export interface RequestError {
	message: string
	errorType?: RequestErrorType
}

export interface ErrorContextProps {
	error?: RequestError
	setError: (message: string | undefined, errorType?: RequestErrorType) => void
	showError: boolean
	setShowError: React.Dispatch<React.SetStateAction<boolean>>
}
export const ErrorContext = createContext<ErrorContextProps | undefined>(undefined)

export interface ErrorContextProviderProps {
	children?: ReactNode
}
