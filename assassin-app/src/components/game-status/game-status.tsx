import { createContext, useContext, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faQuestion, faTimer } from '@fortawesome/pro-solid-svg-icons'
import { faPlayCircle } from '@fortawesome/pro-regular-svg-icons'
import { Paper, Popover } from '@mui/material'

import './game-status.css'

export interface GameStatusContextType {
	status: string
	players: string[]
}
export const GameStatusContext = createContext<GameStatusContextType | undefined>(undefined)

function GameStatus() {
	// const status = useContext(GameStatusContext)
	const status: GameStatusContextType = {
		status: 'ready',
		players: []
	}
	const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
  const popoverAnchor = useRef<HTMLDivElement>(null);

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
				return 'Game started!'
			case 'ready':
				return 'Ready to start!'
			case 'not-ready':
				return 'Not ready'
			default:
				return 'Unknown'
		}
	}

	const getStatusDescription = () => {
		switch (status?.status) {
			case 'started':
				return 'The game has started! Look up your opponent and get them!'
			case 'ready':
				return 'The game is ready to start! Ask the GM to start the game.'
			case 'not-ready':
				return "There's not enough players to start a game. Get at least two players to join in order to start."
			default:
				return 'The status is unknown, check back later.'
		}
	}

	const getStatusColor = () => {
		switch (status?.status) {
			case 'started':
				return 'green'
			case 'ready':
				return 'blue'
			case 'not-ready':
				return 'orange'
			default:
				return 'grey-dark'
		}
	}

	const GameStatusPopoverContent = () => {
		return (
			<div className="game-popover">
				<h3 className={status?.status}>
					<FontAwesomeIcon icon={getStatusIcon()}  size='lg' />
					{getStatusLabel()}
				</h3>
				<span className='description'>
					{getStatusDescription()}
				</span>
			</div>
		)
	}

	return (
		<>
			<div ref={popoverAnchor} className={`game-status ${status?.status || 'unknown'}`} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)}>
				<FontAwesomeIcon icon={getStatusIcon()} />
			</div>
			<Popover
				open={popoverOpen}
				anchorEl={popoverAnchor.current}
				onClose={() => setPopoverOpen(false)}
				slotProps={{
					paper: {
						elevation: 0,
						sx: {
							"margin-top": "0.5rem",
							border: `solid 1px var(--${getStatusColor()})`,
							"border-radius": "0.5rem"
						}
					}
				}}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				sx={{
					pointerEvents: 'none',
				}}
				disableRestoreFocus
				hideBackdrop>
						<GameStatusPopoverContent />
			</Popover>
		</>
	)
}

export default GameStatus
