import { faRotateLeft, faPlay, faSparkles } from '@fortawesome/pro-solid-svg-icons'
import { createAdminOrGMApi } from '../../api'
import { NotificationContext, NotificationSource, useNotificationAwareRequest } from '../../hooks/notification'
import { RoomContext } from '../../hooks/room'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from 'use-local-storage'
import Action from '../action/action'
import Button from '../button/button'
import { CommonColor, RoomSettingsComponentProps } from '../../types'
import { useAuth } from 'react-oidc-context'
import SectionTitle from '../section-title/section-title'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function RoomSettingsActions({ apiType }: RoomSettingsComponentProps) {
	const navigate = useNavigate()
	const auth = useAuth()
	const [name] = useLocalStorage('name', '')
	const request = useNotificationAwareRequest()

	const api = createAdminOrGMApi(apiType, name, auth.user?.access_token || '')

	const { notification, showNotification } = useContext(NotificationContext)

	const roomContext = useContext(RoomContext)
	const roomStatus = roomContext?.room

	const isPlaying = roomStatus?.status === 'started'

	const resetGame = async () => {
		await request(
			async () => await api.resetRoom(roomContext?.room?.name || ''),
			{ message: `${roomContext?.room?.name || 'Room'} reset successfully!`, source: 'gm-reset' },
			() => navigate('..', { relative: 'path', replace: true })
		)
	}

	const startGame = async () => {
		await request(
			async () => api.startRoom(roomContext?.room?.name || ''),
			{ message: `Game started successfully!`, source: 'gm-start' },
			() => navigate('..', { relative: 'path', replace: true })
		)
	}

	const getColor = (baseColor: CommonColor, source: NotificationSource) => {
		if (showNotification && notification?.source === source) {
			return notification?.notificationType as CommonColor
		}

		return baseColor
	}

	return (
		<>
			<SectionTitle color="blue">
				<FontAwesomeIcon className="mr-05" icon={faSparkles} /> Actions
			</SectionTitle>
			<Action
				text="Reset game"
				description={
					isPlaying
						? 'Click the button to stop the game, remove everyone from the room and reset it.'
						: 'Click the button to remove everyone from the room and reset it.'
				}
			>
				<Button
					color={getColor('blue', 'gm-reset')}
					iconProps={{
						icon: faRotateLeft,
					}}
					onClick={() => resetGame()}
				/>
			</Action>
			<Action
				text="Start game"
				description={
					isPlaying
						? "The game has started; you'll need to wait to start the game."
						: roomStatus?.status === 'not-ready'
						? "There's not enough players in the room to start the game."
						: "There's enough players to start the game! Click the button to assign targets and words to players."
				}
			>
				<Button
					color={getColor('green', 'gm-start')}
					iconProps={{
						icon: faPlay,
					}}
					disabled={isPlaying || roomStatus?.status === 'not-ready'}
					onClick={() => startGame()}
				/>
			</Action>
		</>
	)
}
