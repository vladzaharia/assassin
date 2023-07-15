import { Room } from 'assassin-server-client'
import { createContext } from 'react'

export interface RoomContextProps {
	room: Room | undefined
	playerIsGM: boolean
}

export const RoomContext = createContext<RoomContextProps | undefined>(undefined)
