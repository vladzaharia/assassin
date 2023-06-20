import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faArrowRotateLeft,
	faCrosshairs,
	faHourglass,
	faMagnifyingGlass,
	faPlay,
	faUser,
	faUserPlus,
} from '@fortawesome/pro-solid-svg-icons'
import { faUserSecret, faCardsBlank } from '@fortawesome/pro-regular-svg-icons'

import './app.css'
import { ConvertStatus } from './utils'
import { ErrorField } from './components/error'

// const BASE_URL = 'http://127.0.0.1:8787/api/'
const BASE_URL = `https://assassin.vlad.gg/api/`

interface GameStatus {
	status: string
	players: string[]
}

interface AssassinRecord {
	name: string
	target?: string
}

function App() {
	const [gameStatus, setGameStatus] = useState<GameStatus | undefined>(undefined)
	const [playerInfo, setPlayerInfo] = useState<AssassinRecord | undefined>(undefined)
	const [name, setName] = useState<string>('')
	const [resetGameStatus, setResetGameStatus] = useState<string | undefined>(undefined)
	const [startGameStatus, setStartGameStatus] = useState<string | undefined>(undefined)
	const [addPlayerStatus, setAddPlayerStatus] = useState<string | undefined>(undefined)
	const [getPlayerStatus, setGetPlayerStatus] = useState<string | undefined>(undefined)

	const fetchGameStatus = async () => {
		// Reset data
		setPlayerInfo(undefined)
		setGameStatus(undefined)

		const status = await fetch(BASE_URL).then((r) => r.json())
		setGameStatus(status)
	}

	const resetGame = async () => {
		fetch(`${BASE_URL}reset`, { method: 'POST' })
			.then(async (r) => {
				setStartGameStatus((await r.json()).message)
				fetchGameStatus()
			})
			.catch(() => {
				setResetGameStatus('Something went wrong!')
			})
	}

	const startGame = async () => {
		fetch(`${BASE_URL}start`, { method: 'POST' })
			.then(async (r) => {
				setStartGameStatus((await r.json()).message)
				fetchGameStatus()
			})
			.catch(() => {
				setStartGameStatus('Something went wrong!')
			})
	}

	const addPlayer = async () => {
		fetch(`${BASE_URL}player/${name}`, { method: 'PUT' })
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

		fetch(`${BASE_URL}player/${name}`)
			.then(async (r) => {
				const json = await r.json()
				if (json.message) {
					setGetPlayerStatus(json.message)
				} else {
					setPlayerInfo(json)
					setGetPlayerStatus('ok')
				}
			})
			.catch(() => {
				setGetPlayerStatus('Something went wrong!')
			})
	}

	useEffect(() => {
		fetchGameStatus()
	}, [])

	const params = new URL(document.location.toString()).searchParams
	const isAdmin = params.get('admin') === 'true'

	return (
		<div className="app">
			<h1>Workday Assassin</h1>
			<div className="assassin">
				<div className="menu">
					<div className="status">
						<span className={`label ${gameStatus?.status || 'unknown'}`}>{ConvertStatus(gameStatus?.status || 'unknown')}</span>
					</div>
					{isAdmin ? (
						<div className="admin-actions">
							<button
								className={resetGameStatus && resetGameStatus !== 'ok' ? 'secondary failed' : 'secondary'}
								onClick={() => resetGame()}
							>
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
				</div>
				<div className="player-info">
					{getPlayerStatus && getPlayerStatus != 'ok' ? (
						<ErrorField message={getPlayerStatus} />
					) : playerInfo ? (
						<div className="info">
							<div className="target">
								<label htmlFor="target">Your target is...</label>
								<span id="target">
									<FontAwesomeIcon icon={faUserSecret} size="xl" /> {playerInfo.target}
								</span>
							</div>
							<div className="words">
								<label htmlFor="words">Your words are...</label>
								<span id="words">
									<FontAwesomeIcon icon={faCrosshairs} size="lg" />
									Check your card(s)!
								</span>
							</div>
						</div>
					) : (
						<div className="no-selection">
							<h2>How to Play</h2>
							<div className="step">
								<div className="icon">
									<FontAwesomeIcon icon={faUserPlus} size="2x" />
								</div>
								<div className="explanation">
									<h3>Join the game</h3>
									Enter your first name and click "Join" to add your name to the list.
								</div>
							</div>
							<div className="step">
								<div className="icon">
									<FontAwesomeIcon icon={faHourglass} size="2x" />
								</div>
								<div className="explanation">
									<h3>Wait for the game to start...</h3>
									Enter your first name and click "Join" to add your name to the list.
								</div>
							</div>
							<div className="step">
								<div className="icon">
									<FontAwesomeIcon icon={faMagnifyingGlass} size="2x" />
								</div>
								<div className="explanation">
									<h3>Lookup your target</h3>
									Enter your first name and click "Lookup" to find who your target is.
								</div>
							</div>
							<div className="step">
								<div className="icon">
									<FontAwesomeIcon icon={faCrosshairs} size="2x" />
								</div>
								<div className="explanation">
									<h3>Eliminate your target!</h3>
									Try to get your target to say one of your words through the day.
								</div>
							</div>
							<div className="step">
								<div className="icon">
									<FontAwesomeIcon icon={faCardsBlank} size="2x" />
								</div>
								<div className="explanation">
									<h3>Take your target's card</h3>
									Take your target's card and try to eliminate their target! <br />
									You can use any words on any cards you have.
								</div>
							</div>
						</div>
					)}
					{startGameStatus && startGameStatus != 'ok' ? <ErrorField message={startGameStatus} /> : undefined}
					{resetGameStatus && resetGameStatus != 'ok' ? <ErrorField message={resetGameStatus} /> : undefined}
					{addPlayerStatus && addPlayerStatus != 'ok' ? <ErrorField message={addPlayerStatus} /> : undefined}
				</div>
			</div>
		</div>
	)
}

export default App
