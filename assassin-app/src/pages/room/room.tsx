import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faArrowRotateLeft,
	faChevronLeft,
	faCrosshairs,
	faHourglass,
	faMagnifyingGlass,
	faPlay,
	faUser,
	faUserPlus,
} from '@fortawesome/pro-solid-svg-icons'
import { faUserSecret, faCardsBlank } from '@fortawesome/pro-regular-svg-icons'
import { API_URL } from 'assassin-common'

import './room.css'
import { ErrorField } from '../../components/error/error'
import { useNavigate, useParams } from 'react-router-dom'
import ContentBox from '../../components/content-box/content-box'
import Menu from '../../components/menu/menu'

interface GameStatus {
	status: string
	players: string[]
}

interface PlayerRecord {
	name: string
	target?: string
}

function ConvertStatus(status: string): string {
	switch (status) {
		case 'started':
			return 'Started!'
		case 'ready':
			return 'Ready to Start'
		case 'not-ready':
			return 'Not Ready'
		default:
			return 'Unknown'
	}
}

function Room() {
	const [gameStatus, setGameStatus] = useState<GameStatus | undefined>(undefined)
	const [playerInfo, setPlayerInfo] = useState<PlayerRecord | undefined>(undefined)
	const [name, setName] = useState<string>('')
	const [resetGameStatus, setResetGameStatus] = useState<string | undefined>(undefined)
	const [startGameStatus, setStartGameStatus] = useState<string | undefined>(undefined)
	const [addPlayerStatus, setAddPlayerStatus] = useState<string | undefined>(undefined)
	const [getPlayerStatus, setGetPlayerStatus] = useState<string | undefined>(undefined)
	const navigate = useNavigate()

	const { room } = useParams()
	const baseUrl = `${API_URL}/room/${room}`

	const fetchGameStatus = async () => {
		// Reset data
		setPlayerInfo(undefined)
		setGameStatus(undefined)

		const status = await fetch(`${baseUrl}`).then((r) => r.json())
		setGameStatus(status)
	}

	const resetGame = async () => {
		fetch(`${baseUrl}/reset`, { method: 'POST' })
			.then(async (r) => {
				setStartGameStatus((await r.json()).message)
				fetchGameStatus()
			})
			.catch(() => {
				setResetGameStatus('Something went wrong!')
			})
	}

	const startGame = async () => {
		fetch(`${baseUrl}/start`, { method: 'POST' })
			.then(async (r) => {
				setStartGameStatus((await r.json()).message)
				fetchGameStatus()
			})
			.catch(() => {
				setStartGameStatus('Something went wrong!')
			})
	}

	const addPlayer = async () => {
		fetch(`${baseUrl}/player/${name}`, { method: 'PUT' })
			.then(async (r) => {
				setAddPlayerStatus((await r.json()).message)
				fetchGameStatus()
			})
			.catch(() => {
				setAddPlayerStatus('Something went wrong!')
			})
	}

	const getPlayer = async () => {
		// Reset data
		setPlayerInfo(undefined)

		const r = await fetch(`${baseUrl}/player/${name}`)
		if (r.status === 404) {
			return setGetPlayerStatus("Player not found!")
		}

		const json = await r.json()
		if (json.message) {
			setGetPlayerStatus(json.message)
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
		<ContentBox>
			<Menu
				header={{
					title: room,
					onClick: () => navigate("/")
				}}>
				<div className="status">
					<span className={`label ${gameStatus?.status || 'unknown'}`}>{ConvertStatus(gameStatus?.status || 'unknown')}</span>
				</div>
				{isAdmin ? (
					<div className="admin-actions">
						<button className={resetGameStatus && resetGameStatus !== 'ok' ? 'secondary failed' : 'secondary'} onClick={() => resetGame()}>
							<FontAwesomeIcon icon={faArrowRotateLeft} size="xl" /> Reset
						</button>
						<button
							className={startGameStatus && startGameStatus !== 'ok' ? 'failed' : undefined}
							onClick={() => startGame()}
							disabled={gameStatus?.status !== 'ready'}
						>
							<FontAwesomeIcon icon={faPlay} size="xl" /> Start
						</button>
					</div>
				) : (
					false
				)}
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
					<div className="no-selection">
						<h2 className="title">How to Play</h2>
						<div className="step">
							<div className="icon">
								<FontAwesomeIcon icon={faUserPlus} color="var(--blue)" size="2x" />
							</div>
							<div className="explanation">
								<h3>Join the game</h3>
								Enter your first name and click "Join" to add your name to the list.
							</div>
						</div>
						<div className="step">
							<div className="icon">
								<FontAwesomeIcon icon={faHourglass} color="var(--orange)" size="2x" />
							</div>
							<div className="explanation">
								<h3>Wait for the game to start...</h3>
								Once enough players join, the game can start. Until then, study your first card and the words on it.
							</div>
						</div>
						<div className="step">
							<div className="icon">
								<FontAwesomeIcon icon={faMagnifyingGlass} color="var(--green)" size="2x" />
							</div>
							<div className="explanation">
								<h3>Lookup your target</h3>
								Enter your first name and click "Lookup" to find who your target is.
							</div>
						</div>
						<div className="step">
							<div className="icon">
								<FontAwesomeIcon icon={faCrosshairs} color="var(--primary)" size="2x" />
							</div>
							<div className="explanation">
								<h3>Eliminate your target!</h3>
								Try to get your target to say one of your words through the day.
							</div>
						</div>
						<div className="step">
							<div className="icon">
								<FontAwesomeIcon icon={faCardsBlank} color="var(--green)" size="2x" />
							</div>
							<div className="explanation">
								<h3>Take your target's card</h3>
								Take your target's card and try to eliminate their target! <br />
								<strong>You can use any unused words on any cards you have.</strong>
							</div>
						</div>
					</div>
				)}
				{getPlayerStatus && getPlayerStatus !== 'ok' ? <ErrorField className='bottom' message={getPlayerStatus} /> : undefined}
				{startGameStatus && startGameStatus !== 'ok' ? <ErrorField className='bottom' message={startGameStatus} /> : undefined}
				{resetGameStatus && resetGameStatus !== 'ok' ? <ErrorField className='bottom' message={resetGameStatus} /> : undefined}
				{addPlayerStatus && addPlayerStatus !== 'ok' ? <ErrorField className='bottom' message={addPlayerStatus} /> : undefined}
			</div>
		</ContentBox>
	)
}

export default Room
