import { useContext, useEffect, useState } from 'react'
import { useNavigate, useRevalidator } from 'react-router-dom'
import { NotificationContext, NotificationSource } from '../../context/notification'
import { RoomContext } from '../../context/room'
import './room-settings.css'
import Header from '../../components/header/header'
import { faCrown, faPlay, faRotateLeft, faXmark } from '@fortawesome/pro-solid-svg-icons'
import Button from '../../components/button/button'
import Action from '../../components/action/action'
import WordLists from '../../components/wordlists/wordlists'
import { isAxiosError } from 'axios'
import { createGMApi } from '../../api'
import useLocalStorage from 'use-local-storage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessagePlus, faMessageMinus } from '@fortawesome/pro-solid-svg-icons'
import { Switch } from '@mui/material'

export default function RoomSettings() {
	const navigate = useNavigate()
	const { revalidate } = useRevalidator()

	const [name] = useLocalStorage('name', '')
	const gmApi = createGMApi(name)

	const { setError, setNotification, notification, showNotification } = useContext(NotificationContext)

	const roomContext = useContext(RoomContext)
	const roomStatus = roomContext?.room
	const [usesWords, setUsesWords] = useState<boolean>(roomStatus?.usesWords || false)
	const [numWords, setNumWords] = useState<number>(roomStatus?.numWords || 0)

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

	const updateWordLists = async (name: string) => {
		if (roomStatus?.status !== 'started') {
			try {
				if (roomStatus?.wordLists?.includes(name)) {
					await gmApi.patchRoom(roomStatus.name, {
						wordLists: roomStatus?.wordLists.filter((wl) => wl !== name),
					})
					setNotification({
						message: `Removed ${name} successfully!`,
						notificationType: 'success',
						source: 'wordlist',
						icon: faMessageMinus,
					})
				} else {
					await gmApi.patchRoom(roomStatus?.name || '', {
						wordLists: [...(roomStatus?.wordLists || []), name],
					})
					setNotification({
						message: `Added ${name} successfully!`,
						notificationType: 'success',
						source: 'wordlist',
						icon: faMessagePlus,
					})
				}

				revalidate()
			} catch (e) {
				if (isAxiosError(e)) {
					setError(e.response?.data || e.message, 'gm-reset')
				} else {
					setError('Something went wrong!', 'gm-reset')
				}
			}
		}
	}

	const updateUsesWords = async () => {
		if (roomStatus?.status !== 'started') {
			try {
				const newValue = !roomContext?.room?.usesWords
				await gmApi.patchRoom(roomContext?.room?.name || '', {
					usesWords: newValue,
				})
				setUsesWords(newValue)
				revalidate()
			} catch (e) {
				if (isAxiosError(e)) {
					setError(e.response?.data || e.message, 'wordlist')
				} else {
					setError('Something went wrong!', 'wordlist')
				}
			}
		}
	}

	const updateNumWords = async (newValue: number) => {
		if (roomStatus?.status !== 'started') {
			try {
				await gmApi.patchRoom(roomContext?.room?.name || '', {
					numWords: newValue,
				})
				setNumWords(newValue)
				revalidate()
			} catch (e) {
				if (isAxiosError(e)) {
					setError(e.response?.data || e.message, 'wordlist')
				} else {
					setError('Something went wrong!', 'wordlist')
				}
			}
		}
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
				className="blue corner-right with-icon"
				title="GM Settings"
				leftActions={<FontAwesomeIcon icon={faCrown} size="lg" />}
				rightActions={<Button iconProps={{ icon: faXmark }} className="blue" onClick={() => navigate(`/room/${roomStatus?.name}`)} />}
			/>
			<div className="gm-actions">
				<Action
					text="Reset game"
					description={
						isPlaying
							? 'Click the button to stop the game, remove everyone from the room and reset it.'
							: 'Click the button to remove everyone from the room and reset it.'
					}
				>
					<Button
						className={getColor('primary', 'gm-reset')}
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
				<div className="wordlists-wrapper">
					<h3>Word settings</h3>
					<Action text="Use words?" description="Whether to use words for this room, or play standard assassin.">
						<Switch
							disabled={isPlaying}
							checked={usesWords}
							onChange={() => updateUsesWords()}
							className={`toggle primary ${usesWords ? 'checked' : ''} ${isPlaying ? 'disabled' : ''}`}
						/>
					</Action>
					{roomStatus?.usesWords ? (
						<>
							<Action text="Number of words" description="Number of words to assign to each player on game start." className="num-words">
								<div className="input">
									<input
										type="number"
										name="numWords"
										max={10}
										min={1}
										value={numWords}
										onInput={(e) => updateNumWords(parseInt(e.currentTarget.value, 10))}
									/>
								</div>
							</Action>
							<Action text="Word lists" className="column">
								<WordLists onWordListClick={updateWordLists} />
							</Action>
						</>
					) : undefined}
				</div>
			</div>
		</div>
	)
}
