import { useLoaderData, useNavigate } from 'react-router-dom'
import { Room as RoomResponse } from 'assassin-server-client'
import './room.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { faChevronLeft, faDoorOpen, faXmark } from '@fortawesome/pro-solid-svg-icons'
import RoomSettingsActions from '../../../components/room-settings-actions/room-settings-actions'
import RoomSettingsWordlist from '../../../components/room-settings-word/room-settings-word'
import { RoomContext } from '../../../hooks/room'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import RoomSettingsPlayerList from '../../../components/room-settings-player-list/room-settings-player-list'
import useReload from '../../../hooks/reload'

export default function RoomAdmin() {
	const room = useLoaderData() as RoomResponse
	useReload(room)
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
					color="blue"
					className="corner-right"
					leftActions={<Button color="blue" onClick={() => navigate(`/admin/room`)} iconProps={{ icon: faChevronLeft }} />}
					rightActions={<Button color="blue" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
				/>
				<RoomSettingsPlayerList apiType="admin" />
				<RoomSettingsActions apiType="admin" />
				<RoomSettingsWordlist apiType="admin" />
			</div>
		</RoomContext.Provider>
	)
}
