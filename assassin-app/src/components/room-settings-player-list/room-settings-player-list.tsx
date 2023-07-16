import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { createAdminOrGMApi } from '../../api'
import { RoomSettingsComponentProps } from '../../types'
import { useAuth } from 'react-oidc-context'
import useLocalStorage from 'use-local-storage'
import SectionTitle from '../section-title/section-title'
import { useNotificationAwareRequest } from '../../hooks/notification'
import { RoomContext } from '../../hooks/room'
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
import { AdminApi, Player, PlayerStatus } from 'assassin-server-client'
import Table from '../table/table'
import Button from '../button/button'
import './room-settings-player-list.css'
import Header from '../header/header'
import Modal, { ConfirmModal, CreateModal } from '../modal/modal'
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
	const auth = useAuth()
	const [name] = useLocalStorage('name', '')
	const request = useNotificationAwareRequest()

	const api = createAdminOrGMApi(apiType, name, auth.user?.access_token || '')

	const roomContext = useContext(RoomContext)
	const roomStatus = roomContext?.room

	const [player, setPlayer] = useState<Player | undefined>()
	const [showPlayerDetails, setShowPlayerDetails] = useState<boolean>(false)
	const [removePlayerModalName, setRemovePlayerModalName] = useState<string | undefined>()
	const [showCreateModal, setShowCreateModal] = useState<boolean>(false)

	const fetchPlayer = async (playerName: string) => {
		if (roomStatus) {
			request(
				async () => (await (api as AdminApi).getPlayer(roomStatus.name, playerName)).data,
				undefined,
				(player) => {
					setShowPlayerDetails(false)
					setPlayer(player)
				}
			)
		}
	}

	const addPlayer = async (playerName: string) => {
		if (roomStatus && roomStatus.status !== 'started') {
			request(
				async () => await (api as AdminApi).putPlayer(roomStatus.name, playerName),
				{ message: `Added ${playerName} successfully!`, source: 'player', icon: faUserPlus },
				() => setShowCreateModal(false),
				() => setShowCreateModal(false)
			)
		}
	}

	const removePlayer = async (playerName: string) => {
		if (roomStatus && roomStatus.status !== 'started') {
			request(
				async () => await api.deletePlayer(roomStatus.name, playerName),
				{ message: `Removed ${playerName} successfully!`, source: 'player', icon: faUserMinus },
				() => setRemovePlayerModalName(undefined),
				() => setRemovePlayerModalName(undefined)
			)
		}
	}

	return (
		<>
			<SectionTitle color="blue">
				<FontAwesomeIcon className="mr-05" icon={faUsers} /> Player List
			</SectionTitle>
			<Table
				color="blue"
				className="player-list-table"
				headers={[
					{ element: 'Player name' },
					{ element: 'Status', className: 'table-cell-md' },
					{
						element:
							apiType === 'admin' ? (
								<div className="buttons">
									<Button
										color="green"
										iconProps={{ icon: faPlus }}
										disabled={roomStatus?.status === 'started'}
										onClick={() => setShowCreateModal(true)}
									/>
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
												color="primary"
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
				text={`Are you sure you want to kick ${removePlayerModalName} from ${roomStatus?.name || 'the room'}?`}
			/>
			<Modal open={!!player} onClose={() => setPlayer(undefined)}>
				<>
					<Header
						className="corner-left-05 corner-right-05"
						title={player?.name}
						rightActions={
							<div className="player-info-buttons">
								{roomStatus?.status === 'started' ? (
									<Button
										color="blue"
										iconProps={{ icon: showPlayerDetails ? faEyeSlash : faEye }}
										onClick={() => setShowPlayerDetails(!showPlayerDetails)}
									/>
								) : undefined}
								<Button color="primary" iconProps={{ icon: faXmark }} onClick={() => setPlayer(undefined)} />
							</div>
						}
					/>
					<div className="player-info">
						<Action text="Status">
							<span>{GetPlayerStatus(false, player?.status)}</span>
						</Action>
						<Action text="Is GM?">
							<FontAwesomeIcon className="mr-05" icon={player?.isGM ? faCheck : faXmark} />
						</Action>
						{roomStatus?.status === 'started' ? (
							<>
								<Action text="Target">
									{showPlayerDetails ? player?.target : <FontAwesomeIcon className="mr-05" icon={faEyeSlash} />}
								</Action>
								<Action text="Words">
									{showPlayerDetails ? (
										<div className="player-info-words">
											{player?.words?.map((w) => (
												<span>{w}</span>
											))}
										</div>
									) : (
										<FontAwesomeIcon className="mr-05" icon={faEyeSlash} />
									)}
								</Action>
							</>
						) : undefined}
					</div>
				</>
			</Modal>
			<CreateModal
				open={showCreateModal}
				text="Player name"
				description={`The name of the player to add to ${roomStatus?.name || 'the room'}.`}
				onCreate={(val) => addPlayer(val)}
				onClose={() => setShowCreateModal(false)}
			/>
		</>
	)
}
