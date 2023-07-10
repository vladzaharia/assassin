/* eslint-disable react/jsx-no-useless-fragment */
import { faCrown, faDoorOpen, faFaceSadTear, faTombstoneBlank, faUserMinus, faUserPlus } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BasicPlayer } from 'assassin-server-client'
import { useContext, useRef, useState } from 'react'
import { useRevalidator } from 'react-router-dom'
import useLocalStorage from 'use-local-storage'
import { createPlayerApi } from '../../api'
import { NotificationContext } from '../../context/notification'
import { RoomContext } from '../../context/room'
import Header from '../header/header'
import './player-list.css'
import Button from '../button/button'
import { AnimatePresence, motion } from 'framer-motion'
import Popover from '../popover/popover'
import isMobile from 'is-mobile'

function PlayerEntry({ player }: { player: BasicPlayer }) {
	const popoverAnchor = useRef<HTMLDivElement>(null)
	const [popoverOpen, setPopoverOpen] = useState<boolean>(false)

	const getPlayerColor = () => {
		if (player.isGM) {
			return 'blue'
		} else if (player.status === 'eliminated') {
			return 'primary'
		}

		return 'grey-dark'
	}

	const getPlayerIcon = () => {
		if (player.status === 'eliminated') {
			return faTombstoneBlank
		} else if (player.isGM) {
			return faCrown
		}
	}

	const icon = getPlayerIcon()
	const color = getPlayerColor()

	return (
		<motion.div
			className={`player no-animate ${color}`}
			key={player.name}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onPointerEnter={() => {
				if (!isMobile()) {
					setPopoverOpen(true)
				}
			}}
			onPointerLeave={() => {
				if (!isMobile()) {
					setPopoverOpen(false)
				}
			}}
			onClick={() => {
				if (isMobile()) {
					setPopoverOpen(!popoverOpen)
				}
			}}
		>
			<span>{player.name}</span>
			{icon ? (
				<div className="icon" ref={popoverAnchor}>
					<FontAwesomeIcon icon={icon} />
					<Popover
						anchor={popoverAnchor.current}
						color={color}
						onClose={() => setPopoverOpen(false)}
						open={popoverOpen}
						title={player.isGM ? 'GM' : player.status === 'eliminated' ? 'Eliminated' : undefined}
						description={
							player.isGM
								? 'This player is the GM of the room. They can set settings and start the game.'
								: player.status === 'eliminated'
								? 'This player has been eliminated from the competition.'
								: undefined
						}
						icon={icon}
					/>
				</div>
			) : undefined}
		</motion.div>
	)
}

export default function PlayerList() {
	const [name] = useLocalStorage('name', '')
	const roomContext = useContext(RoomContext)
	const { notification, setError, setNotification, showNotification } = useContext(NotificationContext)
	const { revalidate } = useRevalidator()
	const roomStatus = roomContext?.room

	const JoinLeaveButton = () => {
		const playerInRoom = roomStatus?.players.some((p) => p.name === name)
		const playerApi = createPlayerApi()

		const addPlayer = async () => {
			try {
				const addPlayerResponse = await playerApi.putPlayer(roomContext?.room?.name || '', name)
				setNotification({
					message: addPlayerResponse.data.message,
					icon: faDoorOpen,
					source: 'join',
					notificationType: addPlayerResponse.status === 200 ? 'success' : 'failed',
				})
				revalidate()
			} catch (e) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const eAsAny = e as any
				setError(eAsAny.response?.data.message || eAsAny.response?.data || 'Something went wrong!', 'join')
			}
		}

		const deletePlayer = async () => {
			try {
				const deletePlayerResponse = await playerApi.deletePlayer(roomContext?.room?.name || '', name)
				setNotification({
					message: deletePlayerResponse.data.message,
					icon: faFaceSadTear,
					source: 'leave',
					notificationType: deletePlayerResponse.status === 200 ? 'success' : 'failed',
				})
				revalidate()
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
		<div className="player-list" key="list">
			<Header title="Player List" bottomBorder={false} rightActions={<JoinLeaveButton />} key="header" />

			{roomStatus?.players && (
				<AnimatePresence mode="sync" key="players-animate">
					{roomStatus?.players.map((player) => (
						<PlayerEntry player={player} key={player.name} />
					))}
				</AnimatePresence>
			)}
		</div>
	)
}
