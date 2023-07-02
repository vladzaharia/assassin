import { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { RoomStatusContext } from '../room-status/room-status'

import './player-actions.css'
import { faMagnifyingGlass } from '@fortawesome/pro-solid-svg-icons'
import useLocalStorage from 'use-local-storage'

export interface PlayerActionsProps {
	requestError?: string
}

function PlayerActions({ requestError }: PlayerActionsProps) {
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

export default PlayerActions
