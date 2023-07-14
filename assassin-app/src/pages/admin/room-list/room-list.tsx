import { useLoaderData, useNavigate } from 'react-router-dom'
import './room-list.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { faCheck, faDoorOpen, faTrash, faXmark, faEdit, faPlus } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BasicRoom } from 'assassin-server-client'
import Table from '../../../components/table/table'
import { TableCell } from '@mui/material'

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
					<Button className="green" iconProps={{ icon: faPlus }} />
				]}
				rows={rooms.map((room) => { return {
					name: room.name,
					cells: <>
						<TableCell component="th" scope="row">
							<strong>{room.name}</strong>
						</TableCell>
						<TableCell align="center">{room.numPlayers}</TableCell>
						<TableCell align="center"><FontAwesomeIcon icon={room.usesWords ? faCheck : faXmark} /></TableCell>
						<TableCell align="center">{room.numWordLists}</TableCell>
						<TableCell className='buttons' align="right"><Button className='orange' iconProps={{icon: faEdit}} onClick={() => navigate(room.name)} /> <Button className='primary' iconProps={{icon: faTrash}} /></TableCell>
					</>,
					onClick: () => navigate(room.name)
				}})}
			/>
		</div>
	)
}
