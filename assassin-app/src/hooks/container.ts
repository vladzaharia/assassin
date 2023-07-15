import { createContext } from 'react'

export const ContainerContext = createContext<React.RefObject<HTMLDivElement> | undefined>(undefined)
