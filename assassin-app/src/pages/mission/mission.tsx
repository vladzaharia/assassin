import { Player as PlayerResponse } from 'assassin-server-client'
import { useContext, useEffect, useRef, useState } from 'react'
import { useLoaderData, useNavigate, useRevalidator } from 'react-router-dom'
import { NotificationContext } from '../../context/notification'
import { RoomContext } from '../../context/room'
import './mission.css'
import Header from '../../components/header/header'
import Button from '../../components/button/button'
import { faCrosshairs, faXmark } from '@fortawesome/pro-solid-svg-icons'
import Action from '../../components/action/action'
import Words from '../../components/words/words'
import { Modal } from '@mui/material'
import { createPlayerApi } from '../../api'
import { isAxiosError } from 'axios'

export default function Mission() {
	const [showModal, setShowModal] = useState<boolean>(false)
	const modalContainer = useRef<HTMLDivElement>(null)
	const roomStatus = useContext(RoomContext)
	const { setError, setNotification, notification, showNotification } = useContext(NotificationContext)
	const player = useLoaderData() as PlayerResponse
	const playerApi = createPlayerApi(player.name)

	const navigate = useNavigate()
	const { revalidate } = useRevalidator()

	const hasPlayer = Object.keys(player).length > 0
	const usesWords = roomStatus?.room?.usesWords

	const eliminatePlayer = async (word: string) => {
		try {
			await playerApi.eliminatePlayer(roomStatus?.room?.name || '', player.name, { word })
			setNotification({
				message: `${player.target} eliminated successfully!`,
				icon: faCrosshairs,
				source: 'eliminate',
				notificationType: 'success',
			})
			setShowModal(false)
			revalidate()
		} catch (e) {
			if (isAxiosError(e)) {
				setError(e.response?.data || e.message, 'eliminate')
			} else {
				setError('Something went wrong!', 'eliminate')
			}
		}
	}

	useEffect(() => {
		if (roomStatus?.room?.status !== 'started') {
			setError('The game has not started!', 'room')
			navigate(`/room/${roomStatus?.room?.name}`)
		}

		if (!hasPlayer) {
			setError('You are not in this room!', 'room')
			navigate(`/room/${roomStatus?.room?.name}`)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roomStatus])

	return (
		<div className="mission" ref={modalContainer}>
			{hasPlayer ? (
				// eslint-disable-next-line react/jsx-no-useless-fragment
				<>
					<Header
						title="Mission"
						rightActions={
							<Button className="primary" onClick={() => navigate(`/room/${roomStatus?.room?.name}`)} iconProps={{ icon: faXmark }} />
						}
					/>
					<Action
						text="Target"
						description={
							usesWords
								? 'This is your target; get them to use one of the words below to eliminate them!'
								: 'This is your target; tag them to eliminate them!'
						}
					>
						<span className="target">{player.target}</span>
					</Action>
					<Action text="Record elimination" description="Click this button once you have eliminated your target.">
						<Button
							className={showNotification && notification?.source === 'eliminate' ? notification?.notificationType : 'green'}
							iconProps={{ icon: faCrosshairs }}
							onClick={() => setShowModal(true)}
						/>
					</Action>
					{usesWords ? (
						<Action text="Words" className="column" description="Use these words to eliminate your target.">
							<Words words={player.words} />
						</Action>
					) : undefined}
				</>
			) : undefined}
			<Modal container={modalContainer.current} open={showModal} onClose={() => setShowModal(false)}>
				<div className="mission-modal">
					<Header
						title="Confirm elimination"
						rightActions={<Button className="primary" onClick={() => setShowModal(false)} iconProps={{ icon: faXmark }} />}
					/>
					<div className="confirm">
						<p>
							Congratulations on eliminating <strong>{player.target}</strong>!
							{roomStatus?.room?.usesWords
								? ' Choose the word you used to eliminate them to confirm your elimination.'
								: ' Click the button to confirm your elimination.'}
						</p>
					</div>
					<Words words={player.words} onClick={eliminatePlayer} />
				</div>
			</Modal>
		</div>
	)
}
