/* eslint-disable react/jsx-no-useless-fragment */
import { faCrosshairs, faCrown, faUser, faUserMinus, faUserPlus } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BasicPlayer } from 'assassin-server-client'
import isMobile from 'is-mobile'
import { useContext, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useLocalStorage from 'use-local-storage'
import { createPlayerApi } from '../../api'
import { ErrorContext } from '../../context/error'
import { RoomContext } from '../../context/room'
import Header from '../header/header'
import Popover from '../popover/popover'
import './player-list.css'

const getPlayerColor = (player: BasicPlayer) => {
	if (player.isGM) {
		return 'blue'
	} else if (player.status === 'eliminated') {
		return 'primary'
	}

	return ''
}

const getPlayerIcon = (player: BasicPlayer) => {
	if (player.status === 'eliminated') {
		return faCrosshairs
	} else if (player.isGM) {
		return faCrown
	} else return faUser
}

export default function PlayerList() {
	const [name] = useLocalStorage('name', '')
	const roomContext = useContext(RoomContext)
	const errorContext = useContext(ErrorContext)
	const navigate = useNavigate()
	const location = useLocation()

	const [gmPopoverOpen, setGMPopoverOpen] = useState<boolean>(false)
	const gmPopoverAnchor = useRef<HTMLButtonElement>(null)

	const roomStatus = roomContext?.room

	const JoinLeaveButton = () => {
		const playerInRoom = roomStatus?.players.some((p) => p.name === name)
		const playerApi = createPlayerApi()

		const addPlayer = async () => {
			try {
				const addPlayerResponse = await playerApi.putPlayer(roomContext?.room?.name || '', name)
				errorContext?.setError(addPlayerResponse.data.message, 'join')
				navigate('.', { relative: 'path' })
			} catch (e) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const eAsAny = e as any
				errorContext?.setError(eAsAny.response?.data.message || eAsAny.response?.data || 'Something went wrong!', 'join')
			}
		}

		const deletePlayer = async () => {
			try {
				const deletePlayerResponse = await playerApi.deletePlayer(roomContext?.room?.name || '', name)
				errorContext?.setError(deletePlayerResponse.data.message, 'leave')
				navigate('.', { relative: 'path' })
			} catch (e) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const eAsAny = e as any
				errorContext?.setError(eAsAny.response?.data.message || eAsAny.response?.data || 'Something went wrong!', 'leave')
			}
		}

		return (
			<button
				className={errorContext?.showError && ['join', 'leave'].includes(errorContext?.error?.errorType || "")  ? 'failed' : (!playerInRoom ? 'green' : 'primary')}
				onClick={!playerInRoom ? addPlayer : deletePlayer}
				disabled={!roomStatus || roomStatus.status === 'started'}
			>
				<FontAwesomeIcon icon={!playerInRoom ? faUserPlus : faUserMinus} />
			</button>
		)
	}

	return (
		<div className="player-list">
			<Header
				title="Player List"
				bottomBorder={false}
				rightActions={
					<>
						{roomContext?.playerIsGM ? (
							<>
								<button
									className={'blue'}
									onClick={() => {
										if (!location.pathname.includes('gm')) {
											navigate('gm')
										} else {
											navigate('..', { relative: 'path' })
										}
									}}
									ref={gmPopoverAnchor}
									onPointerEnter={() => {
										if (!isMobile()) {
											setGMPopoverOpen(true)
										}
									}}
									onPointerLeave={() => {
										if (!isMobile()) {
											setGMPopoverOpen(false)
										}
									}}
								>
									<FontAwesomeIcon icon={faCrown} />
								</button>
								<Popover
									title="GM Options"
									description={
										<>
											As the first player to join the room, you can control it! <br />
											<br /> <strong>Click here to set room options and start the game.</strong>
										</>
									}
									color="blue"
									icon={faCrown}
									anchor={gmPopoverAnchor.current}
									open={gmPopoverOpen}
									onClose={() => setGMPopoverOpen(false)}
								/>
							</>
						) : undefined}
						<JoinLeaveButton />
					</>
				}
			/>

			{roomStatus?.players.map((player) => {
				return (
					<div className={`player ${getPlayerColor(player)}`} key={player.name}>
						<FontAwesomeIcon icon={getPlayerIcon(player)} /> {player.name}
					</div>
				)
			})}
		</div>
	)
}
