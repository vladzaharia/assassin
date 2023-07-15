import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { createAdminOrGMApi } from '../../api'
import { RoomSettingsComponentProps } from '../../types'
import { useAuth } from 'react-oidc-context'
import useLocalStorage from 'use-local-storage'
import SectionTitle from '../section-title/section-title'
import { NotificationContext } from '../../context/notification'
import { RoomContext } from '../../context/room'
import { useContext, useState } from 'react'
import { faCheck, faEye, faEyeSlash, faPlus, faTrash, faUserMinus, faUserPlus, faUsers, faXmark } from '@fortawesome/pro-solid-svg-icons'
import { useRevalidator } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { AdminApi, Player } from 'assassin-server-client'
import Table from '../table/table'
import Button from '../button/button'
import './room-settings-player-list.css'
import { ContainerContext } from '../../context/container'
import Header from '../header/header'
import Modal from '../modal/modal'
import Action from '../action/action'

export default function RoomSettingsPlayerList({ apiType }: RoomSettingsComponentProps) {
	const { revalidate } = useRevalidator()
	const auth = useAuth()
	const [name] = useLocalStorage('name', '')

	const api = createAdminOrGMApi(apiType, name, auth.user?.access_token || '')

	const { setError, setNotification } = useContext(NotificationContext)

	const roomContext = useContext(RoomContext)
	const roomStatus = roomContext?.room

	const [player, setPlayer] = useState<Player | undefined>()
	const [showPlayerDetails, setShowPlayerDetails] = useState<boolean>(false)
	const container = useContext(ContainerContext)

	const fetchPlayer = async (playerName: string) => {
		if (roomStatus) {
			try {
				const player = await (api as AdminApi).getPlayer(roomStatus.name, playerName)
				setShowPlayerDetails(false)
				setPlayer(player.data)
			} catch (e) {
				if (isAxiosError(e)) {
					setError(e.response?.data || e.message, 'gm-reset')
				} else {
					setError('Something went wrong!', 'gm-reset')
				}
			}
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const addPlayer = async (playerName: string) => {
		if (roomStatus && roomStatus.status !== 'started') {
			try {
				await (api as AdminApi).putPlayer(roomStatus.name, playerName)
				setNotification({
					message: `Added ${name} successfully!`,
					notificationType: 'success',
					source: 'player',
					icon: faUserPlus,
				})

				revalidate()
			} catch (e) {
				if (isAxiosError(e)) {
					setError(e.response?.data || e.message, 'player')
				} else {
					setError('Something went wrong!', 'player')
				}
			}
		}
	}

	const removePlayer = async (playerName: string) => {
		if (roomStatus && roomStatus.status !== 'started') {
			try {
				await api.deletePlayer(roomStatus.name, playerName)
				setNotification({
					message: `Removed ${name} successfully!`,
					notificationType: 'success',
					source: 'player',
					icon: faUserMinus,
				})

				revalidate()
			} catch (e) {
				if (isAxiosError(e)) {
					setError(e.response?.data || e.message, 'player')
				} else {
					setError('Something went wrong!', 'player')
				}
			}
		}
	}

	return (
		<>
			<SectionTitle className="blue">
				<FontAwesomeIcon className="mr-05" icon={faUsers} /> Player List
			</SectionTitle>
			<Table
				className="blue player-list-table"
				headers={[
					{ element: 'Player name' },
					{ element: 'Status', className: 'show-mobile' },
					{
						element:
							apiType === 'admin' ? (
								<div className="buttons">
									<Button className="green" iconProps={{ icon: faPlus }} />
								</div>
							) : (
								''
							),
					},
				]}
				rows={
					roomStatus?.players.map((p) => {
						return {
							name: p.name,
							cells: [
								{ element: p.name },
								{ element: p.status || '', className: 'show-mobile' },
								{
									element: (
										<div className="buttons">
											<Button
												className="primary"
												iconProps={{ icon: faTrash }}
												onClick={() => removePlayer(p.name)}
												disabled={roomStatus.status === 'started'}
											/>
										</div>
									),
								},
							],
							onClick:
								apiType === 'admin'
									? () => {
											fetchPlayer(p.name)
									  }
									: undefined,
						}
					}) || []
				}
			/>
			<Modal open={!!player} onClose={() => setPlayer(undefined)} container={container?.current}>
				<>
					<Header
						title={player?.name}
						rightActions={
							<div className="player-info-buttons">
								<Button
									className="blue"
									iconProps={{ icon: showPlayerDetails ? faEyeSlash : faEye }}
									onClick={() => setShowPlayerDetails(!showPlayerDetails)}
								/>
								<Button className="primary" iconProps={{ icon: faXmark }} onClick={() => setPlayer(undefined)} />
							</div>
						}
					/>
					<div className="player-info">
						<Action text="Status">{player?.status}</Action>
						<Action text="Is GM?">{player?.isGM ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faXmark} />}</Action>
						{roomStatus?.status === 'started' ? (
							<>
								<Action text="Target">{showPlayerDetails ? player?.target : <FontAwesomeIcon icon={faEyeSlash} />}</Action>
								<Action text="Words">
									{showPlayerDetails ? (
										<div className="player-info-words">
											{player?.words?.map((w) => (
												<span>{w}</span>
											))}
										</div>
									) : (
										<FontAwesomeIcon icon={faEyeSlash} />
									)}
								</Action>
							</>
						) : undefined}
					</div>
				</>
			</Modal>
		</>
	)
}
