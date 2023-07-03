import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useLocalStorage from 'use-local-storage'
import { RoomContext } from '../../context/room'
import './player-actions.css'
import { faUserSecret } from '@fortawesome/pro-regular-svg-icons'
import Button from '../button/button'

export default function PlayerActions() {
	const [name] = useLocalStorage('name', '')
	const roomContext = useContext(RoomContext)
	const navigate = useNavigate()
	const location = useLocation()

	const roomStatus = roomContext?.room

	return roomStatus?.status === 'started' && roomStatus?.players.some((p) => p.name === name) ? (
		<div className="player-actions">
			<Button
				className="primary"
				text="Retrieve mission"
				iconProps={{
					icon: faUserSecret,
					size: 'xl',
				}}
				onClick={() => {
					if (!location.pathname.includes('mission')) {
						navigate('mission')
					} else {
						navigate('..', { relative: 'path' })
					}
				}}
			/>
		</div>
	) : null
}
