import { faCheck, faPlay, faQuestion, faTimer, faTrophyStar } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import isMobile from 'is-mobile'
import { useContext, useRef, useState } from 'react'
import useLocalStorage from 'use-local-storage'
import { RoomContext } from '../../context/room'
import Popover from '../popover/popover'
import './room-status.css'

export default function RoomStatus({ showText, showPopover }: { showText?: boolean; showPopover?: boolean }) {
	const [name] = useLocalStorage('name', '')
	const roomContext = useContext(RoomContext)
	const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const popoverAnchor = useRef<any>(null)

	const roomStatus = roomContext?.room

	const getStatusIcon = () => {
		switch (roomStatus?.status) {
			case 'completed':
				return faTrophyStar
			case 'started':
				return faPlay
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
			case 'completed':
				return 'Game Completed!'
			case 'started':
				return 'Game Started!'
			case 'ready':
				return 'Ready to Start!'
			case 'not-ready':
				return 'Not Ready'
			default:
				return 'Unknown'
		}
	}

	const getStatusDescription = () => {
		const playersNeeded = 3 - (roomStatus?.players.length || 0)

		switch (roomStatus?.status) {
			case 'completed':
				return roomContext?.playerIsGM ? (
					<>Go into GM Settings and start the game again or reset the room.</>
				) : (
					<>Ask the GM to start the game again.</>
				)
			case 'started':
				return roomStatus?.players.some((p) => p.name === name) ? (
					'The game has started! Retreive your mission up and eliminate your target!'
				) : (
					<>
						<strong>The game has already started.</strong>
						<br />
						<br /> You'll need to wait until the game ends or join another room.
					</>
				)
			case 'ready':
				return roomContext?.playerIsGM ? <>Go into GM Settings and start the game.</> : <>Ask the GM to start the game.</>
			case 'not-ready':
				return (
					<>
						You must have at least 3 players in a room to start.
						<br />
						<br />{' '}
						<strong>
							Get {playersNeeded} more {playersNeeded === 1 ? 'player' : 'players'} to join in order to begin playing!
						</strong>
					</>
				)
			default:
				return 'The status is unknown, check back later.'
		}
	}

	const getStatusColor = () => {
		switch (roomStatus?.status) {
			case 'completed':
				return 'orange'
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
				onPointerEnter={() => {
					if (!isMobile()) {
						setPopoverOpen(true)
					}
				}}
				onPointerLeave={() => {
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
				{showText ? getStatusLabel() : undefined}
			</div>
			<Popover
				open={popoverOpen && !!showPopover}
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
