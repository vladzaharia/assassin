import { useLoaderData, useNavigate } from 'react-router-dom'
import './wordlist-list.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { faPlus, faTextSize, faTrash, faXmark } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BasicWordlist } from 'assassin-server-client'
import Table from '../../../components/table/table'
import room from '../room/room'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { AddToLibrary } from '../../../components/icons/icons'
import { useState } from 'react'
import { createAdminApi } from '../../../api'
import { useAuth } from 'react-oidc-context'
import { useNotificationAwareRequest } from '../../../hooks/notification'
import { ConfirmModal } from '../../../components/modal/modal'
import useReload from '../../../hooks/reload'

export default function WordlistsAdmin() {
	const wordlists = useLoaderData() as BasicWordlist[]
	useReload(wordlists)
	const navigate = useNavigate()
	const auth = useAuth()
	const request = useNotificationAwareRequest()
	const [deleteModalWordListName, setDeleteModalWordListName] = useState<string | undefined>()

	const api = createAdminApi(auth.user?.access_token || '')

	const deleteWordList = async (wordListName: string) => {
		request(async () => await api.deleteWordList(wordListName), {
			message: `${wordListName} deleted successfully!`,
			source: 'wordlist',
			icon: faTrash,
		}, () => setDeleteModalWordListName(undefined), () => setDeleteModalWordListName(undefined))
	}

	AddToLibrary()

	return (
		<div className="list wordlist-list">
			<Header
				title="Word lists"
				className="green corner-right"
				leftActions={<FontAwesomeIcon icon={faTextSize} size="lg" />}
				rightActions={<Button className="green" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
			/>
			<Table
				className="green"
				headers={[
					{ element: 'Word list name' },
					{ element: '# words' },
					{
						element: (
							<div className="buttons">
								<Button className="green" iconProps={{ icon: faPlus }} />
							</div>
						),
					},
				]}
				rows={wordlists.map((list) => {
					return {
						name: room.name,
						cells: [
							{
								element: (
									<>
										<FontAwesomeIcon className="mr-05" icon={(list.icon as IconProp) || faTextSize} /> {list.name}
									</>
								),
							},
							{ element: list.numWords.toString() },
							{
								element: (
									<div className="buttons">
										<Button
											className="primary"
											iconProps={{ icon: faTrash }}
											onClick={(e) => {
												e.stopPropagation()
												setDeleteModalWordListName(list.name)
											}}
										/>
									</div>
								),
							},
						],
						onClick: () => navigate(list.name),
					}
				})}
			/>
			<ConfirmModal
				open={!!deleteModalWordListName}
				text={`Are you sure you want to delete ${deleteModalWordListName}?`}
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				onConfirm={() => deleteWordList(deleteModalWordListName!)}
				onClose={() => setDeleteModalWordListName(undefined)}
			/>
		</div>
	)
}
