import { faCheck, faChevronRight } from '@fortawesome/pro-solid-svg-icons'
import { isAxiosError } from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from 'use-local-storage'
import useSessionStorage from 'use-session-storage-state'
import { createRoomApi } from '../../api'
import { NotificationContext } from '../../hooks/notification'
import './welcome.css'
import Button from '../../components/button/button'

export default function Welcome() {
	const [name, setName] = useLocalStorage<string>('name', '')
	const [nameSubmitted, setNameSubmitted] = useState<boolean>(false)
	const [room, setRoom] = useSessionStorage<string>('room', { defaultValue: '' })
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const { notification, setError, showNotification, setShowNotification } = useContext(NotificationContext)
	const navigate = useNavigate()

	const roomApi = createRoomApi()

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
			return notification.notificationType || 'primary'
		}

		return 'primary'
	}

	return (
		<>
			<h1 className="title">Word Assassin.</h1>
			<div className="welcome">
				<AnimatePresence mode="popLayout">
					{!nameSubmitted ? (
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
								<Button type="submit" className={getButtonClass()} iconProps={{ icon: faChevronRight, size: 'xl' }} />
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
								<Button type="submit" className={getButtonClass()} iconProps={{ icon: faCheck, size: 'xl' }} />
							</form>
						</motion.div>
					) : undefined}
				</AnimatePresence>
			</div>
		</>
	)
}
