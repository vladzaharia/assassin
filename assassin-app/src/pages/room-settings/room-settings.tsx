import { useContext, useEffect } from 'react'
import { useNavigate, useRevalidator } from 'react-router-dom'
import { NotificationContext, NotificationSource } from '../../context/notification'
import { RoomContext } from '../../context/room'
import './room-settings.css'
import Header from '../../components/header/header'
import { faPlay, faRotateLeft, faXmark } from '@fortawesome/pro-solid-svg-icons'
import Button from '../../components/button/button'
import GMAction from 'assassin-app/src/components/gm-action/gm-action'
import WordLists from 'assassin-app/src/components/wordlists/wordlists'
import { isAxiosError } from 'axios'
import { createGMApi } from 'assassin-app/src/api'
import useLocalStorage from 'use-local-storage'

export default function RoomSettings() {
	const navigate = useNavigate()
	const { revalidate } = useRevalidator()

	const [name] = useLocalStorage('name', '')
	const gmApi = createGMApi(name)

	const { setError, setNotification, notification, showNotification } = useContext(NotificationContext)

	const roomContext = useContext(RoomContext)
	const roomStatus = roomContext?.room

	const isPlaying = roomStatus?.status === 'started'

	const resetGame = async () => {
		try {
			await gmApi.resetRoom(roomContext?.room?.name || '')
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
			await gmApi.startRoom(roomContext?.room?.name || '')
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
				title="Room settings"
				rightActions={
					<Button iconProps={{ icon: faXmark }} className="primary" onClick={() => navigate(`/room/${roomStatus?.name}`)} />
				}
			/>
			<div className="gm-actions">
				<GMAction
					text="Reset game"
					description={
						isPlaying
							? 'Click here to stop the game, remove everyone from the room and reset it.'
							: 'Click here to remove everyone from the room and reset it.'
					}
				>
					<Button
						className={getColor('blue', 'gm-reset')}
						iconProps={{
							icon: faRotateLeft,
						}}
						onClick={() => resetGame()}
					/>
				</GMAction>
				<GMAction
					text="Start game"
					description={
						isPlaying
							? "The game has started; you'll need to wait to start the game."
							: roomStatus?.status === 'not-ready'
							? "There's not enough players in the room to start the game."
							: "There's enough players to start the game! Click here to assign targets and words to players."
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
				</GMAction>
				<WordLists />
			</div>
		</div>
	)
}
