import { faPlay, faRotateLeft } from '@fortawesome/pro-solid-svg-icons'
import { ReactNode, useContext, useState } from 'react'
import useLocalStorage from 'use-local-storage'
import { RoomContext } from '../../context/room'
import Button from '../button/button'
import './gm-actions.css'
import { createGMApi } from '../../api'
import { useNavigate, useRevalidator } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { NotificationContext, NotificationSource } from '../../context/notification'
import WordLists from '../wordlists/wordlists'
import { Switch } from '@mui/material'

interface GMActionProps {
	text: string
	description?: string
	className?: string
	children: ReactNode
}

function GMAction({ text, description, className, children }: GMActionProps) {
	return (
		<div className={`action ${className}`}>
			<div className="text">
				<span className="title">{text}</span>
				<span className="description">{description}</span>
			</div>
			{children}
		</div>
	)
}

export default function GMActions() {
	const navigate = useNavigate()
	const { revalidate } = useRevalidator()

	const [name] = useLocalStorage('name', '')
	const gmApi = createGMApi(name)

	const notificationContext = useContext(NotificationContext)

	const roomContext = useContext(RoomContext)
	const roomStatus = roomContext?.room
	const isPlaying = roomStatus?.status === 'started'
	const [usesWords, setUsesWords] = useState<boolean>(roomStatus?.usesWords || false)

	const resetGame = async () => {
		try {
			await gmApi.resetRoom(roomContext?.room?.name || '')
			notificationContext.setNotification({ message: 'Room reset successfully!', notificationType: 'success', source: 'gm-reset' })
			navigate('..', { relative: 'path', replace: true })
			revalidate()
		} catch (e) {
			if (isAxiosError(e)) {
				notificationContext.setError(e.response?.data?.message || e.response?.data || e.message, 'gm-reset')
			} else {
				notificationContext.setError('Something went wrong!', 'gm-reset')
			}
		}
	}

	const startGame = async () => {
		try {
			await gmApi.startRoom(roomContext?.room?.name || '')
			notificationContext.setNotification({ message: 'Game started successfully!', notificationType: 'success', source: 'gm-start' })
			navigate('..', { relative: 'path', replace: true })
			revalidate()
		} catch (e) {
			if (isAxiosError(e)) {
				notificationContext.setError(e.response?.data?.message || e.response?.data || e.message, 'gm-start')
			} else {
				notificationContext.setError('Something went wrong!', 'gm-start')
			}
		}
	}

	const updateUsesWords = async () => {
		try {
			const newValue = !roomContext?.room?.usesWords
			await gmApi.patchRoom(roomContext?.room?.name || '', {
				usesWords: newValue,
			})
			setUsesWords(newValue)
			revalidate()
		} catch (e) {
			if (isAxiosError(e)) {
				notificationContext.setError(e.response?.data || e.message, 'wordlist')
			} else {
				notificationContext.setError('Something went wrong!', 'wordlist')
			}
		}
	}

	const getColor = (baseColor: string, source: NotificationSource) => {
		if (notificationContext.showNotification && notificationContext.notification?.source === source) {
			return notificationContext.notification?.notificationType
		}

		return baseColor
	}

	return (
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
			<div className="action-wrapper">
				<h3>Wordlist settings</h3>
				<GMAction text="Use wordlists?" description="Whether to use wordlists for this room, or play standard assassin.">
					<Switch
						disabled={isPlaying}
						checked={usesWords}
						onChange={() => updateUsesWords()}
						className={`toggle primary ${usesWords ? 'checked' : ''} ${isPlaying ? 'disabled' : ''}`}
					/>
				</GMAction>
				{roomStatus?.usesWords ? (
					<GMAction text="Wordlists" className="wordlists">
						<WordLists />
					</GMAction>
				) : undefined}
			</div>
		</div>
	)
}
