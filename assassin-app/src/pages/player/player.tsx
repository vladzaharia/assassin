import { Player as PlayerResponse } from 'assassin-server-client'
import { useContext, useEffect } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { ErrorContext } from '../../context/error'
import { RoomContext } from '../../context/room'
import './player.css'

export default function Player() {
	const roomStatus = useContext(RoomContext)
	const errorContext = useContext(ErrorContext)
	const player = useLoaderData() as PlayerResponse

	const navigate = useNavigate()

	const hasPlayer = Object.keys(player).length > 0

	useEffect(() => {
		if (roomStatus?.room?.status !== 'started') {
			errorContext?.setError('The game has not started!', 'room')
			navigate(`/room/${roomStatus?.room?.name}`)
		}

		if (!hasPlayer) {
			errorContext?.setError('You are not in this room!', 'room')
			navigate(`/room/${roomStatus?.room?.name}`)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="player-info">
			{hasPlayer ? (
				<>
					<h2 className="title">How to Play</h2>
					<span>{player && player.name}</span>
				</>
			) : undefined}
		</div>
	)
}
