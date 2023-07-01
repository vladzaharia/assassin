import { createContext, useContext, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faQuestion, faTimer } from '@fortawesome/pro-solid-svg-icons'
import { faPlayCircle } from '@fortawesome/pro-regular-svg-icons'
import isMobile from 'is-mobile'

import './room-status.css'
import Popover from '../popover/popover'
import { Room } from 'assassin-server-client'

export interface RoomStatusContextType {
	status: string
	players: string[]
}
export const RoomStatusContext = createContext<Room | undefined>(undefined)

function RoomStatus() {
	const roomStatus = useContext(RoomStatusContext)
	const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
	const popoverAnchor = useRef<HTMLDivElement>(null)

	const getStatusIcon = () => {
		switch (roomStatus?.status) {
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
		switch (roomStatus?.status) {
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
		const playersNeeded = 3 - (roomStatus?.players.length || 0)

		switch (roomStatus?.status) {
			case 'started':
				return 'The game has started! Look up your opponent and get them!'
			case 'ready':
				return 'The game is ready to start! Ask the GM to start the game.'
			case 'not-ready':
				return `There's not enough players to start a game. Get ${playersNeeded} more ${
					playersNeeded === 1 ? 'player' : 'players'
				} to join in order to start!`
			default:
				return 'The status is unknown, check back later.'
		}
	}

	const getStatusColor = () => {
		switch (roomStatus?.status) {
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

	return (
		<>
			<div
				ref={popoverAnchor}
				className={`room-status ${getStatusColor()}`}
				onMouseEnter={() => {
					if (!isMobile()) {
						setPopoverOpen(true)
					}
				}}
				onMouseLeave={() => {
					if (!isMobile()) {
						setPopoverOpen(false)
					}
				}}
				onClick={() => {
					if (isMobile()) {
						setPopoverOpen(!popoverOpen)
					}
				}}
			>
				<FontAwesomeIcon icon={getStatusIcon()} />
			</div>
			<Popover
				open={popoverOpen}
				anchor={popoverAnchor.current}
				color={getStatusColor()}
				title={getStatusLabel()}
				description={getStatusDescription()}
				icon={getStatusIcon()}
				onClose={() => setPopoverOpen(false)}
			/>
		</>
	)
}

export default RoomStatus
