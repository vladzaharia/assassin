import { useLoaderData, useNavigate } from 'react-router-dom'
import { Room as RoomResponse } from 'assassin-server-client'
import './room.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { faChevronLeft, faXmark } from '@fortawesome/pro-solid-svg-icons'

export default function RoomAdmin() {
	const room = useLoaderData() as RoomResponse
	const navigate = useNavigate()

	return (
		<div className="room">
			<Header
				title={room.name}
				className="primary corner-right"
				leftActions={<Button className="primary" onClick={() => navigate(`/admin/room`)} iconProps={{ icon: faChevronLeft }} />}
				rightActions={<Button className="primary" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
			/>
		</div>
	)
}
