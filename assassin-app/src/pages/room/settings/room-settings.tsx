import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { NotificationContext } from '../../../context/notification'
import { RoomContext } from '../../../context/room'
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roomStatus])

	return (
		<div className="room-settings">
			<Header
				className="blue corner-right"
				title="GM Settings"
				leftActions={<FontAwesomeIcon icon={faCrown} size="lg" />}
				rightActions={<Button iconProps={{ icon: faXmark }} className="blue" onClick={() => navigate(`/room/${roomStatus?.name}`)} />}
			/>
			<div className="gm-actions">
				<RoomSettingsActions apiType="gm" />
				<RoomSettingsPlayerList apiType="gm" />
				<RoomSettingsWordlist apiType="gm" />
			</div>
		</div>
	)
}
