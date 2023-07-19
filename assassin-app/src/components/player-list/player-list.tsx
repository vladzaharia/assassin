/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/jsx-no-useless-fragment */
import {
	faCrown,
	faDoorOpen,
	faFaceSadTear,
	faTombstoneBlank,
	faUserMinus,
	faUserPlus,
	faTrophyStar,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BasicPlayer } from 'assassin-server-client'
import { useContext, useRef, useState } from 'react'
import { useRevalidator } from 'react-router-dom'
import { createPlayerApi } from '../../api'
import { NotificationContext } from '../../hooks/notification'
import { RoomContext } from '../../hooks/room'
import Header from '../header/header'
import './player-list.css'
import Button from '../button/button'
import { AnimatePresence, motion } from 'framer-motion'
import Popover from '../popover/popover'
import isMobile from 'is-mobile'
import { CommonColor } from '../../types'
import { NameContext } from '../../hooks/name'

function PlayerEntry({ player }: { player: BasicPlayer }) {
	const popoverAnchor = useRef<HTMLDivElement>(null)
	const [popoverOpen, setPopoverOpen] = useState<boolean>(false)

	const getPlayerColor = () => {
		if (player.status === 'champion') {
			return 'orange'
		} else if (player.status === 'eliminated') {
			return 'primary'
		} else if (player.isGM) {
			return 'blue'
		}

		return 'grey-dark'
	}

	const getPlayerIcon = () => {
		if (player.status === 'eliminated') {
			return faTombstoneBlank
		} else if (player.status === 'champion') {
			return faTrophyStar
		} else if (player.isGM) {
			return faCrown
		}
	}

	const getPopoverTitle = () => {
		if (player.status === 'eliminated') {
			return 'Eliminated'
		} else if (player.status === 'champion') {
			return 'Champion!'
		} else if (player.isGM) {
			return 'GM'
		}
	}

	const getPopoverDescription = () => {
		if (player.status === 'eliminated') {
			return 'This player has been eliminated from the competition.'
		} else if (player.status === 'champion') {
			return 'This player has won the game!'
		} else if (player.isGM) {
			return 'This player is the GM of the room. They can set settings and start the game.'
		}
	}

	const icon = getPlayerIcon()
	const color = getPlayerColor()

	return (
		<motion.div
			ref={popoverAnchor}
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
				<div className="icon">
					<FontAwesomeIcon icon={icon} />
					<Popover
						anchor={popoverAnchor.current}
						color={color}
						onClose={() => setPopoverOpen(false)}
						open={popoverOpen}
						title={getPopoverTitle()}
						description={getPopoverDescription()}
						icon={icon}
					/>
				</div>
			) : undefined}
		</motion.div>
	)
}

export default function PlayerList() {
	const { name } = useContext(NameContext)!
	const roomContext = useContext(RoomContext)
	const { notification, setError, setNotification, showNotification } = useContext(NotificationContext)
	const { revalidate } = useRevalidator()
	const roomStatus = roomContext?.room

	const JoinLeaveButton = () => {
		const playerInRoom = roomStatus?.players.some((p) => p.name === name)
		const playerApi = createPlayerApi(name!)

		const addPlayer = async () => {
			try {
				const addPlayerResponse = await playerApi.putPlayer(roomContext?.room?.name || '', name!)
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
				const deletePlayerResponse = await playerApi.deletePlayer(roomContext?.room?.name || '', name!)
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
				color={
					showNotification && ['join', 'leave'].includes(notification?.source || '')
						? (notification?.notificationType as CommonColor) || 'primary'
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
