import { useLoaderData, useNavigate } from 'react-router-dom'
import './rooms.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { faDoorOpen, faXmark } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function RoomsAdmin() {
	const rooms = useLoaderData() as string[]
	const navigate = useNavigate()

	return (
		<div className="room-list">
			<Header
				title="Rooms"
				className="primary corner-right"
				leftActions={<FontAwesomeIcon icon={faDoorOpen} size="lg" />}
				rightActions={<Button className="primary" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
			/>
		</div>
	)
}
