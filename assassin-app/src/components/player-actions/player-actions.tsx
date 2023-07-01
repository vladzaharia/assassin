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
	const [name] = useLocalStorage("name", "")
	const roomContext = useContext(RoomStatusContext)
	const roomStatus = roomContext?.room

	return (
		<div className="player-actions">
			{roomStatus?.status === 'started' ? (
				<button className={requestError && requestError !== 'ok' ? 'failed' : 'blue'} onClick={roomContext?.lookup}>
					<FontAwesomeIcon icon={faMagnifyingGlass} size="xl" /> Look up Target
				</button>
			) : roomStatus?.players.some((p) => p.name === name) ? (
				<button className={requestError && requestError !== 'ok' ? 'failed' : 'primary'} onClick={roomContext?.leave}>
					<FontAwesomeIcon icon={faUserMinus} size="xl" /> Leave room
				</button>
			) : (
				<button className={requestError && requestError !== 'ok' ? 'failed' : 'green'} onClick={roomContext?.join} disabled={!roomStatus}>
					<FontAwesomeIcon icon={faUserPlus} size="xl" /> Join room
				</button>
			)}
		</div>
	)
}

export default PlayerActions
