import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorContext } from '../../context/error'
import { RoomContext } from '../../context/room'
import './gm.css'

export default function GM() {
	const roomStatus = useContext(RoomContext)
	const errorContext = useContext(ErrorContext)

	const navigate = useNavigate()

	useEffect(() => {
		if (!roomStatus?.playerIsGM) {
			errorContext?.setError('You are not the GM of this room!')
			navigate(`/room/${roomStatus?.room?.name}`)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="gm-info">
			<h2 className="title">How to Play</h2>
		</div>
	)
}
