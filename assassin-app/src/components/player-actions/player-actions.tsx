import { faMagnifyingGlass } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import useLocalStorage from 'use-local-storage'
import { ErrorContext } from '../../context/error'
import { RoomContext } from '../../context/room'
import './player-actions.css'
import { useLocation, useNavigate } from 'react-router-dom'

export default function PlayerActions() {
	const [name] = useLocalStorage('name', '')
	const roomContext = useContext(RoomContext)
	const errorContext = useContext(ErrorContext)
	const navigate = useNavigate()
	const location = useLocation()

	const roomStatus = roomContext?.room

	return roomStatus?.status === 'started' && roomStatus?.players.some((p) => p.name === name) ? (
		<div className="player-actions">
			<button
				className={errorContext?.error && errorContext.error.message !== 'ok' ? 'failed' : 'blue'}
				onClick={() => {
					if (!location.pathname.includes('player')) {
						navigate('player')
					} else {
						navigate('..', { relative: 'path' })
					}
				}}>
				<FontAwesomeIcon icon={faMagnifyingGlass} size="xl" /> Look up Target
			</button>
		</div>
	) : null
}
