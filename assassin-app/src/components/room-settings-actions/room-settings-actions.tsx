import { faRotateLeft, faPlay } from '@fortawesome/pro-solid-svg-icons'
import { createAdminApi, createGMApi } from '../../api'
import { NotificationContext, NotificationSource } from '../../context/notification'
import { RoomContext } from '../../context/room'
import { useContext } from 'react'
import { useNavigate, useRevalidator } from 'react-router-dom'
import useLocalStorage from 'use-local-storage'
import Action from '../action/action'
import { isAxiosError } from 'axios'
import Button from '../button/button'
import { RoomSettingsComponentProps } from '../../types'
import { useAuth } from 'react-oidc-context'
import { AdminApi, GMApi } from 'assassin-server-client'
import SectionTitle from '../section-title/section-title'

export default function RoomSettingsActions({ apiType }: RoomSettingsComponentProps) {
	const navigate = useNavigate()
	const { revalidate } = useRevalidator()
	const auth = useAuth()
	const [name] = useLocalStorage('name', '')

	let api: GMApi | AdminApi

	if (apiType === 'admin') {
		api = createAdminApi(auth.user?.access_token || '')
	} else {
		api = createGMApi(name)
	}

	const { setError, setNotification, notification, showNotification } = useContext(NotificationContext)

	const roomContext = useContext(RoomContext)
	const roomStatus = roomContext?.room

	const isPlaying = roomStatus?.status === 'started'

	const resetGame = async () => {
		try {
			await api.resetRoom(roomContext?.room?.name || '')
			setNotification({ message: 'Room reset successfully!', notificationType: 'success', source: 'gm-reset' })
			navigate('..', { relative: 'path', replace: true })
			revalidate()
		} catch (e) {
			if (isAxiosError(e)) {
				setError(e.response?.data?.message || e.response?.data || e.message, 'gm-reset')
			} else {
				setError('Something went wrong!', 'gm-reset')
			}
		}
	}

	const startGame = async () => {
		try {
			await api.startRoom(roomContext?.room?.name || '')
			setNotification({ message: 'Game started successfully!', notificationType: 'success', source: 'gm-start' })
			navigate('..', { relative: 'path', replace: true })
			revalidate()
		} catch (e) {
			if (isAxiosError(e)) {
				setError(e.response?.data?.message || e.response?.data || e.message, 'gm-start')
			} else {
				setError('Something went wrong!', 'gm-start')
			}
		}
	}

	const getColor = (baseColor: string, source: NotificationSource) => {
		if (showNotification && notification?.source === source) {
			return notification?.notificationType
		}

		return baseColor
	}

	return (
		<>
			<SectionTitle>Actions</SectionTitle>
			<Action
				text="Reset game"
				description={
					isPlaying
						? 'Click the button to stop the game, remove everyone from the room and reset it.'
						: 'Click the button to remove everyone from the room and reset it.'
				}
			>
				<Button
					className={getColor('blue', 'gm-reset')}
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
					className={getColor('green', 'gm-start')}
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