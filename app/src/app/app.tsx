import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRotateLeft, faPlay, faUserPlus } from '@fortawesome/pro-solid-svg-icons'
import { faMagnifyingGlass, faUser, faUserSecret, faCrosshairs } from '@fortawesome/pro-regular-svg-icons'

import './app.css'
import { ConvertStatus } from './utils';
import { ErrorField } from './components/error'

// const BASE_URL = 'http://127.0.0.1:8787/'
const BASE_URL = `https://assassin.vlad.gg/`

interface GameStatus {
	status: string;
	players: string[];
}

interface AssassinRecord {
	name: string;
	target?: string;
}

function App() {
	const [gameStatus, setGameStatus] = useState<GameStatus | undefined>(undefined)
	const [playerInfo, setPlayerInfo] = useState<AssassinRecord | undefined>(undefined)
	const [name, setName] = useState<string>("")
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
		fetch(`${BASE_URL}reset`, { method: "POST" }).then(async (r) => {
			setStartGameStatus((await r.json()).message)
			fetchGameStatus()
		}).catch(() => {
			setResetGameStatus("Something went wrong!")
		})
	}

	const startGame = async () => {
		fetch(`${BASE_URL}start`, { method: "POST" }).then(async (r) => {
			setStartGameStatus((await r.json()).message)
			fetchGameStatus()
		}).catch(() => {
			setResetGameStatus("Something went wrong!")
		})
	}

	const addPlayer = async () => {
		fetch(`${BASE_URL}player/${name}`, { method: "PUT" }).then(async (r) => {
			setStartGameStatus((await r.json()).message)
			fetchGameStatus()
		}).catch(() => {
			setResetGameStatus("Something went wrong!")
		})
	}

	const getPlayer = async () => {
		// Reset data
		setPlayerInfo(undefined)

		fetch(`${BASE_URL}player/${name}`).then(async (r) => {
			const json = await r.json()
			if (json.message) {
				setGetPlayerStatus(json.message)
			} else {
				setPlayerInfo(json)
				setGetPlayerStatus("ok")
			}
		}).catch(() => {
			setGetPlayerStatus("Something went wrong!")
		})
	}

  useEffect(() => {
    fetchGameStatus()
  }, [])

  return (
		<div className="app">
			<h1>PokéAssassin</h1>
			<div className="assassin">
				<div className="menu">
						<div className="status">
							<span><span className={`label ${gameStatus?.status || "unknown"}`}>{ConvertStatus(gameStatus?.status || "unknown")}</span></span>
							<span>Players: {gameStatus?.players.length.toString() || "Unknown"}</span>
						</div>
					<div className="actions">
						<button className={resetGameStatus && resetGameStatus !== "ok" ? "failed" : undefined} onClick={() => resetGame()}>
							<FontAwesomeIcon icon={faArrowRotateLeft} size='xl' /> Reset
						</button>
						<button
							className={startGameStatus && startGameStatus !== "ok" ? "failed" : undefined}
							onClick={() => startGame()}
							disabled={gameStatus?.status !== "ready"}>
							<FontAwesomeIcon icon={faPlay} size='xl' /> Play
						</button>
					</div>
					<div className="player-actions">
						<input type="text" placeholder="First Name" className="name" id="name" value={name} onChange={(e) => { setName(e.target.value) }} />
						<div className="buttons">
							<button
								className={addPlayerStatus && addPlayerStatus !== "ok" ? "failed" : undefined}
								onClick={() => addPlayer()}
								disabled={gameStatus?.status === "started"}>
								<FontAwesomeIcon icon={faUserPlus} size='xl' /> Join
							</button>
							<button
								className={getPlayerStatus && getPlayerStatus !== "ok" ? "failed" : undefined}
								onClick={() => getPlayer()}
								disabled={gameStatus?.status !== "started"}>
								<FontAwesomeIcon icon={faMagnifyingGlass} size='xl' /> Lookup
							</button>
						</div>
					</div>
					<div className="player-list">
						<h3>Player List</h3>
						{gameStatus?.players.map((player) => {
							return (<div className="player" key={player}>
								<FontAwesomeIcon icon={faUser} /> {player}
							</div>)
						})}
					</div>
				</div>
				<div className="player-info">
					{ getPlayerStatus && getPlayerStatus != "ok" ?
						<ErrorField message={getPlayerStatus} /> :
						playerInfo ?
							<div className="info">
								<div className="target">
									<label htmlFor="target">Your target is...</label>
									<span id="target"><FontAwesomeIcon icon={faUserSecret} size="xl" /> {playerInfo.target}</span>
								</div>
								<div className="words">
									<label htmlFor="words">Your words are...</label>
									<span id="words"><FontAwesomeIcon icon={faCrosshairs} size="lg" />Check your card!</span>
								</div>
							</div> :
							<div className="no-selection">No player selected!</div> }
					{ startGameStatus && startGameStatus != "ok" ?
						<ErrorField message={startGameStatus} />:
						undefined }
					{ resetGameStatus && resetGameStatus != "ok" ?
						<ErrorField message={resetGameStatus} />:
						undefined }
					{ addPlayerStatus && addPlayerStatus != "ok" ?
						<ErrorField message={addPlayerStatus} />:
						undefined }
				</div>
			</div>
		</div>
  )
}

export default App
