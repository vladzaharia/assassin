import { faCheck, faChevronRight } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AxiosError, isAxiosError } from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from 'use-local-storage'
import useSessionStorage from 'use-session-storage-state'
import { createRoomApi } from '../../api'
import { ErrorField } from '../../components/error/error'
import './welcome.css'

export default function Welcome() {
	const [name, setName] = useLocalStorage<string>('name', '')
	const [nameSubmitted, setNameSubmitted] = useState<boolean>(false)
	const [room, setRoom] = useSessionStorage<string>('room', { defaultValue: '' })
	const [status, setStatus] = useState<string | undefined>(undefined)
	const navigate = useNavigate()

	const roomApi = createRoomApi()

	const fetchRoom = async () => {
		if (!room || room === '') {
			return setStatus('Enter a room to continue!')
		}

		const roomResponse = await roomApi.getRoom(room).catch((e: Error | AxiosError) => {
			if (isAxiosError(e)) {
				if (e.response?.status === 404) {
					setStatus('Room not found!')
				} else {
					setStatus('Something went wrong!')
				}
			}
		})

		if (roomResponse?.status === 200) {
			setStatus('ok')
			return navigate(`/room/${room}`)
		}
	}

	const getButtonClass = () => {
		if (status) {
			return status === 'ok' ? 'green' : 'failed'
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
								<button type="submit" className={getButtonClass()}>
									<FontAwesomeIcon icon={faChevronRight} size="xl" />
								</button>
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
										setStatus(undefined)
										setRoom(e.target.value)
									}}
								/>
								<button type="submit" className={getButtonClass()}>
									<FontAwesomeIcon icon={faCheck} size="xl" />
								</button>
							</form>
						</motion.div>
					) : undefined}
				</AnimatePresence>
				{status && status !== 'ok' ? <ErrorField className="bottom" message={status} /> : undefined}
			</div>
		</>
	)
}
