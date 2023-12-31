import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { NotificationContext } from '../../../hooks/notification'
import { RoomContext } from '../../../hooks/room'
import './room-settings.css'
import Header from '../../../components/header/header'
import { faCrown, faXmark } from '@fortawesome/pro-solid-svg-icons'
import Button from '../../../components/button/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import RoomSettingsWordlist from '../../../components/room-settings-word/room-settings-word'
import RoomSettingsActions from '../../../components/room-settings-actions/room-settings-actions'
import RoomSettingsPlayerList from '../../../components/room-settings-player-list/room-settings-player-list'

export default function RoomSettings() {
	const navigate = useNavigate()

	const { setError } = useContext(NotificationContext)

	const roomContext = useContext(RoomContext)
	const roomStatus = roomContext?.room

	useEffect(() => {
		if (!roomContext?.playerIsGM) {
			setError('You are not the GM of this room!')
			navigate(`/room/${roomStatus?.name}`)
		}
	}, [roomStatus])

	return (
		<div className="room-settings">
			<Header
				color="blue"
				className="corner-right"
				title="GM Settings"
				leftActions={<FontAwesomeIcon icon={faCrown} size="lg" />}
				rightActions={
					<Button color="blue" iconProps={{ icon: faXmark }} className="blue" onClick={() => navigate(`/room/${roomStatus?.name}`)} />
				}
			/>
			<div className="gm-actions">
				<RoomSettingsPlayerList apiType="gm" />
				<RoomSettingsActions apiType="gm" />
				<RoomSettingsWordlist apiType="gm" />
			</div>
		</div>
	)
}
