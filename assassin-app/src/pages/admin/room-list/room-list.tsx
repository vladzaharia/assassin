import { useLoaderData, useNavigate } from 'react-router-dom'
import './room-list.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { faCheck, faDoorOpen, faTrash, faXmark, faEdit, faPlus } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BasicRoom } from 'assassin-server-client'
import Table from '../../../components/table/table'

export default function RoomsAdmin() {
	const rooms = useLoaderData() as BasicRoom[]
	const navigate = useNavigate()

	return (
		<div className="list room-list">
			<Header
				title="Rooms"
				className="blue corner-right"
				leftActions={<FontAwesomeIcon icon={faDoorOpen} size="lg" />}
				rightActions={<Button className="blue" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
			/>
			<Table
				className="blue"
				headers={[
					"Room Name",
					"# Players",
					"Uses Words?",
					"# Word Lists",
					<div className='buttons'><Button className="green" iconProps={{ icon: faPlus }} /></div>
				]}
				rows={rooms.map((room) => { return {
					name: room.name,
					cells: [
						<strong>{room.name}</strong>,
						room.numPlayers.toString(),
						<FontAwesomeIcon icon={room.usesWords ? faCheck : faXmark} />,
						room.numWordLists.toString(),
						<div className='buttons'><Button className='orange' iconProps={{icon: faEdit}} onClick={() => navigate(room.name)} /> <Button className='primary' iconProps={{icon: faTrash}} /></div>,
					],
					onClick: () => navigate(room.name)
				}})}
			/>
		</div>
	)
}
