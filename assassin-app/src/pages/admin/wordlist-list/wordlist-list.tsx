import { useLoaderData, useNavigate } from 'react-router-dom'
import './wordlist-list.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { faChartLineUp, faCircleHalfStroke, faComputerClassic, faDagger, faEarthAmericas, faEdit, faFlag, faFlask, faFlaskRoundPoison, faPlanetRinged, faPlus, faStars, faTextSize, faTrash, faXmark } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BasicWordlist } from 'assassin-server-client'
import Table from '../../../components/table/table'
import { TableCell } from '@mui/material'
import room from '../room/room'
import { IconProp, library } from '@fortawesome/fontawesome-svg-core'

export default function WordlistsAdmin() {
	const wordlists = useLoaderData() as BasicWordlist[]
	const navigate = useNavigate()

	library.add(
		faFlask,
		faFlaskRoundPoison,
		faPlanetRinged,
		faCircleHalfStroke,
		faDagger,
		faChartLineUp,
		faComputerClassic,
		faStars,
		faFlag,
		faEarthAmericas
	)

	return (
		<div className="list wordlist-list">
			<Header
				title="Word lists"
				className="green corner-right"
				leftActions={<FontAwesomeIcon icon={faTextSize} size="lg" />}
				rightActions={<Button className="green" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
			/>
			<Table
				className="green"
				headers={[
					"Word list Name",
					"# Words",
					<Button className="green" iconProps={{ icon: faPlus }} />
				]}
				rows={wordlists.map((list) => { return {
					name: room.name,
					cells: <>
						<TableCell component="th" scope="row">
							<FontAwesomeIcon className='mr-05' icon={list.icon as IconProp || faTextSize} /> <strong>{list.name}</strong>
						</TableCell>
						<TableCell align="center">{list.numWords}</TableCell>
						<TableCell className='buttons' align="right"><Button className='orange' iconProps={{icon: faEdit}} onClick={() => navigate(list.name)} /> <Button className='primary' iconProps={{icon: faTrash}} onClick={(e) => { e.stopPropagation(); e.preventDefault(); }} /></TableCell>
					</>,
					onClick: () => navigate(list.name)
				}})}
			/>
		</div>
	)
}
