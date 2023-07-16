import { useLoaderData, useNavigate } from 'react-router-dom'
import './room-list.css'
import Header from '../../../components/header/header'
import Button, { NotificationAwareButton } from '../../../components/button/button'
import { faCheck, faDoorOpen, faTrash, faXmark, faPlus } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BasicRoom } from 'assassin-server-client'
import Table from '../../../components/table/table'
import { useState } from 'react'
import { ConfirmModal, CreateModal } from '../../../components/modal/modal'
import { createAdminApi } from '../../../api'
import { useAuth } from 'react-oidc-context'
import { useNotificationAwareRequest } from '../../../hooks/notification'
import useReload from '../../../hooks/reload'

export default function RoomsAdmin() {
	const rooms = useLoaderData() as BasicRoom[]
	useReload(rooms)
	const navigate = useNavigate()
	const auth = useAuth()
	const request = useNotificationAwareRequest()

	const [deleteModalRoomName, setDeleteModalRoomName] = useState<string | undefined>()
	const [showCreateModal, setShowCreateModal] = useState<boolean>(false)

	const api = createAdminApi(auth.user?.access_token || '')

	const createRoom = async (roomName: string) => {
		request(
			async () => await api.putRoom(roomName, { usesWords: true }),
			{ message: `${roomName} created successfully!`, source: 'room-create', icon: faPlus },
			() => setShowCreateModal(false),
			() => setShowCreateModal(false)
		)
	}

	const deleteRoom = async (roomName: string) => {
		request(
			async () => await api.deleteRoom(roomName),
			{ message: `${roomName} deleted successfully!`, source: 'room', icon: faTrash },
			() => setDeleteModalRoomName(undefined),
			() => setDeleteModalRoomName(undefined)
		)
	}

	return (
		<div className="list room-list">
			<Header
				title="Rooms"
				color="blue"
				className="corner-right"
				leftActions={<FontAwesomeIcon icon={faDoorOpen} size="lg" />}
				rightActions={<Button color="blue" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
			/>
			<Table
				color="blue"
				headers={[
					{ element: 'Room name' },
					{ element: '# players' },
					{ element: 'Uses words?' },
					{ element: '# word lists' },
					{
						element: (
							<div className="buttons">
								<NotificationAwareButton
									notificationSources={['room-create']}
									color="green"
									onClick={() => setShowCreateModal(true)}
									iconProps={{ icon: faPlus }}
								/>
							</div>
						),
					},
				]}
				rows={rooms.map((room) => {
					return {
						name: room.name,
						cells: [
							{ element: room.name },
							{ element: room.numPlayers.toString() },
							{ element: <FontAwesomeIcon icon={room.usesWords ? faCheck : faXmark} /> },
							{ element: room.usesWords ? room.numWordLists.toString() : 'N/A' },
							{
								element: (
									<div className="buttons">
										<Button
											color="primary"
											iconProps={{ icon: faTrash }}
											onClick={(e) => {
												e.stopPropagation()
												setDeleteModalRoomName(room.name)
											}}
										/>
									</div>
								),
							},
						],
						onClick: () => navigate(room.name),
					}
				})}
			/>
			<ConfirmModal
				open={!!deleteModalRoomName}
				text={`Are you sure you want to delete ${deleteModalRoomName}?`}
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				onConfirm={() => deleteRoom(deleteModalRoomName!)}
				onClose={() => setDeleteModalRoomName(undefined)}
			/>
			<CreateModal
				open={showCreateModal}
				text="Room name"
				description="The name of the room to create. Must be unique."
				onCreate={(val) => createRoom(val)}
				onClose={() => setShowCreateModal(false)}
			/>
		</div>
	)
}
