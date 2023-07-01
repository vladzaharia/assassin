import { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { RoomStatusContext } from '../room-status/room-status'

import './player-actions.css'
import { faMagnifyingGlass, faUserMinus, faUserPlus } from '@fortawesome/pro-solid-svg-icons'

export interface PlayerActionsProps {
	name: string
	lookup: () => void
	join: () => void
	leave: () => void
	requestError?: string
}

function PlayerActions({ name, lookup, join, leave, requestError }: PlayerActionsProps) {
	const roomStatus = useContext(RoomStatusContext)

	return (
		<div className="player-actions">
			{roomStatus?.status === 'started' ? (
				<button className={requestError && requestError !== 'ok' ? 'failed' : 'success'} onClick={lookup}>
					<FontAwesomeIcon icon={faMagnifyingGlass} size="xl" /> Look up Target
				</button>
			) : roomStatus?.players.includes(name) ? (
				<button className={requestError && requestError !== 'ok' ? 'failed' : 'primary'} onClick={leave}>
					<FontAwesomeIcon icon={faUserMinus} size="xl" /> Leave room
				</button>
			) : (
				<button className={requestError && requestError !== 'ok' ? 'failed' : 'secondary'} onClick={join} disabled={!roomStatus}>
					<FontAwesomeIcon icon={faUserPlus} size="xl" /> Join room
				</button>
			)}
		</div>
	)
}

export default PlayerActions
