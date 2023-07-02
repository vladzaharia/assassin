import { faMagnifyingGlass } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import useLocalStorage from 'use-local-storage'
import { RoomStatusContext } from '../room-status/room-status'
import './player-actions.css'

export interface PlayerActionsProps {
	requestError?: string
}

export default function PlayerActions({ requestError }: PlayerActionsProps) {
	const [name] = useLocalStorage('name', '')
	const roomContext = useContext(RoomStatusContext)
	const roomStatus = roomContext?.room

	return roomStatus?.status === 'started' && roomStatus?.players.some((p) => p.name === name) ? (
		<div className="player-actions">
			<button className={requestError && requestError !== 'ok' ? 'failed' : 'blue'} onClick={roomContext?.lookup}>
				<FontAwesomeIcon icon={faMagnifyingGlass} size="xl" /> Look up Target
			</button>
		</div>
	) : null
}
