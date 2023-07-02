import { faUserSecret } from '@fortawesome/pro-regular-svg-icons'
import { faCrosshairs } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Player as PlayerResponse, Room as RoomResponse } from 'assassin-server-client'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useLocalStorage from 'use-local-storage'
import useSessionStorage from 'use-session-storage-state'
import { createPlayerApi, createRoomApi } from '../../api'
import { ErrorField } from '../../components/error/error'
import Instructions from '../../components/instructions/instructions'
import Menu from '../../components/menu/menu'
import PlayerActions from '../../components/player-actions/player-actions'
import PlayerList from '../../components/player-list/player-list'
import { RoomStatusContext } from '../../components/room-status/room-status'
import './room.css'

export default function Room() {
	const [roomStatus, setRoomStatus] = useState<RoomResponse | undefined>(undefined)
	const [playerInfo, setPlayerInfo] = useState<PlayerResponse | undefined>(undefined)
	const [requestError, setRequestError] = useState<string | undefined>(undefined)
	const [name] = useLocalStorage<string>('name', '')
	const roomSession = useSessionStorage<string>('room', { defaultValue: '' })
	const navigate = useNavigate()

	const roomApi = createRoomApi()
	const playerApi = createPlayerApi()

	const { room } = useParams()

	const getRoom = async () => {
		// Reset data
		setPlayerInfo(undefined)
		setRoomStatus(undefined)

		const status = (await roomApi.getRoom(room || '')).data
		setRoomStatus(status)
	}

	const getPlayer = async () => {
		// Reset data
		setPlayerInfo(undefined)

		const getPlayerResponse = await playerApi.getPlayer(room || '', name)

		if (getPlayerResponse.status === 404) {
			return setRequestError('Player not found!')
		}

		const json = getPlayerResponse.data
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const jsonAsAny = json as any

		if (jsonAsAny.message) {
			setRequestError(jsonAsAny.message)
		} else {
			setPlayerInfo(json)
			setRequestError('ok')
		}
	}

	const addPlayer = async () => {
		try {
			const addPlayerResponse = await playerApi.putPlayer(room || '', name)
			setRequestError(addPlayerResponse.data.message)
			getRoom()
		} catch (e) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const eAsAny = e as any
			setRequestError(eAsAny.response?.data.message || eAsAny.response?.data || 'Something went wrong!')
		}
	}

	const deletePlayer = async () => {
		try {
			const deletePlayerResponse = await playerApi.deletePlayer(room || '', name)
			setRequestError(deletePlayerResponse.data.message)
			getRoom()
		} catch (e) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const eAsAny = e as any
			setRequestError(eAsAny.response?.data.message || eAsAny.response?.data || 'Something went wrong!')
		}
	}

	useEffect(() => {
		// Set room name in session storage
		if (room) {
			roomSession[1](room)
		}

		if (name) {
			getRoom()
		} else {
			navigate('/')
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name])

	return (
		<RoomStatusContext.Provider
			value={{
				room: roomStatus,
				lookup: getPlayer,
				join: addPlayer,
				leave: deletePlayer,
			}}
		>
			<Menu
				headerProps={{
					title: room,
					onClick: () => navigate('/'),
					status: true,
				}}
			>
				<PlayerActions requestError={requestError} />
				<PlayerList
					clickGM={() => {
						return
					}}
				/>
			</Menu>
			<div className="player-info">
				{playerInfo ? (
					<div className="info">
						<div className="target">
							<label htmlFor="target">Your target is...</label>
							<span id="target">
								<FontAwesomeIcon icon={faUserSecret} color="#f26671" size="xl" /> {playerInfo.target}
							</span>
						</div>
						<div className="words">
							<label htmlFor="words">Your words are...</label>
							<span id="words">
								<FontAwesomeIcon icon={faCrosshairs} color="#f26671" size="lg" />
								Check your card(s)!
							</span>
						</div>
					</div>
				) : (
					<Instructions />
				)}
				{requestError && requestError !== 'ok' ? <ErrorField className="bottom" message={requestError} /> : undefined}
			</div>
		</RoomStatusContext.Provider>
	)
}
