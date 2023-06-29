import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faQuestion, faTimer } from '@fortawesome/pro-solid-svg-icons'

import './game-status.css'
import { createContext, useContext } from 'react'
import { faPlayCircle } from '@fortawesome/pro-regular-svg-icons'

export interface GameStatusContextType {
	status: string
	players: string[]
}
export const GameStatusContext = createContext<GameStatusContextType | undefined>(undefined)

function GameStatus() {
	const status = useContext(GameStatusContext)

	const getStatusIcon = () => {
		switch (status?.status) {
			case 'started':
				return faPlayCircle
			case 'ready':
				return faCheck
			case 'not-ready':
				return faTimer
			default:
				return faQuestion
		}
	}

	const getStatusLabel = () => {
		switch (status?.status) {
			case 'started':
				return 'Started!'
			case 'ready':
				return 'Ready!'
			case 'not-ready':
				return 'Not Ready'
			default:
				return 'Unknown'
		}
	}

	return (
		<div className="game-status">
				<span className={`label ${status?.status || 'unknown'}`}>
					<FontAwesomeIcon icon={getStatusIcon()} />
					<span>{getStatusLabel()}</span>
				</span>
		</div>
	)
}

export default GameStatus
