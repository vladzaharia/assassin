import { Player as PlayerResponse } from 'assassin-server-client'
import { useContext, useEffect, useState } from 'react'
import { useLoaderData, useNavigate, useRevalidator } from 'react-router-dom'
import { NotificationContext } from '../../../hooks/notification'
import { RoomContext } from '../../../hooks/room'
import './mission.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { faCheck, faCrosshairs, faTrophyStar, faUserSecret, faXmark } from '@fortawesome/pro-solid-svg-icons'
import Action from '../../../components/action/action'
import Words from '../../../components/words/words'
import { createPlayerApi } from '../../../api'
import { isAxiosError } from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SectionTitle from '../../../components/section-title/section-title'
import Modal from '../../../components/modal/modal'

export default function Mission() {
	const [showModal, setShowModal] = useState<boolean>(false)
	const roomStatus = useContext(RoomContext)
	const { setError, setNotification, notification, showNotification } = useContext(NotificationContext)
	const player = useLoaderData() as PlayerResponse
	const playerApi = createPlayerApi(player.name)

	const navigate = useNavigate()
	const { revalidate } = useRevalidator()

	const hasPlayer = Object.keys(player).length > 0
	const usesWords = roomStatus?.room?.usesWords

	const eliminatePlayer = async (word?: string) => {
		try {
			const eliminateResult = await playerApi.eliminatePlayer(roomStatus?.room?.name || '', player.name, { word })

			if (eliminateResult.status === 299) {
				setNotification({
					message: eliminateResult.data.message,
					icon: faTrophyStar,
					source: 'eliminate',
					notificationType: 'success',
				})
				navigate(`/room/${roomStatus?.room?.name}`)
				revalidate()
			} else {
				setNotification({
					message: `${player.target} eliminated successfully!`,
					icon: faCrosshairs,
					source: 'eliminate',
					notificationType: 'success',
				})
				revalidate()
			}

			setShowModal(false)
		} catch (e) {
			if (isAxiosError(e)) {
				setError(e.response?.data?.message || e.message, 'eliminate')
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

		if (player.status === 'eliminated') {
			setError('You have been eliminated from the game!', 'room')
			navigate(`/room/${roomStatus?.room?.name}`)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roomStatus])

	return (
		<div className="mission">
			{hasPlayer ? (
				// eslint-disable-next-line react/jsx-no-useless-fragment
				<>
					<Header
						title="Mission"
						className="primary corner-right"
						leftActions={<FontAwesomeIcon icon={faUserSecret} size="lg" />}
						rightActions={
							<Button className="primary" onClick={() => navigate(`/room/${roomStatus?.room?.name}`)} iconProps={{ icon: faXmark }} />
						}
					/>
					<SectionTitle className="primary">Target</SectionTitle>
					<Action
						text="Target name"
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
						<>
							<SectionTitle className="primary">Words</SectionTitle>
							<Action className="column" description="Use these words to eliminate your target.">
								<Words words={player.words} />
							</Action>
						</>
					) : undefined}
				</>
			) : undefined}
			<Modal className="mission-modal" open={showModal} onClose={() => setShowModal(false)}>
				<>
					<Header
						title="Confirm Elimination"
						className="with-icon"
						leftActions={<FontAwesomeIcon icon={faCrosshairs} size="lg" />}
						rightActions={<Button className="primary" onClick={() => setShowModal(false)} iconProps={{ icon: faXmark }} />}
					/>
					<div className="confirm">
						<p>
							Congratulations on eliminating <strong>{player.target}</strong>!
						</p>
						<p>
							{usesWords
								? ' Choose the word you used to eliminate them to confirm your elimination:'
								: ' Click the button to confirm your elimination:'}
						</p>
					</div>
					{usesWords ? (
						<Words words={player.words} onWordClick={eliminatePlayer} />
					) : (
						<div className="button-wrapper">
							<Button
								text="Confirm Elimination"
								className="green"
								iconProps={{ icon: faCheck, size: 'xl' }}
								onClick={() => eliminatePlayer()}
							/>
						</div>
					)}
				</>
			</Modal>
		</div>
	)
}
