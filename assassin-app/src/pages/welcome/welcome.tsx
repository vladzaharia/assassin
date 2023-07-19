import { faCheck, faChevronRight } from '@fortawesome/pro-solid-svg-icons'
import { isAxiosError } from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useSessionStorage from 'use-session-storage-state'
import { createRoomApi } from '../../api'
import { NotificationContext } from '../../hooks/notification'
import './welcome.css'
import Button from '../../components/button/button'
import { NameContext } from '../../hooks/name'
import { CommonColor } from '../../types'
import useLocalStorage from 'use-local-storage'
import { useAuth } from 'react-oidc-context'

export default function Welcome() {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const { name, setName } = useContext(NameContext)!
	const [nameStorage, setNameStorage] = useLocalStorage('name', '')
	const [nameSubmitted, setNameSubmitted] = useState<boolean>(false)
	const [room, setRoom] = useSessionStorage<string>('room', { defaultValue: '' })
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const { notification, setError, showNotification, setShowNotification } = useContext(NotificationContext)
	const navigate = useNavigate()

	const roomApi = createRoomApi()
	const auth = useAuth()

	useEffect(() => {
		if (nameStorage) {
			setName(nameStorage)
		}
	})

	useEffect(() => {
		// Automatically pull in profile information
		if (auth.isAuthenticated) {
			setNameStorage(auth.user?.profile.given_name)
			setName(auth.user?.profile.given_name)
			setNameSubmitted(true)
		} else {
			setNameSubmitted(false)
		}
	}, [auth.isAuthenticated])

	const fetchRoom = async () => {
		if (!room || room === '') {
			return setError('Enter a room to continue!', 'room')
		}

		const normalizedRoom = room.toLowerCase()

		const roomResponse = await roomApi.getRoom(normalizedRoom).catch((e) => {
			if (isAxiosError(e)) {
				if (e.response?.status === 404) {
					setError('Room not found!', 'room')
				} else {
					setError('Something went wrong!', 'room')
				}
			}
		})

		if (roomResponse?.status === 200) {
			setShowNotification(false)
			return navigate(`/room/${normalizedRoom}`)
		}
	}

	const getButtonClass = () => {
		if (notification && showNotification) {
			return (notification.notificationType as CommonColor) || 'primary'
		}

		return 'primary'
	}

	return (
		<>
			<h1 className="title">Word Assassin.</h1>
			<div className="welcome">
				<AnimatePresence mode="popLayout">
					{!nameSubmitted && !auth.isAuthenticated ? (
						<motion.div
							className="no-animate"
							key="user"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
						>
							<label htmlFor="user">
								<h2>What name do you go by?</h2>
							</label>
							<form
								onSubmit={(e) => {
									if (name !== '') {
										e.preventDefault()
										setNameStorage(name)
										setNameSubmitted(true)
									}
								}}
								className={`user-form`}
							>
								<input
									type="text"
									id="user"
									placeholder="First name"
									value={name}
									onChange={(e) => {
										setName(e.target.value)
									}}
								/>
								<Button type="submit" color={getButtonClass()} iconProps={{ icon: faChevronRight, size: 'xl' }} />
							</form>
						</motion.div>
					) : undefined}
					{nameSubmitted ? (
						<motion.div
							className="no-animate"
							key="room"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5, duration: 0.5 }}
						>
							<label htmlFor="room">
								<h2>What room are you in?</h2>
							</label>
							<form
								onSubmit={(e) => {
									e.preventDefault()
									fetchRoom()
								}}
								className={`room-form`}
							>
								<input
									type="text"
									id="room"
									placeholder="Room code"
									value={room}
									onChange={(e) => {
										setShowNotification(false)
										setRoom(e.target.value)
									}}
								/>
								<Button type="submit" color={getButtonClass()} iconProps={{ icon: faCheck, size: 'xl' }} />
							</form>
						</motion.div>
					) : undefined}
				</AnimatePresence>
			</div>
		</>
	)
}
