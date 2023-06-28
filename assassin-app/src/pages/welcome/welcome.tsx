import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/pro-solid-svg-icons'

import { API_URL } from 'assassin-common'

import ContentBox from '../../components/content-box/content-box'
import { ErrorField } from '../../components/error/error'

import './welcome.css'

function Welcome() {
	const [ room, setRoom ] = useState<string>("")
	const [ statusCode, setStatusCode ] = useState<number|undefined>(undefined)
	const navigate = useNavigate()

	const fetchRoom = async () => {
		const roomUrl = `${API_URL}/room/${room}`

		const roomStatus = await fetch(`${roomUrl}`)

		if (roomStatus.status === 200) {
			navigate(`/${room}`)
		}

		setStatusCode(roomStatus.status)
	}

	return (
		<ContentBox>
			<div className="welcome">
				<label htmlFor="room"><h2>Enter a room code to continue</h2></label>
				<div className="room-form">
					<input
						type="text"
						id="room"
						placeholder="Room code"
						value={room}
						onChange={(e) => {
							setStatusCode(undefined)
							setRoom(e.target.value)
						}}
					/>
					<button className={statusCode && statusCode !== 200 ? 'failed' : undefined} onClick={() => fetchRoom()}>
						<FontAwesomeIcon icon={faCheck} size='xl' />
					</button>
				</div>
				{ statusCode === 404 ?
					<ErrorField message={`Could not find room!`} /> :
					undefined}
			</div>
		</ContentBox>
	)
}

export default Welcome
