import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrosshairs, faMagnifyingGlass, faUser, faUserPlus } from '@fortawesome/pro-solid-svg-icons'
import { faUserSecret } from '@fortawesome/pro-regular-svg-icons'

import './room.css'
import { ErrorField } from '../../components/error/error'
import { GameStatusContext } from '../../components/game-status/game-status'
import Instructions from '../../components/instructions/instructions'
import Menu from '../../components/menu/menu'

import { Room as RoomResponse, RoomApi, PlayerApi, Player as PlayerResponse } from 'assassin-server-client'

function Room() {
	const [gameStatus, setGameStatus] = useState<RoomResponse | undefined>(undefined)

	const [playerInfo, setPlayerInfo] = useState<PlayerResponse | undefined>(undefined)
	const [name, setName] = useState<string>('')
	const [addPlayerStatus, setAddPlayerStatus] = useState<string | undefined>(undefined)
	const [getPlayerStatus, setGetPlayerStatus] = useState<string | undefined>(undefined)
	const navigate = useNavigate()

	const roomApi = new RoomApi()
	const playerApi = new PlayerApi()

	const { room } = useParams()

	const fetchGameStatus = async () => {
		// Reset data
		setPlayerInfo(undefined)
		setGameStatus(undefined)

		const status = (await roomApi.roomRoomGet(room || '')).data
		setGameStatus(status)
	}

	const addPlayer = async () => {
		try {
			const addPlayerResponse = await playerApi.roomRoomPlayerNamePut(room || '', name)
			setAddPlayerStatus(addPlayerResponse.data.message)
		} catch {
			setAddPlayerStatus('Something went wrong!')
		}
	}

	const getPlayer = async () => {
		// Reset data
		setPlayerInfo(undefined)

		const getPlayerResponse = await playerApi.roomRoomPlayerNameGet(room || '', name)

		if (getPlayerResponse.status === 404) {
			return setGetPlayerStatus('Player not found!')
		}

		const json = getPlayerResponse.data
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const jsonAsAny = json as any

		if (jsonAsAny.message) {
			setGetPlayerStatus(jsonAsAny.message)
		} else {
			setPlayerInfo(json)
			setGetPlayerStatus('ok')
		}
	}

	useEffect(() => {
		fetchGameStatus()
	}, [])

	const params = new URL(document.location.toString()).searchParams
	const isAdmin = params.get('admin') === 'true'

	return (
		<GameStatusContext.Provider value={gameStatus}>
			<Menu
				header={{
					title: room,
					onClick: () => navigate('/'),
					status: true,
				}}
			>
				<div className="player-actions">
					<input
						type="text"
						placeholder="First Name"
						className="name"
						id="name"
						value={name}
						onChange={(e) => {
							setName(e.target.value)
						}}
					/>
					<div className="buttons">
						<button
							className={addPlayerStatus && addPlayerStatus !== 'ok' ? 'failed' : undefined}
							onClick={() => addPlayer()}
							disabled={gameStatus?.status === 'started'}
						>
							<FontAwesomeIcon icon={faUserPlus} size="xl" /> Join
						</button>
						<button
							className={getPlayerStatus && getPlayerStatus !== 'ok' ? 'failed' : undefined}
							onClick={() => getPlayer()}
							disabled={gameStatus?.status !== 'started'}
						>
							<FontAwesomeIcon icon={faMagnifyingGlass} size="xl" /> Lookup
						</button>
					</div>
				</div>
				<div className="player-list">
					<h3>Player List ({gameStatus?.players.length || 0})</h3>
					{gameStatus?.players.map((player) => {
						return (
							<div className="player" key={player}>
								<FontAwesomeIcon icon={faUser} /> {player}
							</div>
						)
					})}
				</div>
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
				{getPlayerStatus && getPlayerStatus !== 'ok' ? <ErrorField className="bottom" message={getPlayerStatus} /> : undefined}
				{addPlayerStatus && addPlayerStatus !== 'ok' ? <ErrorField className="bottom" message={addPlayerStatus} /> : undefined}
			</div>
		</GameStatusContext.Provider>
	)
}

export default Room
