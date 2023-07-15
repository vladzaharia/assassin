import { useLoaderData, useNavigate } from 'react-router-dom'
import { Room as RoomResponse } from 'assassin-server-client'
import './room.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { faChevronLeft, faDoorOpen, faXmark } from '@fortawesome/pro-solid-svg-icons'
import RoomSettingsActions from '../../../components/room-settings-actions/room-settings-actions'
import RoomSettingsWordlist from '../../../components/room-settings-word/room-settings-word'
import { RoomContext } from '../../../context/room'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import RoomSettingsPlayerList from '../../../components/room-settings-player-list/room-settings-player-list'

export default function RoomAdmin() {
	const room = useLoaderData() as RoomResponse
	const navigate = useNavigate()

	return (
		<RoomContext.Provider
			value={{
				room: room,
				playerIsGM: true,
			}}
		>
			<div className="admin-room">
				<Header
					title={
						<>
							<FontAwesomeIcon className="mr-05" icon={faDoorOpen} />
							{room.name}
						</>
					}
					className="blue corner-right"
					leftActions={<Button className="blue" onClick={() => navigate(`/admin/room`)} iconProps={{ icon: faChevronLeft }} />}
					rightActions={<Button className="blue" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
				/>
				<RoomSettingsPlayerList apiType="admin" />
				<RoomSettingsActions apiType="admin" />
				<RoomSettingsWordlist apiType="admin" />
			</div>
		</RoomContext.Provider>
	)
}
