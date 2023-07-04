import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { NotificationContext } from '../../context/notification'
import { RoomContext } from '../../context/room'
import './gm.css'
import Header from '../../components/header/header'
import { faXmark } from '@fortawesome/pro-solid-svg-icons'
import Button from '../../components/button/button'

export default function GM() {
	const roomStatus = useContext(RoomContext)
	const { setError } = useContext(NotificationContext)

	const navigate = useNavigate()

	useEffect(() => {
		if (!roomStatus?.playerIsGM) {
			setError('You are not the GM of this room!')
			navigate(`/room/${roomStatus?.room?.name}`)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="gm-info">
			<Header
				title="GM Options"
				rightActions={
					<Button iconProps={{ icon: faXmark }} className="primary" onClick={() => navigate(`/room/${roomStatus?.room?.name}`)} />
				}
			/>

		</div>
	)
}
