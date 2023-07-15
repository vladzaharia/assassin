import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { createAdminOrGMApi } from '../../api'
import { RoomSettingsComponentProps } from '../../types'
import { useAuth } from 'react-oidc-context'
import useLocalStorage from 'use-local-storage'
import SectionTitle from '../section-title/section-title'
import { NotificationContext } from '../../context/notification'
import { RoomContext } from '../../context/room'
import { useContext, useState } from 'react'
import {
	faCheck,
	faCrown,
	faEye,
	faEyeSlash,
	faPlus,
	faStarOfLife,
	faTombstone,
	faTrash,
	faTrophyStar,
	faUserMinus,
	faUserPlus,
	faUsers,
	faXmark,
} from '@fortawesome/pro-solid-svg-icons'
import { useRevalidator } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { AdminApi, Player, PlayerStatus } from 'assassin-server-client'
import Table from '../table/table'
import Button from '../button/button'
import './room-settings-player-list.css'
import Header from '../header/header'
import Modal, { ConfirmModal } from '../modal/modal'
import Action from '../action/action'

export const GetPlayerStatus = (isGM: boolean, status?: PlayerStatus) => {
	let gmElement: JSX.Element | undefined
	let playerElement: JSX.Element | undefined

	if (isGM) {
		gmElement = (
			<>
				<FontAwesomeIcon className="mr-025" icon={faCrown} /> GM
			</>
		)
	}

	switch (status) {
		case 'alive':
			playerElement = (
				<>
					<FontAwesomeIcon className="mr-025" icon={faStarOfLife} /> Alive
				</>
			)
			break
		case 'eliminated':
			playerElement = (
				<>
					<FontAwesomeIcon className="mr-025" icon={faTombstone} /> Eliminated
				</>
			)
			break
		case 'champion':
			playerElement = (
				<>
					<FontAwesomeIcon className="mr-025" icon={faTrophyStar} /> Champion
				</>
			)
			break
	}

	return (
		<span>
			{gmElement ? (
				<>
					<span className="mr-05">{gmElement}</span>
					<span className="mr-05">/</span>
				</>
			) : undefined}
			{playerElement}
		</span>
	)
}

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
	const [removePlayerModalName, setRemovePlayerModalName] = useState<string | undefined>()

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

				setRemovePlayerModalName(undefined)

				revalidate()
			} catch (e) {
				setRemovePlayerModalName(undefined)

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
					{ element: 'Status', className: 'table-cell-md' },
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
								{ element: GetPlayerStatus(p.isGM, p.status) || '', className: 'table-cell-md' },
								{
									element: (
										<div className="buttons">
											<Button
												className="primary"
												iconProps={{ icon: faTrash }}
												onClick={(e) => {
													e.stopPropagation()
													setRemovePlayerModalName(p.name)
												}}
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
			<ConfirmModal
				open={!!removePlayerModalName}
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				onConfirm={() => removePlayer(removePlayerModalName!)}
				onClose={() => setRemovePlayerModalName(undefined)}
				text={`Are you sure you want to kick ${removePlayerModalName} from the room?`}
			/>
			<Modal open={!!player} onClose={() => setPlayer(undefined)}>
				<>
					<Header
						className="corner-left-05 corner-right-05"
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
						<Action text="Status">
							<span>{GetPlayerStatus(false, player?.status)}</span>
						</Action>
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
