import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/pro-solid-svg-icons'

import { API_URL } from 'assassin-common'

import ContentBox from '../../components/content-box/content-box'
import { ErrorField } from '../../components/error/error'

import './welcome.css'

function Welcome() {
	const [room, setRoom] = useState<string>('')
	const [status, setStatus] = useState<string | undefined>(undefined)
	const navigate = useNavigate()

	const fetchRoom = async () => {
		if (!room || room === '') {
			return setStatus('Enter a room to continue!')
		}

		const roomUrl = `${API_URL}/room/${room}`

		const roomStatus = await fetch(`${roomUrl}`)

		if (roomStatus.status === 200) {
			setStatus('ok')
			return navigate(`/room/${room}`)
		} else if (roomStatus.status === 404) {
			return setStatus('Could not find room!')
		}

		setStatus('Something went wrong!')
	}

	const getButtonClass = () => {
		if (status) {
			return status === 'ok' ? 'success' : 'failed'
		}

		return 'secondary'
	}

	return (
		<>
			<h1 className="title">Word Assassin</h1>
			<div className="welcome">
				<label htmlFor="room">
					<h2>Enter a room code to continue</h2>
				</label>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						fetchRoom()
					}}
					className="room-form"
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
				{status && status !== 'ok' ? <ErrorField className="bottom" message={status} /> : undefined}
			</div>
		</>
	)
}

export default Welcome
