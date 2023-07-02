import { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { RoomStatusContext } from '../room-status/room-status'

import './player-actions.css'
import { faMagnifyingGlass, faUserMinus, faUserPlus } from '@fortawesome/pro-solid-svg-icons'
import useLocalStorage from 'use-local-storage'

export interface PlayerActionsProps {
	requestError?: string
}

function PlayerActions({ requestError }: PlayerActionsProps) {
	const roomContext = useContext(RoomStatusContext)

	return roomContext?.room?.status === 'started' ? (
		<div className="player-actions">
			<button className={requestError && requestError !== 'ok' ? 'failed' : 'blue'} onClick={roomContext?.lookup}>
				<FontAwesomeIcon icon={faMagnifyingGlass} size="xl" /> Look up Target
			</button>
		</div>
	) : null
}

export default PlayerActions
