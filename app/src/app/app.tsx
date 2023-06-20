import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRotateLeft, faPlay, faPlus } from '@fortawesome/pro-solid-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons'

import './app.css'
import { ConvertStatus } from './utils';
import { ErrorField } from './components/error'

const BASE_URL = 'http://127.0.0.1:8787/'
// const BASE_URL = `https://assassin.vlad.gg/`

interface GameStatus {
	status: string;
	players: number;
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
		setPlayerInfo(undefined)

		fetch(`${BASE_URL}player/${name}`).then(async (r) => {
			setPlayerInfo(await r.json())
			setGetPlayerStatus("ok")
		}).catch(() => {
			setGetPlayerStatus("Something went wrong!")
		})
	}

  useEffect(() => {
    fetchGameStatus()
  }, [])

  return (
		<div className="app">
			<h1>Assassin Matcher</h1>
			<div className="assassin">
				<div className="menu">
					{gameStatus &&
						<div className="status">
							<span><span className={`label ${gameStatus.status}`}>{ConvertStatus(gameStatus.status)}</span></span>
							<span>Players: {gameStatus.players}</span>
						</div>}
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
					<div className="player">
						<input type="text" placeholder="First Name" className="name" id="name" value={name} onChange={(e) => { setName(e.target.value) }} />
						<div className="buttons">
							<button
								className={addPlayerStatus && addPlayerStatus !== "ok" ? "failed" : undefined}
								onClick={() => addPlayer()}
								disabled={gameStatus?.status === "started"}>
								<FontAwesomeIcon icon={faPlus} size='xl' /> Add Player
							</button>
							<button
								className={getPlayerStatus && getPlayerStatus !== "ok" ? "failed" : undefined}
								onClick={() => getPlayer()}
								disabled={gameStatus?.status !== "started"}>
								<FontAwesomeIcon icon={faMagnifyingGlass} size='xl' /> Get Target
							</button>
						</div>
					</div>
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
				<div className="player-info">
					{ getPlayerStatus && getPlayerStatus != "ok" ?
						<ErrorField message={getPlayerStatus} /> :
						playerInfo ?
							<div className="target">
								<span>Your target is...</span>
								<h1>{playerInfo.target}</h1>
							</div> :
							<span>No player selected!</span> }
				</div>
			</div>
		</div>
  )
}

export default App
