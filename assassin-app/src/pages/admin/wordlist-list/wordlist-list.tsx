import { useLoaderData, useNavigate } from 'react-router-dom'
import './wordlist-list.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import {
	IconName,
	faPlus,
	faShieldCheck,
	faTextSize,
	faTrash,
	faCheck,
	faUpFromDottedLine,
	faUpFromLine,
	faXmark,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Table from '../../../components/table/table'
import room from '../room/room'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { AddToLibrary } from '../../../components/icons/icons'
import { useState } from 'react'
import { createAdminApi } from '../../../api'
import { useAuth } from 'react-oidc-context'
import { useNotificationAwareRequest } from '../../../hooks/notification'
import Modal, { ConfirmModal } from '../../../components/modal/modal'
import useReload from '../../../hooks/reload'
import WordlistDetails from '../../../components/wordlist-details/wordlist-details'
import SectionTitle from '../../../components/section-title/section-title'
import { WordListLoaderData } from '../../../loaders/wordlists'
import Pill from '../../../components/pill/pill'

export default function WordlistsAdmin() {
	const wordlists = useLoaderData() as WordListLoaderData
	useReload(wordlists)
	const navigate = useNavigate()
	const auth = useAuth()
	const request = useNotificationAwareRequest()
	const [deleteModalWordListName, setDeleteModalWordListName] = useState<string | undefined>()
	const [showCreateModal, setShowCreateModal] = useState<boolean>(false)

	const api = createAdminApi(auth.user?.access_token || '')
	const deleteWordList = async (wordListName: string) => {
		await request(
			async () => await api.deleteWordList(wordListName),
			{
				message: `${wordListName} deleted successfully!`,
				source: 'wordlist',
				icon: faTrash,
			},
			() => setDeleteModalWordListName(undefined),
			() => setDeleteModalWordListName(undefined)
		)
	}

	const importWordList = async (wordListName: string) => {
		await request(async () => await api.importWordList(wordListName), {
			message: `${wordListName} imported successfully!`,
			source: 'wordlist',
			icon: faUpFromLine,
		})
	}

	AddToLibrary()

	return (
		<div className="list wordlist-list">
			<Header
				title="Word lists"
				color="green"
				className="corner-right"
				leftActions={<FontAwesomeIcon icon={faTextSize} size="lg" />}
				rightActions={<Button color="green" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
			/>
			<Table
				color="green"
				headers={[
					{ element: 'Word list name' },
					{ element: 'Managed?' },
					{ element: '# words' },
					{
						element: (
							<div className="buttons">
								<Button color="green" iconProps={{ icon: faPlus }} onClick={() => setShowCreateModal(true)} />
							</div>
						),
					},
				]}
				rows={wordlists.wordLists.map((list) => {
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
							{
								element: <FontAwesomeIcon icon={list.managed ? faCheck : faXmark} />,
							},
							{ element: list.numWords.toString() },
							{
								element: (
									<div className="buttons">
										<Button
											color="primary"
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
			{wordlists.managedLists.length > 0 ? (
				<div className="wordlist-available">
					<SectionTitle color="green">
						<FontAwesomeIcon className="mr-1" icon={faShieldCheck} /> Managed word lists
					</SectionTitle>
					<div className="wordlist-available-list">
						{wordlists.managedLists.map((wl) => (
							<Pill
								color={wl.reason === 'update' ? 'orange' : 'green'}
								text={
									<>
										<FontAwesomeIcon className="mr-05" icon={(wl.icon as IconName) || faTextSize} />
										{wl.name}
									</>
								}
								onAction={() => importWordList(wl.name)}
								actionIcon={wl.reason === 'update' ? faUpFromDottedLine : faUpFromLine}
							/>
						))}
					</div>
				</div>
			) : undefined}

			<ConfirmModal
				title={`Delete ${deleteModalWordListName}?`}
				icon={faTrash}
				open={!!deleteModalWordListName}
				text={`Are you sure you want to delete ${deleteModalWordListName}?`}
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				onConfirm={() => deleteWordList(deleteModalWordListName!)}
				onClose={() => setDeleteModalWordListName(undefined)}
			/>
			<Modal className="create-modal" open={showCreateModal} onClose={() => setShowCreateModal(false)}>
				<>
					<Header
						className="corner-left-05 corner-right-05"
						title={
							<>
								<FontAwesomeIcon className="mr-05" icon={faTextSize} /> Add word list
							</>
						}
						rightActions={
							<div className="modal-header-buttons">
								<Button color="primary" iconProps={{ icon: faXmark }} onClick={() => setShowCreateModal(false)} />
							</div>
						}
					/>
					<WordlistDetails inModal onClose={() => setShowCreateModal(false)} />
				</>
			</Modal>
		</div>
	)
}
