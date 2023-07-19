import { useContext, useEffect } from 'react'
import { RoomContext } from '../../../hooks/room'
import './complete.css'
import { useNavigate } from 'react-router-dom'

export default function Complete() {
	const roomContext = useContext(RoomContext)

	const navigate = useNavigate()

	useEffect(() => {
		const room = roomContext?.room

		if (room?.status !== 'completed') {
			navigate(`/room/${room?.name}`)
		}
	}, [roomContext?.room])

	return (
		<div className="complete">
			<h2 className="title">Game complete!</h2>
		</div>
	)
}
