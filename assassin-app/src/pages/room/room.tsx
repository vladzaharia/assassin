import { Room as RoomResponse } from 'assassin-server-client'
import { useEffect } from 'react'
import { Outlet, useLoaderData, useNavigate, useParams } from 'react-router-dom'
import useLocalStorage from 'use-local-storage'
import useSessionStorage from 'use-session-storage-state'
import Menu from '../../components/menu/menu'
import PlayerActions from '../../components/player-actions/player-actions'
import PlayerList from '../../components/player-list/player-list'
import { RoomContext } from '../../context/room'
import './room.css'

export default function Room() {
	// const errorContext = useContext(ErrorContext)
	const roomStatus = useLoaderData() as RoomResponse
	// const [playerInfo, setPlayerInfo] = useState<PlayerResponse | undefined>(undefined)
	const [name] = useLocalStorage<string>('name', '')
	const roomSession = useSessionStorage<string>('room', { defaultValue: '' })
	const navigate = useNavigate()

	// const playerApi = createPlayerApi()

	const { room } = useParams()

	const getRoom = async () => {
		// Force reload of the current page
		navigate('.', { relative: 'path' })
	}

	// const getPlayer = async () => {
	// 	// Reset data
	// 	setPlayerInfo(undefined)

	// 	const getPlayerResponse = await playerApi.getPlayer(room || '', name)

	// 	if (getPlayerResponse.status === 404) {
	// 		return errorContext?.setError('Player not found!', 'player')
	// 	}

	// 	const json = getPlayerResponse.data
	// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// 	const jsonAsAny = json as any

	// 	if (jsonAsAny.message) {
	// 		errorContext?.setError(jsonAsAny.message, 'player')
	// 	} else {
	// 		setPlayerInfo(json)
	// 		errorContext?.setError(undefined, 'player')
	// 	}
	// }

	/** Initially fetch data */
	useEffect(() => {
		// Set room name in session storage
		if (room) {
			roomSession[1](room)
		}

		if (!name) {
			navigate('/')
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name])

	useEffect(() => {
		const interval = setInterval(getRoom, 15 * 1000)
		return () => clearInterval(interval)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roomStatus])

	return (
		<RoomContext.Provider
			value={{
				room: roomStatus,
				playerIsGM: roomStatus?.players.filter((p) => p.isGM)[0]?.name === name,
			}}
		>
			<Menu
				headerProps={{
					title: room,
					onClick: () => navigate('/'),
					status: true,
				}}
			>
				<PlayerActions />
				<PlayerList />
			</Menu>
			<div className="room-content">
				<Outlet />
				{/* {playerInfo ? (
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
				)} */}
			</div>
		</RoomContext.Provider>
	)
}
