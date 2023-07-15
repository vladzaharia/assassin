import { useLoaderData, useNavigate, useRevalidator } from 'react-router-dom'
import './room-list.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { faCheck, faDoorOpen, faTrash, faXmark, faPlus } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BasicRoom } from 'assassin-server-client'
import Table from '../../../components/table/table'
import { useContext, useState } from 'react'
import { ConfirmModal } from '../../../components/modal/modal'
import { createAdminApi } from '../../../api'
import { useAuth } from 'react-oidc-context'
import { NotificationContext } from '../../../context/notification'
import { isAxiosError } from 'axios'

export default function RoomsAdmin() {
	const rooms = useLoaderData() as BasicRoom[]
	const navigate = useNavigate()
	const auth = useAuth()
	const { revalidate } = useRevalidator()
	const { setError, setNotification } = useContext(NotificationContext)

	const [deleteModalRoomName, setDeleteModalRoomName] = useState<string | undefined>()

	const api = createAdminApi(auth.user?.access_token || '')

	const deleteRoom = async (roomName: string) => {
		try {
			await api.deleteRoom(roomName)
			setNotification({
				message: `${roomName} deleted successfully!`,
				notificationType: 'success',
				source: 'room',
				icon: faTrash,
			})

			setDeleteModalRoomName(undefined)

			revalidate()
		} catch (e) {
			setDeleteModalRoomName(undefined)

			if (isAxiosError(e)) {
				setError(e.response?.data || e.message, 'room')
			} else {
				setError('Something went wrong!', 'room')
			}
		}
	}

	return (
		<div className="list room-list">
			<Header
				title="Rooms"
				className="blue corner-right"
				leftActions={<FontAwesomeIcon icon={faDoorOpen} size="lg" />}
				rightActions={<Button className="blue" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
			/>
			<Table
				className="blue"
				headers={[
					{ element: 'Room name' },
					{ element: '# players' },
					{ element: 'Uses words?' },
					{ element: '# word lists' },
					{
						element: (
							<div className="buttons">
								<Button className="green" iconProps={{ icon: faPlus }} />
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
							{ element: room.numWordLists.toString() },
							{
								element: (
									<div className="buttons">
										<Button
											className="primary"
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
		</div>
	)
}
