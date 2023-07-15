import { Room as RoomResponse } from 'assassin-server-client'
import { useEffect } from 'react'
import { Outlet, useLoaderData, useLocation, useNavigate } from 'react-router-dom'
import useLocalStorage from 'use-local-storage'
import useSessionStorage from 'use-session-storage-state'
import Menu from '../../components/menu/menu'
import PlayerActions from '../../components/player-actions/player-actions'
import PlayerList from '../../components/player-list/player-list'
import { RoomContext } from '../../hooks/room'
import './room.css'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '../../components/button/button'
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons'
import RoomStatus from '../../components/room-status/room-status'
import useReload from '../../hooks/reload'

export default function Room() {
	const room = useLoaderData() as RoomResponse
	const [name] = useLocalStorage<string>('name', '')
	const roomSession = useSessionStorage<string>('room', { defaultValue: '' })
	const navigate = useNavigate()
	const location = useLocation()

	useEffect(() => {
		// Keep room name in session storage
		if (room.name) {
			roomSession[1](room.name)
		}

		// Go home if user is not set
		if (!name) {
			navigate('/')
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name])

	useReload(room)

	return (
		<RoomContext.Provider
			value={{
				room: room,
				playerIsGM: room?.players.filter((p) => p.isGM)[0]?.name === name,
			}}
		>
			<Menu
				headerProps={{
					title: room.name,
					leftActions: (
						<Button
							className="primary"
							onClick={() => navigate('/')}
							iconProps={{
								icon: faChevronLeft,
							}}
						/>
					),
					rightActions: <RoomStatus />,
				}}
			>
				<PlayerActions key="actions" />
				<PlayerList key="list" />
			</Menu>
			<div className="room-content">
				<AnimatePresence mode="popLayout">
					<motion.div
						className="room-content no-animate"
						key={location.pathname}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5 }}
					>
						<Outlet />
					</motion.div>
				</AnimatePresence>
			</div>
		</RoomContext.Provider>
	)
}
