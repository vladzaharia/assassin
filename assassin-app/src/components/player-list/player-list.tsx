/* eslint-disable react/jsx-no-useless-fragment */
import { faCrown, faTombstoneBlank, faUserMinus, faUserPlus } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BasicPlayer } from 'assassin-server-client'
import isMobile from 'is-mobile'
import { useContext, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useLocalStorage from 'use-local-storage'
import { createPlayerApi } from '../../api'
import { NotificationContext } from '../../context/notification'
import { RoomContext } from '../../context/room'
import Header from '../header/header'
import Popover from '../popover/popover'
import './player-list.css'
import Button from '../button/button'
import { AnimatePresence, motion } from 'framer-motion'

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
		return faTombstoneBlank
	} else if (player.isGM) {
		return faCrown
	}
}

export default function PlayerList() {
	const [name] = useLocalStorage('name', '')
	const roomContext = useContext(RoomContext)
	const { notification, setError, setNotification, showNotification } = useContext(NotificationContext)
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
				setNotification(addPlayerResponse.data.message, 'join', addPlayerResponse.status === 200 ? 'success' : 'failed')
				navigate('.', { relative: 'path' })
			} catch (e) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const eAsAny = e as any
				setError(eAsAny.response?.data.message || eAsAny.response?.data || 'Something went wrong!', 'join')
			}
		}

		const deletePlayer = async () => {
			try {
				const deletePlayerResponse = await playerApi.deletePlayer(roomContext?.room?.name || '', name)
				setNotification(deletePlayerResponse.data.message, 'leave', deletePlayerResponse.status === 200 ? 'success' : 'failed')
				navigate('.', { relative: 'path' })
			} catch (e) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const eAsAny = e as any
				setError(eAsAny.response?.data.message || eAsAny.response?.data || 'Something went wrong!', 'leave')
			}
		}

		return (
			<Button
				className={
					showNotification && ['join', 'leave'].includes(notification?.source || '')
						? notification?.notificationType || 'primary'
						: !playerInRoom
						? 'green'
						: 'primary'
				}
				iconProps={{ icon: !playerInRoom ? faUserPlus : faUserMinus }}
				onClick={!playerInRoom ? addPlayer : deletePlayer}
				disabled={!roomStatus || roomStatus.status === 'started'}
			/>
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
									className={'button blue'}
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

			{roomStatus?.players && (
				<AnimatePresence mode="sync">
					{roomStatus?.players.map((player) => {
						const icon = getPlayerIcon(player)
						return (
							<motion.div
								className={`player no-animate ${getPlayerColor(player)}`}
								key={player.name}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								<span>{player.name}</span>
								{icon ? <FontAwesomeIcon icon={icon} /> : undefined}
							</motion.div>
						)
					})}
				</AnimatePresence>
			)}
		</div>
	)
}
