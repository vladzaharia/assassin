import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorContext } from '../../context/error'
import { RoomContext } from '../../context/room'
import './gm.css'
import Header from '../../components/header/header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/pro-solid-svg-icons'

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
			<Header
				title="GM Options"
				rightActions={
					<button className="primary" onClick={() => navigate(`/room/${roomStatus?.room?.name}`)}>
						<FontAwesomeIcon icon={faXmark} />
					</button>
				}
			/>
		</div>
	)
}
