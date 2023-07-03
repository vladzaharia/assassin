import { Player as PlayerResponse } from 'assassin-server-client'
import { useContext, useEffect } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { NotificationContext } from '../../context/notification'
import { RoomContext } from '../../context/room'
import './mission.css'
import Header from '../../components/header/header'
import Button from '../../components/button/button'
import { faXmark } from '@fortawesome/pro-solid-svg-icons'

export default function Mission() {
	const roomStatus = useContext(RoomContext)
	const { setError } = useContext(NotificationContext)
	const player = useLoaderData() as PlayerResponse

	const navigate = useNavigate()

	const hasPlayer = Object.keys(player).length > 0

	useEffect(() => {
		if (roomStatus?.room?.status !== 'started') {
			setError('The game has not started!', 'room')
			navigate(`/room/${roomStatus?.room?.name}`)
		}

		if (!hasPlayer) {
			setError('You are not in this room!', 'room')
			navigate(`/room/${roomStatus?.room?.name}`)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="player-info">
			{hasPlayer ? (
				// eslint-disable-next-line react/jsx-no-useless-fragment
				<>
					<Header
						title="Mission"
						rightActions={
							<Button className="primary" onClick={() => navigate(`/room/${roomStatus?.room?.name}`)} iconProps={{ icon: faXmark }} />
						}
					/>
				</>
			) : undefined}
		</div>
	)
}
